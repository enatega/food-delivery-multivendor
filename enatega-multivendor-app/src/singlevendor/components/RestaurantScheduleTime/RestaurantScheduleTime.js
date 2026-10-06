import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SCHEDULE_UNTIL_NEXT_DAY_OFF } from '../../apollo/queries'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale } from '../../../utils/scaling'
import { Feather } from '@expo/vector-icons'

// Header geometry shared with the Home header (Android) and the tab header
// (iOS) so the address always reserves exactly the space the pill takes.
export const SCHEDULE_PILL_WIDTH = scale(132)
export const SCHEDULE_PILL_INSET = scale(12)
export const SCHEDULE_PILL_RESERVED = SCHEDULE_PILL_WIDTH + SCHEDULE_PILL_INSET + scale(8)

const WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const DAY_PATTERN = /\b(MON|TUE|WED|THU|FRI|SAT|SUN)\b/

// "MON-WED, FRI" -> ['MON', 'TUE', 'WED', 'FRI']
const expandDays = (label = '') =>
  label.split(',').flatMap((part) => {
    const [start, end] = part.trim().split('-').map((code) => code.trim())
    const from = WEEK.indexOf(start)
    if (from < 0) return []
    const to = end ? WEEK.indexOf(end) : from
    if (to < 0) return [start]
    const days = []
    for (let i = from; ; i = (i + 1) % 7) {
      days.push(WEEK[i])
      if (i === to) break
    }
    return days
  })

// The API sends `openDaysTimes` as "MON-WED 09:00-17:00; FRI 10:00-16:00"
// plus Saturday separately. Split it into { days, hours } groups.
export const parseScheduleGroups = ({ openDaysTimes, saturdaySlotString } = {}) => {
  const groups = (openDaysTimes || '')
    .split(';')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      // Days run up to the first digit (the first time slot).
      const firstDigit = segment.search(/\d/)
      const daysLabel = (firstDigit > 0 ? segment.slice(0, firstDigit) : segment).trim().replace(/,\s*$/, '')
      const hours = firstDigit >= 0 ? segment.slice(firstDigit).trim() : ''
      return DAY_PATTERN.test(daysLabel) ? { label: daysLabel, days: expandDays(daysLabel), hours } : null
    })
    .filter((group) => group && group.hours)

  const saturdayHours = saturdaySlotString?.trim()
  if (saturdayHours) groups.push({ label: 'SAT', days: ['SAT'], hours: saturdayHours })
  return groups
}

// Today's group, otherwise the next day that opens, otherwise the first.
const pickGroupForToday = (groups, todayIndex) => {
  for (let offset = 0; offset < 7; offset++) {
    const day = WEEK[(todayIndex + offset) % 7]
    const match = groups.find((group) => group.days.includes(day))
    if (match) return match
  }
  return groups[0]
}

const RestaurantScheduleTime = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])

  const { data, loading, error, refetch } = useQuery(
    GET_SCHEDULE_UNTIL_NEXT_DAY_OFF,
    { fetchPolicy: 'cache-and-network' }
  )

  const scheduleSummary = useMemo(() => {
    const schedule = data?.getScheduleUntilNextDayOff
    if (!schedule) return null

    const formatDaysLabel = (label) =>
      (label || '')
        .replace(/\b(MON|TUE|WED|THU|FRI|SAT|SUN)\b/g, (dayCode) => t(dayCode, { defaultValue: dayCode }))
        .replace(/-/g, '–')

    const groups = parseScheduleGroups(schedule)
    if (!groups.length) return null

    const current = pickGroupForToday(groups, new Date().getDay())
    return {
      // Top line: the days; bottom line: only that group's times.
      days: formatDaysLabel(current.label),
      hours: current.hours.replace(/\s*-\s*/g, '–'),
      accessibilityText: groups
        .map((group) => `${formatDaysLabel(group.label)} ${group.hours}`)
        .join(', ')
    }
  }, [data, t])

  const hasSchedule = Boolean(
    scheduleSummary?.days || scheduleSummary?.hours
  )
  const unavailableText = t('hoursUnavailable', {
    defaultValue: 'Hours unavailable'
  })

  return (
    <Pressable
      accessible
      accessibilityLabel={
        hasSchedule
          ? `${t('openingHours', { defaultValue: 'Opening hours' })}: ${scheduleSummary.accessibilityText}`
          : unavailableText
      }
      style={styles(currentTheme).container}
      disabled={!error || loading}
      onPress={() => refetch().catch(() => {})}
    >
      <View style={styles(currentTheme).iconContainer}>
        {loading && !data
          ? (
            <ActivityIndicator
              size='small'
              color={currentTheme.singleVendorBrandForeground}
            />
            )
          : (
            <Feather
              name={error ? 'refresh-cw' : 'clock'}
              size={scale(16)}
              color={currentTheme.singleVendorBrandForeground}
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
          numberOfLines={1}
          ellipsizeMode='tail'
          style={styles(currentTheme).hours}
        >
          {hasSchedule ? scheduleSummary.hours : error ? '—' : ''}
        </TextDefault>
      </View>
    </Pressable>
  )
}

export default RestaurantScheduleTime

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: currentTheme.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      width: SCHEDULE_PILL_WIDTH,
      height: scale(40),
      paddingLeft: scale(5),
      paddingRight: scale(10),
      borderRadius: 999,
      backgroundColor: currentTheme.singleVendorBrandSubtle,
      borderColor: currentTheme.newBorderColor2 || currentTheme.colorBorder,
      borderWidth: StyleSheet.hairlineWidth
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: scale(30),
      height: scale(30),
      marginRight: currentTheme.isRTL ? 0 : scale(7),
      marginLeft: currentTheme.isRTL ? scale(7) : 0,
      borderRadius: scale(15),
      backgroundColor: currentTheme.cardBackground
    },
    content: {
      flex: 1,
      minWidth: 0
    },
    days: {
      fontSize: scale(9),
      lineHeight: scale(11),
      letterSpacing: 0.3,
      textAlign: currentTheme.isRTL ? 'right' : 'left'
    },
    hours: {
      fontSize: scale(12),
      lineHeight: scale(15),
      textAlign: currentTheme.isRTL ? 'right' : 'left'
    }
  })
