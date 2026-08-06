import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ConfigurationContext from '../../../context/Configuration'
import OrdersContext from '../../../context/Orders'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { calulateRemainingTime } from '../../../utils/customFunctions'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { checkStatus } from './ProgressBar'
import styles from './styles'

const ACTIVE_STATUSES = ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED']
const PROGRESS_BY_STATUS = {
  PENDING: 1,
  ACCEPTED: 2,
  ASSIGNED: 3,
  PICKED: 4
}
const TIMELINE_SEGMENTS = 6

const getItemCount = (items = []) =>
  items.reduce((total, item) => total + (item?.quantity || 0), 0)

const getRemainingTime = (order, currentTime) => {
  if (!order?.createdAt || !order?.expectedTime) {
    return calulateRemainingTime(order)
  }

  const createdAt = new Date(order.createdAt)
  if (Number.isNaN(createdAt.getTime())) return calulateRemainingTime(order)

  const expectedAt = createdAt.getTime() + Number(order.expectedTime) * 60000
  const minutes = Math.max(0, Math.ceil((expectedAt - currentTime.getTime()) / 60000))
  return minutes || calulateRemainingTime(order)
}

const ActiveOrders = ({ onActiveOrdersChange }) => {
  const { t, i18n } = useTranslation()
  const { loadingOrders, orders = [] } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles({ ...tokens, isRTL: i18n.dir() === 'rtl' })
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
  const remainingTime = getRemainingTime(order, currentTime)
  const progressCount = PROGRESS_BY_STATUS[order?.orderStatus] ?? 1
  const orderNumber = order?.orderId || order?.id || order?._id?.slice(-6) || '--'
  const restaurantName = order?.restaurant?.name || t('Restaurant')
  const address = order?.deliveryAddress?.deliveryAddress || order?.restaurant?.address
  const itemCount = getItemCount(order?.items)
  const statusText = t(checkStatus(order?.orderStatus).statusText)

  const openOrder = () => {
    navigation.navigate('OrderDetail', {
      _id: order._id,
      order,
      currencySymbol: configuration.currencySymbol
    })
  }

  return (
    <View style={themedStyles.card}>
      <TouchableOpacity
        activeOpacity={0.86}
        accessibilityRole='button'
        accessibilityLabel={`${statusText}. ${t('orderTracking')}`}
        onPress={openOrder}
      >
        <View style={themedStyles.headerRow}>
          <View style={themedStyles.titleWrap}>
            <TextDefault bolder numberOfLines={2} style={themedStyles.title}>
              {statusText}
            </TextDefault>
            <TextDefault numberOfLines={1} style={themedStyles.subtitle}>
              {remainingTime > 0
                ? `${remainingTime}-${remainingTime + 5} ${t('mins')}`
                : t('orderTracking')}
            </TextDefault>
          </View>

          <View style={themedStyles.statusIcon}>
            <MaterialIcons name='delivery-dining' size={scale(22)} color={tokens.colors.accent} />
          </View>
        </View>

        <View style={themedStyles.progressRow}>
          {Array.from({ length: TIMELINE_SEGMENTS }).map((_, index) => (
            <View
              key={`active-order-progress-${index}`}
              style={[
                themedStyles.progressSegment,
                index !== TIMELINE_SEGMENTS - 1 && themedStyles.progressSpacing,
                index < progressCount && themedStyles.progressActive
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>

      <ScrollView
        style={themedStyles.metaScroller}
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        keyboardShouldPersistTaps='handled'
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={themedStyles.metaRow}
      >
        <View style={[themedStyles.metaPill, themedStyles.metaSpacing]}>
          <MaterialIcons name='tag' size={scale(17)} color={tokens.colors.textPrimary} />
          <TextDefault numberOfLines={1} style={themedStyles.metaText}>#{orderNumber}</TextDefault>
        </View>
        <View style={[themedStyles.metaPill, themedStyles.metaSpacing]}>
          <MaterialIcons name='restaurant' size={scale(17)} color={tokens.colors.textPrimary} />
          <TextDefault numberOfLines={1} style={themedStyles.metaText}>{restaurantName}</TextDefault>
        </View>
        <View style={themedStyles.metaPill}>
          <MaterialIcons name='shopping-bag' size={scale(17)} color={tokens.colors.textPrimary} />
          <TextDefault numberOfLines={1} style={themedStyles.metaText}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </TextDefault>
        </View>
      </ScrollView>

      {!!address && (
        <TouchableOpacity
          activeOpacity={0.72}
          accessibilityRole='button'
          accessibilityLabel={address}
          onPress={openOrder}
          style={themedStyles.addressRow}
        >
          <MaterialIcons name='location-on' size={scale(17)} color={tokens.colors.textMuted} />
          <TextDefault numberOfLines={2} style={themedStyles.addressText}>{address}</TextDefault>
          {activeOrders.length > 1 && (
            <TextDefault style={themedStyles.moreText}>+{activeOrders.length - 1}</TextDefault>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ActiveOrders
