import React, { memo, useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'

import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import useOrderConfirmation from './useOrderConfirmation'
import useOrderTracking from './useOrderTracking'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import {
  SINGLE_VENDOR_TRACKING_STATUS,
  isSingleVendorPickupOrder
} from '../../utils/orderTrackingStatus'
import SectionErrorCard from '../../components/SectionErrorCard'
import { DISCOVERY_GUTTER } from '../../components/Home/discoveryLayout'

const DELIVERY_TIMELINE_SEGMENTS = 6
const PICKUP_TIMELINE_SEGMENTS = 2

const DELIVERY_STATUS_PROGRESS_MAP = {
  [ORDER_STATUS_ENUM.PENDING]: 1,
  [ORDER_STATUS_ENUM.ACCEPTED]: 2,
  [ORDER_STATUS_ENUM.ASSIGNED]: 3,
  [ORDER_STATUS_ENUM.PICKED]: 4,
  [SINGLE_VENDOR_TRACKING_STATUS.ON_ROUTE]: 5,
  [ORDER_STATUS_ENUM.DELIVERED]: 6,
  [ORDER_STATUS_ENUM.COMPLETED]: 6,
  [ORDER_STATUS_ENUM.CANCELLED]: 1,
  [ORDER_STATUS_ENUM.CANCELLEDBYREST]: 1
}

const PICKUP_STATUS_PROGRESS_MAP = {
  [ORDER_STATUS_ENUM.PENDING]: 1,
  [ORDER_STATUS_ENUM.ACCEPTED]: 2,
  [ORDER_STATUS_ENUM.ASSIGNED]: 2,
  [ORDER_STATUS_ENUM.PICKED]: 2,
  [ORDER_STATUS_ENUM.DELIVERED]: 2,
  [ORDER_STATUS_ENUM.COMPLETED]: 2,
  [ORDER_STATUS_ENUM.CANCELLED]: 1,
  [ORDER_STATUS_ENUM.CANCELLEDBYREST]: 1
}

const isCancelledStatus = (status) =>
  status === ORDER_STATUS_ENUM.CANCELLED || status === ORDER_STATUS_ENUM.CANCELLEDBYREST

const isFinishedStatus = (status) =>
  status === ORDER_STATUS_ENUM.DELIVERED || status === ORDER_STATUS_ENUM.COMPLETED

const formatTime = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSubtitle = ({ status, completionTime, expectedTime, isPickUpOrder }) => {
  if (isCancelledStatus(status)) return 'This order was cancelled'
  if (isFinishedStatus(status)) return isPickUpOrder ? 'Collected successfully' : 'Delivered successfully'

  const formattedExpected = formatTime(expectedTime)
  const formattedCompletion = formatTime(completionTime)

  if (formattedExpected && formattedCompletion) {
    return `Estimated arrival ${formattedExpected} - ${formattedCompletion}`
  }

  if (formattedCompletion) {
    return `Estimated arrival ${formattedCompletion}`
  }

  return isPickUpOrder ? 'Preparing your collection' : 'Tracking your order'
}

const getTitle = (status, isPickUpOrder) => {
  if (isFinishedStatus(status)) return isPickUpOrder ? 'Your order was collected' : 'Your order has arrived'
  if (isCancelledStatus(status)) return 'Order cancelled'
  if (isPickUpOrder && status === ORDER_STATUS_ENUM.ACCEPTED) return 'Your order is being prepared for collection'
  if (status === ORDER_STATUS_ENUM.PICKED) return 'Your order is on the way'
  if (status === SINGLE_VENDOR_TRACKING_STATUS.ON_ROUTE) return 'Your order is on the way'
  if (status === ORDER_STATUS_ENUM.ASSIGNED) return 'Rider assigned to your order'
  return 'Your order is being prepared'
}

const getStatusVisual = (status, isPickUpOrder) => {
  if (isCancelledStatus(status)) return { icon: 'close', label: 'Cancelled', tone: 'danger' }
  if (isFinishedStatus(status)) {
    return { icon: 'checkmark-done', label: isPickUpOrder ? 'Collected' : 'Delivered', tone: 'done' }
  }
  if (status === ORDER_STATUS_ENUM.PICKED || status === SINGLE_VENDOR_TRACKING_STATUS.ON_ROUTE) {
    return isPickUpOrder
      ? { icon: 'bag-check-outline', label: 'Ready', tone: 'live' }
      : { icon: 'bicycle', label: 'On the way', tone: 'live' }
  }
  if (status === ORDER_STATUS_ENUM.ASSIGNED) return { icon: 'person-outline', label: 'Rider assigned', tone: 'live' }
  if (status === ORDER_STATUS_ENUM.ACCEPTED) return { icon: 'restaurant-outline', label: 'Preparing', tone: 'live' }
  return { icon: 'receipt-outline', label: 'Order placed', tone: 'live' }
}

export const LiveDot = memo(function LiveDot({ color, animate }) {
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!animate) {
      pulse.setValue(0)
      return
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    )
    loop.start()
    return () => loop.stop()
  }, [animate, pulse])

  return (
    <View style={liveDotStyles.wrap}>
      <Animated.View
        style={[
          liveDotStyles.ring,
          {
            backgroundColor: color,
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }]
          }
        ]}
      />
      <View style={[liveDotStyles.core, { backgroundColor: color }]} />
    </View>
  )
})

