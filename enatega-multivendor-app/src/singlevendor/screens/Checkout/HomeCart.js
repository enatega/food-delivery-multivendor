import React, { useContext, useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import useOrderConfirmation from './useOrderConfirmation'
import useOrderTracking from './useOrderTracking'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'

const DELIVERY_TIMELINE_SEGMENTS = 5
const PICKUP_TIMELINE_SEGMENTS = 2

const DELIVERY_STATUS_PROGRESS_MAP = {
  [ORDER_STATUS_ENUM.PENDING]: 1,
  [ORDER_STATUS_ENUM.ACCEPTED]: 2,
  [ORDER_STATUS_ENUM.ASSIGNED]: 3,
  [ORDER_STATUS_ENUM.PICKED]: 4,
  [ORDER_STATUS_ENUM.DELIVERED]: 5,
  [ORDER_STATUS_ENUM.COMPLETED]: 5,
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

const formatTime = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSubtitle = ({ status, remainingTime, completionTime, expectedTime }) => {
  if (status === ORDER_STATUS_ENUM.CANCELLED || status === ORDER_STATUS_ENUM.CANCELLEDBYREST) {
    return 'This order was cancelled'
  }

  if (status === ORDER_STATUS_ENUM.DELIVERED || status === ORDER_STATUS_ENUM.COMPLETED) {
    return 'Delivered successfully'
  }

  if (typeof remainingTime === 'number' && remainingTime > 0) {
    return `Estimated arrival in ${remainingTime} min`
  }

  const formattedExpected = formatTime(expectedTime)
  const formattedCompletion = formatTime(completionTime)

  if (formattedExpected && formattedCompletion) {
    return `Estimated arrival ${formattedExpected} - ${formattedCompletion}`
  }

  if (formattedCompletion) {
    return `Estimated arrival ${formattedCompletion}`
  }

  return 'Tracking your order'
}

const getTitle = (status) => {
  if (status === ORDER_STATUS_ENUM.DELIVERED || status === ORDER_STATUS_ENUM.COMPLETED) return 'Your order has arrived'
  if (status === ORDER_STATUS_ENUM.CANCELLED || status === ORDER_STATUS_ENUM.CANCELLEDBYREST) return 'Order cancelled'
  if (status === ORDER_STATUS_ENUM.PICKED) return 'Your order is on the way'
  if (status === ORDER_STATUS_ENUM.ASSIGNED) return 'Rider assigned to your order'
  return 'Your order is being prepared'
}

const HomeCartSkeleton = ({ currentTheme, themedStyles, timelineSegments }) => (
  <View style={themedStyles.wrapper}>
    <View style={themedStyles.headerRow}>
      <View style={themedStyles.titleWrap}>
        <LoadingSkeleton width='70%' height={scale(20)} borderRadius={scale(6)} />
        <LoadingSkeleton width='58%' height={scale(12)} borderRadius={scale(6)} style={{ marginTop: scale(8) }} />
      </View>
      <View style={themedStyles.foodBadge}>
        <LoadingSkeleton width={scale(22)} height={scale(22)} borderRadius={scale(11)} style={{ backgroundColor: currentTheme.gray200 }} />
      </View>
    </View>

    <View style={themedStyles.progressRow}>
      {Array.from({ length: timelineSegments }).map((_, index) => (
        <LoadingSkeleton
          key={`progress-skeleton-${index}`}
          height={scale(5)}
          borderRadius={scale(999)}
          style={[
            themedStyles.progressSegment,
            index !== timelineSegments - 1 && themedStyles.progressSegmentSpacing
          ]}
        />
      ))}
    </View>

    <View style={themedStyles.metaRow}>
      <LoadingSkeleton width={scale(100)} height={scale(34)} borderRadius={scale(999)} />
      <LoadingSkeleton width={scale(120)} height={scale(34)} borderRadius={scale(999)} style={{ marginLeft: scale(10) }} />
    </View>

    <LoadingSkeleton width='100%' height={scale(12)} borderRadius={scale(6)} style={{ marginTop: scale(14) }} />
  </View>
)

const HomeCart = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const themedStyles = styles(currentTheme)

  const {
    loading,
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
  const isPickUpOrder = liveOrder?.isPickedUp ?? initialOrder?.isPickedUp
  const timelineSegments = isPickUpOrder ? PICKUP_TIMELINE_SEGMENTS : DELIVERY_TIMELINE_SEGMENTS
  const statusProgressMap = isPickUpOrder ? PICKUP_STATUS_PROGRESS_MAP : DELIVERY_STATUS_PROGRESS_MAP
  const restaurantName = liveOrder?.restaurant?.name ?? initialOrder?.restaurant?.name ?? 'Current order'
  const deliveryAddress = address ?? liveOrder?.deliveryAddress?.deliveryAddress ?? initialOrder?.deliveryAddress?.deliveryAddress

  const itemCount = useMemo(() => {
    const items = orderItems?.length ? orderItems : (liveOrder?.items || initialOrder?.items || [])
    return items.reduce((sum, item) => sum + (item?.quantity || 0), 0)
  }, [orderItems, liveOrder?.items, initialOrder?.items])

  if (loading) {
    return <HomeCartSkeleton currentTheme={currentTheme} themedStyles={themedStyles} timelineSegments={timelineSegments} />
  }

  if (!hasActiveOrder && !initialOrder) {
    return null
  }

  const progressCount = statusProgressMap[orderStatus] ?? 1
  const title = getTitle(orderStatus)
  const subtitle = getSubtitle({
    status: orderStatus,
    remainingTime,
    completionTime: liveOrder?.completionTime ?? initialOrder?.completionTime,
    expectedTime: liveOrder?.expectedTime ?? initialOrder?.expectedTime
  })

  return (
    <View style={themedStyles.wrapper}>
      <View style={themedStyles.headerRow}>
        <View style={themedStyles.titleWrap}>
          <TextDefault bold style={themedStyles.title}>
            {title}
          </TextDefault>
          <TextDefault style={themedStyles.subtitle}>
            {subtitle}
          </TextDefault>
        </View>

        <View style={themedStyles.foodBadge}>
          <Ionicons name='fast-food-sharp' size={scale(22)} color={currentTheme.primaryBlue} />
        </View>
      </View>

      <View style={themedStyles.progressRow}>
        {Array.from({ length: timelineSegments }).map((_, item) => (
          <View
            key={item}
            style={[
              themedStyles.progressSegment,
              item !== timelineSegments - 1 && themedStyles.progressSegmentSpacing,
              item < progressCount && themedStyles.progressSegmentActive
            ]}
          />
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={themedStyles.actionsRow}>
        <View style={[themedStyles.actionPill, themedStyles.actionPillSpacing]}>
          <Feather name='hash' size={scale(18)} color={currentTheme.fontMainColor} />
          <TextDefault style={themedStyles.actionText} numberOfLines={1}>
            #{orderNo || initialOrder?.orderId || '--'}
          </TextDefault>
        </View>

        <View style={[themedStyles.actionPill, themedStyles.actionPillSpacing]}>
          <Ionicons name='restaurant-outline' size={scale(18)} color={currentTheme.fontMainColor} />
          <TextDefault style={themedStyles.actionText} numberOfLines={1}>
            {restaurantName}
          </TextDefault>
        </View>

        <View style={themedStyles.actionPill}>
          <Feather name='shopping-bag' size={scale(18)} color={currentTheme.fontMainColor} />
          <TextDefault style={themedStyles.actionText} numberOfLines={1}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </TextDefault>
        </View>
      </ScrollView>

      {!!deliveryAddress && (
        <View style={themedStyles.addressRow}>
          <Ionicons name='location-outline' size={scale(16)} color={currentTheme.colorTextMuted || currentTheme.fontSecondColor} />
          <TextDefault numberOfLines={2} style={themedStyles.addressText}>
            {deliveryAddress}
          </TextDefault>
        </View>
      )}
    </View>
  )
}

const styles = (themeColors) =>
  StyleSheet.create({
    wrapper: {
      marginTop: scale(14),
      marginHorizontal: scale(16),
      padding: scale(16),
      borderRadius: scale(18),
      backgroundColor: themeColors.cardBackground,
      borderWidth: 1,
      borderColor: themeColors.newBorderColor2 || themeColors.newBorderColor,
      shadowColor: themeColors.shadowColor,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
      overflow: 'hidden'
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    titleWrap: {
      flex: 1,
      paddingRight: scale(12)
    },
    title: {
      color: themeColors.fontMainColor,
      fontSize: scale(17),
      lineHeight: scale(24)
    },
    subtitle: {
      marginTop: scale(6),
      color: themeColors.colorTextMuted || themeColors.fontSecondColor,
      fontSize: scale(11),
      lineHeight: scale(16)
    },
    foodBadge: {
      width: scale(46),
      height: scale(46),
      borderRadius: scale(23),
      backgroundColor: themeColors.colorBgTertiary || themeColors.gray100,
      alignItems: 'center',
      justifyContent: 'center'
    },
    progressRow: {
      marginTop: scale(14),
      flexDirection: 'row'
    },
    progressSegment: {
      flex: 1,
      height: scale(5),
      borderRadius: scale(999),
      backgroundColor: themeColors.gray200
    },
    progressSegmentSpacing: {
      marginRight: scale(8)
    },
    progressSegmentActive: {
      backgroundColor: themeColors.primaryBlue
    },
    actionsRow: {
      marginTop: scale(16),
      flexDirection: 'row',
      paddingRight: scale(6)
    },
    actionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(14),
      paddingVertical: scale(10),
      borderRadius: scale(999),
      backgroundColor: themeColors.colorBgTertiary || themeColors.gray100,
      maxWidth: scale(220)
    },
    actionPillSpacing: {
      marginRight: scale(10)
    },
    actionText: {
      marginLeft: scale(8),
      color: themeColors.fontMainColor,
      fontSize: scale(12)
    },
    addressRow: {
      marginTop: scale(14),
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    addressText: {
      marginLeft: scale(8),
      flex: 1,
      color: themeColors.colorTextMuted || themeColors.fontSecondColor,
      fontSize: scale(12),
      lineHeight: scale(18)
    },
    metaRow: {
      marginTop: scale(16),
      flexDirection: 'row',
      alignItems: 'center'
    }
  })

export default HomeCart
