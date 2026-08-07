import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import TextDefault from '../Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { ORDER_STATUS_ENUM } from '../../utils/enums'

const DELIVERY_STEPS = [
  { key: ORDER_STATUS_ENUM.PENDING, label: 'Order placed', icon: 'shopping-bag' },
  { key: ORDER_STATUS_ENUM.ACCEPTED, label: 'Order accepted', icon: 'check' },
  { key: ORDER_STATUS_ENUM.ASSIGNED, label: 'Rider assigned', icon: 'user' },
  { key: ORDER_STATUS_ENUM.PICKED, label: 'Picked up', icon: 'package' },
  { key: ORDER_STATUS_ENUM.DELIVERED, label: 'Delivered', icon: 'home' }
]

const PICKUP_STEPS = [
  { key: ORDER_STATUS_ENUM.PENDING, label: 'Order placed', icon: 'shopping-bag' },
  { key: ORDER_STATUS_ENUM.ACCEPTED, label: 'Order accepted', icon: 'check' },
  { key: ORDER_STATUS_ENUM.COMPLETED, label: 'Ready for collection', icon: 'package' },
  { key: ORDER_STATUS_ENUM.DELIVERED, label: 'Collected', icon: 'check-circle' }
]

const OrderStatusTimeline = ({ currentStatus, isPickup, theme }) => {
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
            <View style={styles(theme).rail}>
              <View style={[
                styles(theme).iconCircle,
                highlighted && styles(theme).iconCircleHighlighted,
                active && styles(theme).iconCircleActive
              ]}>
                {step.icon === 'package' ? (
                  <Feather name='package' size={scale(15)} color={highlighted ? theme.colors.onAccent : theme.colors.iconMuted} />
                ) : step.key === ORDER_STATUS_ENUM.PICKED ? (
                  <MaterialCommunityIcons name='bike-fast' size={scale(16)} color={highlighted ? theme.colors.onAccent : theme.colors.iconMuted} />
                ) : (
                  <Feather
                    name={completed ? 'check' : step.icon}
                    size={scale(15)}
                    color={highlighted ? theme.colors.onAccent : theme.colors.iconMuted}
                  />
                )}
              </View>
              {!last && (
                <View style={[
                  styles(theme).connector,
                  completed && styles(theme).connectorHighlighted
                ]} />
              )}
            </View>
            <View style={styles(theme).labelWrap}>
              <TextDefault
                H5
                bold={highlighted}
                textColor={highlighted ? theme.colors.textPrimary : theme.colors.textTertiary}
              >
                {step.label}
              </TextDefault>
              {active && (
                <TextDefault small textColor={theme.colors.accent} style={styles(theme).currentLabel}>
                  Current status
                </TextDefault>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = (theme) => StyleSheet.create({
  container: {
    paddingTop: scale(4)
  },
  step: {
    minHeight: scale(54),
    flexDirection: theme.isRTL ? 'row-reverse' : 'row'
  },
  rail: {
    width: scale(34),
    alignItems: 'center'
  },
  iconCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderSubtle
  },
  iconCircleHighlighted: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent
  },
  iconCircleActive: {
    borderWidth: scale(2)
  },
  connector: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: scale(20),
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: scale(3)
  },
  connectorHighlighted: {
    width: scale(2),
    backgroundColor: theme.colors.accent
  },
  labelWrap: {
    flex: 1,
    paddingTop: scale(4),
    paddingHorizontal: scale(12)
  },
  currentLabel: {
    marginTop: scale(2)
  }
})

export default OrderStatusTimeline