const HomeCartSkeleton = ({ themedStyles, timelineSegments }) => (
  <View style={themedStyles.card}>
    <View style={themedStyles.topRow}>
      <LoadingSkeleton width={scale(64)} height={scale(20)} borderRadius={999} />
      <LoadingSkeleton width={scale(56)} height={scale(14)} borderRadius={999} />
    </View>

    <View style={themedStyles.mainRow}>
      <LoadingSkeleton width={scale(40)} height={scale(40)} borderRadius={scale(12)} />
      <View style={themedStyles.titleWrap}>
        <LoadingSkeleton width='78%' height={scale(16)} borderRadius={scale(6)} />
        <LoadingSkeleton width='52%' height={scale(12)} borderRadius={scale(6)} style={{ marginTop: scale(8) }} />
      </View>
    </View>

    <View style={themedStyles.progressRow}>
      {Array.from({ length: timelineSegments }).map((_, index) => (
        <LoadingSkeleton
          key={`progress-skeleton-${index}`}
          height={scale(4)}
          borderRadius={999}
          style={themedStyles.progressSegment}
        />
      ))}
    </View>

    <View style={themedStyles.footer}>
      <LoadingSkeleton width='62%' height={scale(12)} borderRadius={scale(6)} />
      <LoadingSkeleton width={scale(56)} height={scale(20)} borderRadius={999} />
    </View>
  </View>
)

