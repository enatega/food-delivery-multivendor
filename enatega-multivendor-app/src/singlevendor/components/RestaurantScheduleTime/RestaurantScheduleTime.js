import { StyleSheet, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SCHEDULE_UNTIL_NEXT_DAY_OFF } from '../../apollo/queries'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import { MaterialIcons } from '@expo/vector-icons'

const RestaurantScheduleTime = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])

  const { data } = useQuery(GET_SCHEDULE_UNTIL_NEXT_DAY_OFF)

  const scheduleText = useMemo(() => {
    const schedule = data?.getScheduleUntilNextDayOff
    if (!schedule) return ''
    const { openDaysString, openDaysTimes, saturdaySlotString } = schedule
    const formatDaysLabel = (label) => {
      if (!label) return ''
      const parts = label.split('-').map((part) => {
        const trimmed = part.trim()
        if (!trimmed) return trimmed
        return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1).toLowerCase()}`
      })
      return parts.join('-')
    }

    const appendUhr = (value) => {
      if (!value) return ''
      return value.trim().endsWith('Uhr') ? value.trim() : `${value.trim()} Uhr`
    }

    const firstLine = [formatDaysLabel(openDaysString), `${appendUhr(openDaysTimes)}`].filter(Boolean).join(' ')
    const secondLine = saturdaySlotString ? `Samstag ${appendUhr(saturdaySlotString)}` : ''
    return [firstLine, secondLine].filter(Boolean).join('\n')
  }, [data])

  return (
    <View style={styles(currentTheme).container}>
      <MaterialIcons name='delivery-dining' size={16} color='black' style={styles(currentTheme).icon} />
      <TextDefault small bold numberOfLines={2} ellipsizeMode='tail' style={styles(currentTheme).text} >
        {scheduleText}
      </TextDefault>
    </View>
  )
}

export default RestaurantScheduleTime

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: scale(5),
      backgroundColor: currentTheme.gray200 || '#E5E7EB'
    },
    icon: {
      marginRight: 6,
      marginTop: 0
    }
  })
