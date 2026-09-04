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

  return (
    <View style={styles(theme).container}>
      {steps.map((step, index) => {
        const completed = index < currentIndex
        const active = index === currentIndex
        const highlighted = completed || active
        const last = index === steps.length - 1

        return (
          <View key={step.key} style={styles(theme).step}>
            <View style={styles(theme).progressRow}>
              <View style={[styles(theme).iconCircle, highlighted && styles(theme).iconCircleHighlighted, active && styles(theme).iconCircleActive]}>
                <Feather name={completed ? 'check' : step.icon} size={scale(14)} color={highlighted ? theme.colors.onAccent : theme.colors.iconMuted} />
              </View>
              {!last && <View style={[styles(theme).connector, completed && styles(theme).connectorHighlighted]} />}
            </View>
            <TextDefault small bold={active} center numberOfLines={2} textColor={highlighted ? theme.colors.textPrimary : theme.colors.textTertiary} style={styles(theme).label}>
              {t(step.label, { defaultValue: step.fallback })}
            </TextDefault>
          </View>
        )
      })}
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: theme.isRTL ? 'row-reverse' : 'row',
      paddingTop: scale(2)
    },
    step: {
      flex: 1,
      minWidth: 0
    },
    progressRow: {
      alignItems: 'center',
      flexDirection: theme.isRTL ? 'row-reverse' : 'row'
    },
    iconCircle: {
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceSubtle,
      borderColor: theme.colors.borderSubtle,
      borderRadius: scale(15),
      borderWidth: StyleSheet.hairlineWidth,
      height: scale(30),
      justifyContent: 'center',
      width: scale(30)
    },
    iconCircleHighlighted: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent
    },
    iconCircleActive: {
      borderColor: theme.colors.textPrimary,
      borderWidth: scale(2)
    },
    connector: {
      backgroundColor: theme.colors.borderSubtle,
      flex: 1,
      height: scale(2)
    },
    connectorHighlighted: {
      backgroundColor: theme.colors.accent
    },
    label: {
      fontSize: scale(10),
      lineHeight: scale(13),
      marginEnd: scale(4),
      marginTop: scale(6)
    }
  })

export default OrderStatusTimeline