const HomeCart = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const { tokens } = useMultivendorTheme()
  const { colors } = tokens
  const themedStyles = useMemo(() => styles(tokens), [tokens])

  const {
    loading,
    error,
    refetch,
    hasActiveOrder,
    orderItems,
    orderNo,
    address,
    initialOrder,
    orderStatus: confirmationStatus
  } = useOrderConfirmation({ isHome: true })

  const { order: liveOrder, remainingTime } = useOrderTracking({
    orderId: initialOrder?._id,
    initialOrder
  })

  const orderStatus = liveOrder?.orderStatus ?? confirmationStatus ?? initialOrder?.orderStatus
  const fulfillmentOrder = liveOrder || initialOrder
  const isPickUpOrder = isSingleVendorPickupOrder(fulfillmentOrder)
  const timelineSegments = isPickUpOrder ? PICKUP_TIMELINE_SEGMENTS : DELIVERY_TIMELINE_SEGMENTS
  const statusProgressMap = isPickUpOrder ? PICKUP_STATUS_PROGRESS_MAP : DELIVERY_STATUS_PROGRESS_MAP
  const deliveryAddress = isPickUpOrder
    ? liveOrder?.restaurant?.address ?? initialOrder?.restaurant?.address
    : address ?? liveOrder?.deliveryAddress?.deliveryAddress ?? initialOrder?.deliveryAddress?.deliveryAddress
  const activeOrderNumber =
    liveOrder?.orderId ??
    initialOrder?.orderId ??
    orderNo

  const itemCount = useMemo(() => {
    const items = orderItems?.length ? orderItems : (liveOrder?.items || initialOrder?.items || [])
    return items.reduce((sum, item) => sum + (item?.quantity || 0), 0)
  }, [orderItems, liveOrder?.items, initialOrder?.items])

  if (loading) {
    return <HomeCartSkeleton themedStyles={themedStyles} timelineSegments={timelineSegments} />
  }

  if (error) {
    return (
      <SectionErrorCard
        compact
        title='Active order'
        message='Your active order could not be loaded.'
        onRetry={refetch}
        style={themedStyles.errorCard}
      />
    )
  }

  if (!hasActiveOrder && !initialOrder) {
    return null
  }

  const progressCount = statusProgressMap[orderStatus] ?? 1
  const visual = getStatusVisual(orderStatus, isPickUpOrder)
  const isLive = visual.tone === 'live'
  const showEta = isLive && typeof remainingTime === 'number' && remainingTime > 0
  const tone = themedStyles.tones[visual.tone]
  const title = getTitle(orderStatus, isPickUpOrder)
  const subtitle = showEta
    ? isPickUpOrder ? 'Ready for collection in' : 'Estimated arrival in'
    : getSubtitle({
      status: orderStatus,
      completionTime: liveOrder?.completionTime ?? initialOrder?.completionTime,
      expectedTime: liveOrder?.expectedTime ?? initialOrder?.expectedTime,
      isPickUpOrder
    })
  const displayOrderNumber = orderNo || initialOrder?.orderId

  const openOrderDetails = () => {
    if (!activeOrderNumber) return
    navigation.navigate('OrderConfirmation', {
      orderId: activeOrderNumber
    })
  }

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={`${t(title)}. ${subtitle}${showEta ? ` ${remainingTime} min` : ''}`}
      accessibilityHint={t('Open order details', { defaultValue: 'Open order details' })}
      disabled={!activeOrderNumber}
      onPress={openOrderDetails}
      style={({ pressed }) => [themedStyles.card, pressed && themedStyles.cardPressed]}
    >
      <LinearGradient
        pointerEvents='none'
        colors={[tone.wash, colors.surface]}
        locations={[0, 0.62]}
        style={StyleSheet.absoluteFill}
      />

      <View style={themedStyles.topRow}>
        <View style={[themedStyles.statusChip, { backgroundColor: tone.chip }]}>
          {isLive
            ? <LiveDot color={tone.accent} animate={isFocused} />
            : <Ionicons name={visual.icon} size={scale(11)} color={tone.text} />}
          <TextDefault bold style={[themedStyles.statusChipText, { color: tone.text }]} numberOfLines={1}>
            {isLive ? t('Live', { defaultValue: 'Live' }) : t(visual.label)}
          </TextDefault>
        </View>

        {!!displayOrderNumber && (
          <TextDefault style={themedStyles.orderNumber} numberOfLines={1}>
            #{displayOrderNumber}
          </TextDefault>
        )}
      </View>

      <View style={themedStyles.mainRow}>
        <View style={[themedStyles.iconTile, { backgroundColor: tone.chip }]}>
          <Ionicons name={visual.icon} size={scale(19)} color={tone.text} />
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
              <Feather name='chevron-right' size={scale(16)} color={colors.textPrimary} />
            </View>
            )}
      </View>

      <View style={themedStyles.progressRow}>
        {Array.from({ length: timelineSegments }).map((_, index) => (
          <View
            key={index}
            style={[
              themedStyles.progressSegment,
              index < progressCount && { backgroundColor: tone.accent }
            ]}
          />
        ))}
      </View>

      <View style={themedStyles.footer}>
        <View style={themedStyles.addressWrap}>
          <Ionicons
            name={isPickUpOrder ? 'storefront-outline' : 'location-outline'}
            size={scale(13)}
            color={colors.textMuted}
          />
          <TextDefault numberOfLines={1} style={themedStyles.addressText}>
            {deliveryAddress || t('Tracking your order')}
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

const liveDotStyles = StyleSheet.create({
  wrap: {
    width: scale(8),
    height: scale(8),
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    position: 'absolute',
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4)
  },
  core: {
    width: scale(7),
    height: scale(7),
    borderRadius: scale(3.5)
  }
})

