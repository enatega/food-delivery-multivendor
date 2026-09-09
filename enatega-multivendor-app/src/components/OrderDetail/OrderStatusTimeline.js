import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import TextDefault from '../Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { ORDER_STATUS_ENUM } from '../../utils/enums'

const DELIVERY_STEPS = [
  { key: ORDER_STATUS_ENUM.PENDING, label: 'orderPlaced', fallback: 'Placed', icon: 'shopping-bag' },
  { key: ORDER_STATUS_ENUM.ACCEPTED, label: 'orderAccepted', fallback: 'Accepted', icon: 'check' },
  { key: ORDER_STATUS_ENUM.ASSIGNED, label: 'riderAssigned', fallback: 'Rider', icon: 'user' },
  { key: ORDER_STATUS_ENUM.PICKED, label: 'pickedUp', fallback: 'Picked up', icon: 'package' },
  { key: ORDER_STATUS_ENUM.DELIVERED, label: 'delivered', fallback: 'Delivered', icon: 'home' }
]

const PICKUP_STEPS = [
  { key: ORDER_STATUS_ENUM.PENDING, label: 'orderPlaced', fallback: 'Placed', icon: 'shopping-bag' },
  { key: ORDER_STATUS_ENUM.ACCEPTED, label: 'orderAccepted', fallback: 'Accepted', icon: 'check' },
  { key: ORDER_STATUS_ENUM.COMPLETED, label: 'readyForCollection', fallback: 'Ready', icon: 'package' },
  { key: ORDER_STATUS_ENUM.DELIVERED, label: 'collected', fallback: 'Collected', icon: 'check-circle' }
]

const OrderStatusTimeline = ({ currentStatus, isPickup, theme }) => {
  const { t } = useTranslation()
  const steps = isPickup ? PICKUP_STEPS : DELIVERY_STEPS
  let currentIndex = steps.findIndex((step) => step.key === currentStatus)

  if (currentStatus === ORDER_STATUS_ENUM.COMPLETED && !isPickup) {
    currentIndex = steps.length - 1
  }
  if ([ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(currentStatus)) {
    currentIndex = 0
  }

  const safeCurrentIndex = Math.max(0, currentIndex)
  const progressPercent = steps.length > 1 ? `${(safeCurrentIndex / (steps.length - 1)) * 100}%` : '0%'
  const railInset = `${50 / steps.length}%`

  return (
    <View accessibilityRole='progressbar' accessibilityValue={{ min: 1, max: steps.length, now: safeCurrentIndex + 1 }} style={styles(theme).container}>
      <View pointerEvents='none' style={[styles(theme).rail, { left: railInset, right: railInset }]}>
        <View
          style={[
            styles(theme).railProgress,
            {
              alignSelf: theme.isRTL ? 'flex-end' : 'flex-start',
              width: progressPercent
            }
          ]}
        />
      </View>
      {steps.map((step, index) => {
        const completed = index < currentIndex
        const active = index === currentIndex
        const highlighted = completed || active
        const iconColor = completed ? theme.colors.textOnAccent : active ? theme.colors.accentForeground : theme.colors.iconMuted

        return (
          <View accessibilityLabel={t(step.label, { defaultValue: step.fallback })} accessibilityState={{ selected: active }} key={step.key} style={styles(theme).step}>
            <View style={styles(theme).circleSlot}>
              {active && <View style={styles(theme).activeAura} />}
              <View style={[styles(theme).iconCircle, completed && styles(theme).iconCircleCompleted, active && styles(theme).iconCircleActive]}>
                <Feather name={completed ? 'check' : step.icon} size={active ? scale(16) : scale(14)} color={iconColor} />
              </View>
            </View>
            <TextDefault small bold={active} center numberOfLines={2} textColor={active ? theme.colors.accentForeground : highlighted ? theme.colors.textPrimary : theme.colors.textTertiary} style={styles(theme).label}>
              {t(step.label, { defaultValue: step.fallback })}
            </TextDefault>
            {active && <View style={styles(theme).activeUnderline} />}
          </View>
        )
      })}
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      flexDirection: theme.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      paddingTop: scale(2),
      position: 'relative',
      width: '100%'
    },
    step: {
      alignItems: 'center',
      flex: 1,
      minWidth: 0,
      position: 'relative'
    },
    rail: {
      backgroundColor: theme.colors.borderSubtle,
      height: scale(3),
      position: 'absolute',
      top: scale(21)
    },
    railProgress: {
      backgroundColor: theme.colors.accent,
      borderRadius: scale(2),
      height: '100%'
    },
    circleSlot: {
      alignItems: 'center',
      height: scale(44),
      justifyContent: 'center',
      position: 'relative',
      width: '100%'
    },
    activeAura: {
      backgroundColor: theme.colors.accentSubtle,
      borderRadius: scale(23),
      height: scale(46),
      position: 'absolute',
      width: scale(46)
    },
    iconCircle: {
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceSubtle,
      borderColor: theme.colors.borderSubtle,
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      height: scale(32),
      justifyContent: 'center',
      width: scale(32)
    },
    iconCircleCompleted: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent
    },
    iconCircleActive: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.accent,
      borderWidth: scale(3),
      height: scale(38),
      width: scale(38),
      borderRadius: scale(19)
    },
    label: {
      fontSize: scale(10),
      lineHeight: scale(13),
      marginTop: scale(4),
      minHeight: scale(26),
      paddingHorizontal: scale(2),
      textAlign: 'center',
      width: '100%'
    },
    activeUnderline: {
      backgroundColor: theme.colors.accent,
      borderRadius: scale(1),
      height: scale(2),
      marginTop: scale(2),
      width: scale(18)
    }
  })

export default OrderStatusTimeline
