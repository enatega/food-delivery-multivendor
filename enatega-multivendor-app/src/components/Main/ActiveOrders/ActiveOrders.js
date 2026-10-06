import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ConfigurationContext from '../../../context/Configuration'
import OrdersContext from '../../../context/Orders'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { calulateRemainingTime } from '../../../utils/customFunctions'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LiveDot } from '../../../singlevendor/screens/Checkout/HomeCart'
import styles from './styles'

const ACTIVE_STATUSES = ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED']
const DELIVERY_PROGRESS = { PENDING: 1, ACCEPTED: 2, ASSIGNED: 3, PICKED: 4 }
const PICKUP_PROGRESS = { PENDING: 1, ACCEPTED: 2, ASSIGNED: 2, PICKED: 2 }
const DELIVERY_SEGMENTS = 6
const PICKUP_SEGMENTS = 2

const getTitle = (status, isPickup) => {
  if (status === 'PICKED') return isPickup ? 'Your order is ready for collection' : 'Your order is on the way'
  if (status === 'ASSIGNED' && !isPickup) return 'Rider assigned to your order'
  if (status === 'ACCEPTED') return isPickup ? 'Your order is being prepared for collection' : 'Your order is being prepared'
  return 'Order placed'
}

const getIcon = (status, isPickup) => {
  if (status === 'PICKED') return isPickup ? 'bag-check-outline' : 'bicycle'
  if (status === 'ASSIGNED' && !isPickup) return 'person-outline'
  if (status === 'ACCEPTED') return 'restaurant-outline'
  return 'receipt-outline'
}

const getItemCount = (items = []) =>
  items.reduce((total, item) => total + (item?.quantity || 0), 0)

const getRemainingTime = (order, currentTime) => {
  const target = order?.eta?.estimatedArrivalAt || order?.completionTime
  const targetDate = new Date(target)
  if (!target || Number.isNaN(targetDate.getTime())) return calulateRemainingTime(order)
  return Math.max(0, Math.ceil((targetDate.getTime() - currentTime.getTime()) / 60000))
}

// Mirrors the single-vendor Home "live activity" card (HomeCart) in a tighter
// footprint, fed by the multivendor orders context.
const ActiveOrders = ({ onActiveOrdersChange }) => {
  const { t, i18n } = useTranslation()
  const { loadingOrders, orders = [] } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { tokens } = useMultivendorTheme()
  const isRTL = i18n.dir() === 'rtl'
  const themedStyles = useMemo(() => styles({ ...tokens, isRTL }), [tokens, isRTL])
  const [currentTime, setCurrentTime] = useState(new Date())

  const activeOrders = useMemo(
    () => orders.filter((order) =>
      ACTIVE_STATUSES.includes(order?.orderStatus) &&
      (order?.paymentStatus === 'PAID' || order?.paymentMethod === 'COD')
    ),
    [orders]
  )

  useEffect(() => {
    onActiveOrdersChange?.(activeOrders.length > 0)
  }, [activeOrders.length, onActiveOrdersChange])

  useEffect(() => {
    if (!activeOrders.length) return undefined
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [activeOrders.length])

  if (loadingOrders || !activeOrders.length) return null

  const order = activeOrders[0]
  const status = order?.orderStatus
  const isPickup = !!order?.isPickedUp
  const segments = isPickup ? PICKUP_SEGMENTS : DELIVERY_SEGMENTS
  const progressCount = (isPickup ? PICKUP_PROGRESS : DELIVERY_PROGRESS)[status] ?? 1
  const remainingTime = getRemainingTime(order, currentTime)
  const showEta = remainingTime > 0
  const title = getTitle(status, isPickup)
  const subtitle = showEta
    ? t(isPickup ? 'Ready for collection in' : 'Estimated arrival in')
    : order?.restaurant?.name || t('Tracking your order')
  const orderNumber = order?.orderId || order?._id?.slice(-6)
  const address = isPickup
    ? order?.restaurant?.address
    : order?.deliveryAddress?.deliveryAddress || order?.restaurant?.address
  const itemCount = getItemCount(order?.items)
  const extraOrders = activeOrders.length - 1
  const { colors } = tokens

  const openOrder = () => {
    navigation.navigate('OrderDetail', {
      _id: order._id,
      order,
      currencySymbol: configuration.currencySymbol
    })
  }

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={`${t(title)}. ${subtitle}${showEta ? ` ${remainingTime} ${t('min')}` : ''}`}
      onPress={openOrder}
      style={({ pressed }) => [themedStyles.card, pressed && themedStyles.cardPressed]}
    >
      <LinearGradient
        pointerEvents='none'
        colors={[colors.accentSubtle, colors.surface]}
        locations={[0, 0.62]}
        style={StyleSheet.absoluteFill}
      />

      <View style={themedStyles.topRow}>
        <View style={themedStyles.statusChip}>
          <LiveDot color={colors.accent} animate={isFocused} />
          <TextDefault bold style={themedStyles.statusChipText} numberOfLines={1}>
            {t('Live', { defaultValue: 'Live' })}
          </TextDefault>
        </View>
        {!!orderNumber && (
          <TextDefault style={themedStyles.orderNumber} numberOfLines={1}>
            #{orderNumber}{extraOrders > 0 ? `  ·  +${extraOrders}` : ''}
          </TextDefault>
        )}
      </View>

      <View style={themedStyles.mainRow}>
        <View style={themedStyles.iconTile}>
          <Ionicons name={getIcon(status, isPickup)} size={scale(19)} color={colors.accentForeground} />
        </View>

        <View style={themedStyles.titleWrap}>
          <TextDefault bold style={themedStyles.title} numberOfLines={2}>
            {t(title)}
          </TextDefault>
          <TextDefault style={themedStyles.subtitle} numberOfLines={1}>
            {subtitle}
          </TextDefault>
        </View>

        {showEta
          ? (
            <View style={themedStyles.etaBlock}>
              <TextDefault bold style={themedStyles.etaValue}>{remainingTime}</TextDefault>
              <TextDefault style={themedStyles.etaUnit}>{t('min', { defaultValue: 'min' })}</TextDefault>
            </View>
            )
          : (
            <View style={themedStyles.chevron}>
              <Feather name={isRTL ? 'chevron-left' : 'chevron-right'} size={scale(16)} color={colors.textPrimary} />
            </View>
            )}
      </View>

      <View style={themedStyles.progressRow}>
        {Array.from({ length: segments }).map((_, index) => (
          <View
            key={index}
            style={[themedStyles.progressSegment, index < progressCount && themedStyles.progressActive]}
          />
        ))}
      </View>

      <View style={themedStyles.footer}>
        <View style={themedStyles.addressWrap}>
          <Ionicons
            name={isPickup ? 'storefront-outline' : 'location-outline'}
            size={scale(13)}
            color={colors.textMuted}
          />
          <TextDefault numberOfLines={1} style={themedStyles.addressText}>
            {address || t('Tracking your order')}
          </TextDefault>
        </View>
        {itemCount > 0 && (
          <View style={themedStyles.itemsPill}>
            <Feather name='shopping-bag' size={scale(10)} color={colors.textPrimary} />
            <TextDefault bold style={themedStyles.itemsText}>
              {itemCount} {itemCount === 1 ? t('item', { defaultValue: 'item' }) : t('items', { defaultValue: 'items' })}
            </TextDefault>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export default ActiveOrders