// Mirrors the multivendor ActiveOrders card (same tokens and geometry) and
// adds the done / cancelled tones only single-vendor tracking needs.
const styles = (tokens) => {
  const { colors, isDark } = tokens

  return {
    tones: {
      live: {
        accent: colors.accent,
        chip: colors.accentSubtle,
        text: colors.accentForeground,
        wash: colors.accentSubtle
      },
      done: {
        accent: colors.accent,
        chip: colors.accentSubtle,
        text: colors.accentForeground,
        wash: isDark ? 'rgba(144, 227, 109, 0.08)' : 'rgba(144, 227, 109, 0.12)'
      },
      danger: {
        accent: colors.danger,
        chip: isDark ? 'rgba(248, 113, 113, 0.16)' : '#FEF2F2',
        text: isDark ? '#FCA5A5' : '#B91C1C',
        wash: isDark ? 'rgba(239, 68, 68, 0.10)' : 'rgba(239, 68, 68, 0.08)'
      }
    },
    ...StyleSheet.create({
      card: {
        marginTop: scale(12),
        marginBottom: scale(2),
        marginHorizontal: DISCOVERY_GUTTER,
        paddingHorizontal: scale(12),
        paddingVertical: scale(11),
        borderRadius: scale(16),
        backgroundColor: colors.surface,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.borderSubtle,
        shadowColor: '#0B1407',
        shadowOpacity: isDark ? 0 : 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: isDark ? 0 : 2,
        overflow: 'hidden'
      },
      cardPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.99 }]
      },
      errorCard: {
        marginTop: scale(12),
        marginHorizontal: DISCOVERY_GUTTER
      },
      topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        paddingHorizontal: scale(8),
        height: scale(20),
        borderRadius: 999
      },
      statusChipText: {
        fontSize: scale(9.5),
        letterSpacing: 0.6,
        textTransform: 'uppercase'
      },
      orderNumber: {
        color: colors.textMuted,
        fontSize: scale(11),
        fontVariant: ['tabular-nums'],
        maxWidth: '55%'
      },
      mainRow: {
        marginTop: scale(10),
        flexDirection: 'row',
        alignItems: 'center'
      },
      iconTile: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        alignItems: 'center',
        justifyContent: 'center'
      },
      titleWrap: {
        flex: 1,
        marginHorizontal: scale(10)
      },
      title: {
        color: colors.textPrimary,
        fontSize: scale(14),
        lineHeight: scale(18),
        letterSpacing: -0.2
      },
      subtitle: {
        marginTop: scale(2),
        color: colors.textMuted,
        fontSize: scale(11.5),
        lineHeight: scale(15)
      },
      etaBlock: {
        minWidth: scale(44),
        paddingVertical: scale(4),
        paddingHorizontal: scale(6),
        borderRadius: scale(12),
        backgroundColor: colors.accent,
        alignItems: 'center'
      },
      etaValue: {
        color: colors.textOnAccent,
        fontSize: scale(17),
        lineHeight: scale(20),
        fontVariant: ['tabular-nums']
      },
      etaUnit: {
        color: colors.textOnAccent,
        fontSize: scale(9.5),
        lineHeight: scale(11),
        opacity: 0.8
      },
      chevron: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        backgroundColor: colors.surfaceSubtle,
        alignItems: 'center',
        justifyContent: 'center'
      },
      progressRow: {
        marginTop: scale(12),
        flexDirection: 'row',
        gap: scale(4)
      },
      progressSegment: {
        flex: 1,
        height: scale(4),
        borderRadius: 999,
        backgroundColor: colors.borderStandard
      },
      footer: {
        marginTop: scale(10),
        paddingTop: scale(9),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.borderSubtle,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: scale(8)
      },
      addressWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5)
      },
      addressText: {
        flex: 1,
        color: colors.textMuted,
        fontSize: scale(11.5)
      },
      itemsPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingHorizontal: scale(8),
        height: scale(20),
        borderRadius: 999,
        backgroundColor: colors.surfaceSubtle
      },
      itemsText: {
        color: colors.textPrimary,
        fontSize: scale(10.5)
      }
    })
  }
}

export default HomeCart
