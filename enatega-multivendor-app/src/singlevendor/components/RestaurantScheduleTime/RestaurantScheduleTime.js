import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SCHEDULE_UNTIL_NEXT_DAY_OFF } from '../../apollo/queries'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import { Feather } from '@expo/vector-icons'

const RestaurantScheduleTime = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])

  const { data, loading, error } = useQuery(
    GET_SCHEDULE_UNTIL_NEXT_DAY_OFF,
    { fetchPolicy: 'cache-and-network' }
  )

  const scheduleSummary = useMemo(() => {
    const schedule = data?.getScheduleUntilNextDayOff
    if (!schedule) return null
    const { openDaysString, openDaysTimes, saturdaySlotString } = schedule

    const formatDaysLabel = label => {
      if (!label) return ''
      return label
        .split('-')
        .map(day => {
          const dayCode = day.trim().toUpperCase()
          return t(dayCode, { defaultValue: dayCode })
        })
        .join('–')
    }

    const primaryDays = formatDaysLabel(openDaysString)
    const primaryHours = openDaysTimes?.trim() || ''
    const saturdayHours = saturdaySlotString?.trim() || ''
    const saturdayLabel = t('SAT', { defaultValue: 'SAT' })

    return {
      days: [primaryDays, saturdayHours ? saturdayLabel : '']
        .filter(Boolean)
        .join(' + '),
      hours: [primaryHours, saturdayHours]
        .filter(Boolean)
        .join(' / '),
      accessibilityText: [
        primaryDays && primaryHours
          ? `${primaryDays} ${primaryHours}`
          : '',
        saturdayHours ? `${saturdayLabel} ${saturdayHours}` : ''
      ].filter(Boolean).join(', ')
    }
  }, [data, t])

  const hasSchedule = Boolean(
    scheduleSummary?.days || scheduleSummary?.hours
  )
  const unavailableText = t('hoursUnavailable', {
    defaultValue: 'Hours unavailable'
  })

  return (
    <View
      accessible
      accessibilityLabel={
        hasSchedule
          ? `${t('openingHours', { defaultValue: 'Opening hours' })}: ${scheduleSummary.accessibilityText}`
          : unavailableText
      }
      style={styles(currentTheme).container}
    >
      <View style={styles(currentTheme).iconContainer}>
        {loading && !data
          ? (
            <ActivityIndicator
              size='small'
              color={currentTheme.main}
            />
            )
          : (
            <Feather
              name='clock'
              size={scale(16)}
              color={currentTheme.main}
            />
            )}
      </View>
      <View style={styles(currentTheme).content}>
        <TextDefault
          textColor={currentTheme.secondaryText}
          style={styles(currentTheme).days}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {hasSchedule
            ? scheduleSummary.days
            : loading
              ? t('loading', { defaultValue: 'Loading…' })
              : unavailableText}
        </TextDefault>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          small
          bold
          numberOfLines={2}
          ellipsizeMode='tail'
          style={styles(currentTheme).hours}
        >
          {hasSchedule ? scheduleSummary.hours : error ? '—' : ''}
        </TextDefault>
      </View>
    </View>
  )
}

export default RestaurantScheduleTime

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: scale(104),
      minHeight: scale(42),
      paddingHorizontal: scale(7),
      paddingVertical: scale(6),
      borderRadius: scale(12),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: currentTheme.cardBackground,
      borderColor: currentTheme.colorBorder,
      borderWidth: 1,
      borderRightWidth: 0,
      shadowColor: currentTheme.shadowColor || '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
      elevation: 6
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: scale(26),
      height: scale(26),
      marginRight: scale(6),
      borderRadius: scale(13),
      backgroundColor: `${currentTheme.main || '#0EA5E9'}18`
    },
    content: {
      flex: 1,
      minWidth: 0
    },
    days: {
      fontSize: scale(9),
      lineHeight: scale(11),
      marginBottom: scale(1)
    },
    hours: {
      fontSize: scale(12),
      lineHeight: scale(15)
    }
  })
