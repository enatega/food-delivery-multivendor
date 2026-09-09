import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import React, { useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Spinner from '../../components/Spinner/Spinner'
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
// import analytics from '../../utils/analytics'
import Detail from '../../components/OrderDetail/Detail/Detail'
import CustomerMarker from '../../assets/SVG/customer-marker'
import RiderMarker from '../../assets/SVG/rider-marker'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import OrdersContext from '../../context/Orders'
import { mapStyle } from '../../utils/mapStyle'
import darkMapStyle from '../../utils/DarkMapStyles'
import { useTranslation } from 'react-i18next'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { PriceRow } from '../../components/OrderDetail/PriceRow'
import { ORDER_STATUS_ENUM } from '../../utils/enums'
import { CancelModal } from '../../components/OrderDetail/CancelModal'
import Button from '../../components/Button/Button'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client'
import { cancelOrder as cancelOrderMutation } from '../../apollo/mutations'
import { subscriptionOrder, subscriptionNewMessage, subscriptionOrderTracking } from '../../apollo/subscriptions'
import { orderTracking } from '../../apollo/queries'
import { useUserContext } from '../../context/User'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { Instructions } from '../../components/Checkout/Instructions'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'
import Taxes from './Taxes'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { useMultivendorTheme } from '../../ui/designSystem'
import OrderStatusTimeline from '../../components/OrderDetail/OrderStatusTimeline'
import { decodePolyline, trimPolylineToRider } from '../../utils/polyline'

const CANCEL_ORDER = gql`
  ${cancelOrderMutation}
`
const SUBSCRIPTION_ORDER = gql`
  ${subscriptionOrder}
`

const SUBSCRIPTION_NEW_MESSAGE = gql`
  ${subscriptionNewMessage}
`
const ORDER_TRACKING = gql`
  ${orderTracking}
`
const SUBSCRIPTION_ORDER_TRACKING = gql`
  ${subscriptionOrderTracking}
`

const ORDER_STATUS_RANK = {
  [ORDER_STATUS_ENUM.PENDING]: 1,
  [ORDER_STATUS_ENUM.ACCEPTED]: 2,
  [ORDER_STATUS_ENUM.ASSIGNED]: 3,
  [ORDER_STATUS_ENUM.PICKED]: 4,
  [ORDER_STATUS_ENUM.DELIVERED]: 5,
  [ORDER_STATUS_ENUM.COMPLETED]: 6,
  [ORDER_STATUS_ENUM.CANCELLED]: 7,
  [ORDER_STATUS_ENUM.CANCELLEDBYREST]: 7
}

function mergeOrderState(current, incoming) {
  if (!current) return incoming ?? null
  if (!incoming) return current

  const currentRank = ORDER_STATUS_RANK[current?.orderStatus] ?? 0
  const incomingRank = ORDER_STATUS_RANK[incoming?.orderStatus] ?? 0

  if (incomingRank < currentRank) {
    return {
      ...incoming,
      ...current
    }
  }

  return {
    ...current,
    ...incoming
  }
}

const formatClockTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const getStatusMessage = (order, eta, riderLocation, now) => {
  switch (order?.orderStatus) {
    case ORDER_STATUS_ENUM.PENDING:
      return 'Waiting for the store to confirm your order.'
    case ORDER_STATUS_ENUM.ACCEPTED:
      return eta?.readyAt && now > new Date(eta.readyAt).getTime() ? 'Preparation is taking a little longer.' : `Your order is being prepared${eta?.readyAt ? ` — expected ready by ${formatClockTime(eta.readyAt)}` : '.'}`
    case ORDER_STATUS_ENUM.ASSIGNED:
      return eta?.readyAt && now > new Date(eta.readyAt).getTime() ? 'Your rider is collecting the order. Preparation is taking a little longer.' : 'Your order is being prepared and a rider has been assigned.'
    case ORDER_STATUS_ENUM.PICKED: {
      const locationAge = riderLocation?.recordedAt ? now - new Date(riderLocation.recordedAt).getTime() : Infinity
      return locationAge > 90 * 1000 ? `Rider location temporarily unavailable${riderLocation?.recordedAt ? ` — last updated ${formatClockTime(riderLocation.recordedAt)}` : '.'}` : 'Your order is on the way.'
    }
    case ORDER_STATUS_ENUM.DELIVERED:
    case ORDER_STATUS_ENUM.COMPLETED:
      return 'Your order has been delivered.'
    default:
      return 'This order is no longer active.'
  }
}

function OrderDetail(props) {
  // console.log("propsdata",props?.route.params)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  // const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const id = props?.route.params ? props?.route.params?._id || props?.route.params?.id : null
  const orderData = props?.route.params ? props?.route.params?.order : null
  // console.log('orderData',orderData)
  const { loadingOrders, errorOrders, orders, reFetchOrders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }
  const navigation = useNavigation()
  const mapView = useRef(null)
  const { isConnected: connect } = useNetworkStatus()
  const [cancelOrder, { loading: loadingCancel }] = useMutation(CANCEL_ORDER, {
    onError,
    onCompleted: (data) => {
      setCancelModalVisible(false)
      navigation.navigate('Main')
    },
    variables: { abortOrderId: id }
  })
  // useEffect(() => {
  //   /* async function Track() {
  //     await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
  //       orderId: id
  //     })
  //   }
  //   Track() */
  // }, [])

  const cancelModalToggle = () => {
    setCancelModalVisible(!cancelModalVisible)
  }
  function onError(error) {
    setCancelModalVisible(false)
    FlashMessage({
      message: error.message
    })
  }
  let order = orders?.find((o) => {
    return o?._id === id
  })

  if (!order) {
    order = orderData
  }

  // When an order becomes DELIVERED, the active and past order lists refetch
  // separately (see OrdersContext subscription). There is a brief window where
  // the order is absent from BOTH lists, which previously made `order`
  // undefined and crashed the destructuring below ("Order not found"). Keep the
  // last successfully resolved order so the screen stays stable across that gap.
  const lastKnownOrderRef = useRef(null)
  const [screenOrder, setScreenOrder] = useState(order ?? orderData ?? null)
  if (order) {
    lastKnownOrderRef.current = order
  } else if (lastKnownOrderRef.current) {
    order = lastKnownOrderRef.current
  }

  useEffect(() => {
    if (order) {
      setScreenOrder((current) => mergeOrderState(current, order))
    }
  }, [order])

  useSubscription(SUBSCRIPTION_ORDER, {
    variables: { id },
    skip: !id,
    onSubscriptionData: ({ subscriptionData }) => {
      const updatedOrder = subscriptionData?.data?.subscriptionOrder
      if (!updatedOrder) return
      setScreenOrder((current) => mergeOrderState(current, updatedOrder))
      lastKnownOrderRef.current = mergeOrderState(lastKnownOrderRef.current, updatedOrder)
    }
  })

  // Unread rider-chat indicator for the "Let's Chat with rider" card.
  const { profile } = useUserContext()
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false)

  useSubscription(SUBSCRIPTION_NEW_MESSAGE, {
    variables: { order: id },
    skip: !id,
    onSubscriptionData: ({ subscriptionData }) => {
      const msg = subscriptionData?.data?.subscriptionNewMessage
      if (!msg) return
      // Flag only messages from the rider, not the customer's own.
      if (msg.user?.id !== profile?._id) setHasUnreadMessage(true)
    }
  })

  // Returning to this screen (e.g. after reading the chat) clears the flag.
  useFocusEffect(
    useCallback(() => {
      setHasUnreadMessage(false)
    }, [])
  )

  order = mergeOrderState(order, screenOrder)
  const [isTrackingFocused, setIsTrackingFocused] = useState(false)
  const [tracking, setTracking] = useState(null)
  const [now, setNow] = useState(Date.now())

  useFocusEffect(
    useCallback(() => {
      setIsTrackingFocused(true)
      return () => setIsTrackingFocused(false)
    }, [])
  )

  const trackingEnabled = isTrackingFocused && [ORDER_STATUS_ENUM.ASSIGNED, ORDER_STATUS_ENUM.PICKED].includes(order?.orderStatus) && Boolean(id)
  const { data: initialTrackingData } = useQuery(ORDER_TRACKING, {
    variables: { id },
    skip: !trackingEnabled,
    fetchPolicy: 'network-only'
  })

  useEffect(() => {
    if (initialTrackingData?.orderTracking) {
      setTracking(initialTrackingData.orderTracking)
    }
  }, [initialTrackingData])

  useSubscription(SUBSCRIPTION_ORDER_TRACKING, {
    variables: { id },
    skip: !trackingEnabled,
    onSubscriptionData: ({ subscriptionData }) => {
      const update = subscriptionData?.data?.subscriptionOrderTracking
      if (update) setTracking(update)
    }
  })

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  const eta = tracking?.eta || order?.eta
  const riderLocation = tracking?.riderLocation || null
  const routeCoordinates = useMemo(() => {
    const decoded = decodePolyline(eta?.encodedPolyline)
    return trimPolylineToRider(decoded, riderLocation)
  }, [eta?.encodedPolyline, riderLocation])

  useEffect(() => {
    if (!mapView.current || routeCoordinates.length < 2) return
    mapView.current.fitToCoordinates(routeCoordinates, {
      edgePadding: { top: 48, right: 36, bottom: 48, left: 36 },
      animated: true
    })
  }, [routeCoordinates])

  const openedCourierChatRef = useRef(false)

  useEffect(() => {
    const shouldOpenCourierChat = props?.route.params?.openCourierChat === true || props?.route.params?.chat === 'courier'
    if (shouldOpenCourierChat && !openedCourierChatRef.current && order?.rider) {
      openedCourierChatRef.current = true
      navigation.navigate('ChatWithRider', {
        id,
        orderNo: order.orderId,
        total: order.orderAmount,
        riderPhone: order.rider.phone
      })
    }
  }, [id, navigation, order?.orderAmount, order?.orderId, order?.rider, props?.route.params?.chat, props?.route.params?.openCourierChat])

  useEffect(() => {
    props?.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity accessibilityRole='button' accessibilityLabel={t('back')} activeOpacity={0.65} hitSlop={10} onPress={() => navigation.goBack()}>
          <Ionicons name={currentTheme.isRTL ? 'arrow-forward' : 'arrow-back'} size={scale(23)} color={currentTheme.colors.textPrimary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity accessibilityRole='button' accessibilityLabel={t('help')} activeOpacity={0.65} hitSlop={10} onPress={() => navigation.navigate('Help')}>
          <Ionicons name='information-circle-outline' size={scale(24)} color={currentTheme.colors.textPrimary} />
        </TouchableOpacity>
      ),
      headerTitle: t('trackOrder'),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.colors.textPrimary,
        fontSize: scale(16),
        fontWeight: '600'
      },
      headerLeftContainerStyle: {
        paddingLeft: scale(14)
      },
      headerRightContainerStyle: {
        paddingRight: scale(14)
      },
      headerTitleContainerStyle: {
        marginHorizontal: scale(52)
      },
      headerStyle: {
        backgroundColor: currentTheme.colors.canvas,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: currentTheme.colors.borderSubtle
      },
      headerShadowVisible: false
    })
  }, [currentTheme, navigation, order, props?.navigation, t])

  // Keep the screen awake only while the order is in active transit so a user
  // tracking a delivery doesn't have the screen sleep. Replaces the app-wide
  // useKeepAwake() that kept the screen on for every screen and drained the
  // battery (PERF-011).
  useEffect(() => {
    const isActiveTransit = [ORDER_STATUS_ENUM.ASSIGNED, ORDER_STATUS_ENUM.PICKED].includes(order?.orderStatus)
    if (isActiveTransit) {
      activateKeepAwakeAsync('order-tracking')
    } else {
      deactivateKeepAwake('order-tracking')
    }
    return () => {
      deactivateKeepAwake('order-tracking')
    }
  }, [order?.orderStatus])

  // Only show the full-screen spinner on the initial load, before we have any
  // order to display. On a status-change refetch (loadingOrders flips true
  // because both order lists refetch with notifyOnNetworkStatusChange), we
  // already have `order` from the list/route param/lastKnownOrderRef, so keep
  // the screen mounted and let it update in place instead of a circular reload.
  if (loadingOrders && !order) {
    return <Spinner backColor={currentTheme.themeBackground} spinnerColor={currentTheme.main} />
  }
  if (errorOrders) {
    return <ErrorView refetchFunctions={reFetchOrders ? [reFetchOrders] : []} errorMessage={t('orderLoadError')} />
  }

  // Order still resolving (e.g. mid-refetch after status change) — show the
  // spinner instead of crashing on the destructuring below.
  if (!order) {
    return <Spinner backColor={currentTheme.themeBackground} spinnerColor={currentTheme.main} />
  }

  const { restaurant, deliveryAddress, items, tipping: tip, taxationAmount: tax, orderAmount: total, deliveryCharges, discountAmount } = order

  const subTotal = total - tip - tax - deliveryCharges + (discountAmount || 0)

  const isOrderPending = order?.orderStatus === ORDER_STATUS_ENUM.PENDING
  const isOrderCancelable = isOrderPending

  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <View style={styles(currentTheme).screen}>
      <ScrollView contentContainerStyle={styles(currentTheme).scrollContent} showsVerticalScrollIndicator={false} overScrollMode='never'>
        {order?.rider && [ORDER_STATUS_ENUM.ASSIGNED, ORDER_STATUS_ENUM.PICKED].includes(order?.orderStatus) && (
          <View style={styles(currentTheme).mapCard}>
            <MapView
              ref={(c) => (mapView.current = c)}
              style={styles(currentTheme).map}
              showsUserLocation={false}
              initialRegion={{
                latitude: +deliveryAddress?.location?.coordinates[1],
                longitude: +deliveryAddress?.location?.coordinates[0],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              zoomEnabled={true}
              zoomControlEnabled={true}
              rotateEnabled={false}
              customMapStyle={themeContext.ThemeValue === 'Dark' ? darkMapStyle : mapStyle}
              userInterfaceStyle={themeContext.ThemeValue === 'Dark' ? 'dark' : 'light'}
              provider={PROVIDER_DEFAULT}
            >
              <Marker
                coordinate={{
                  latitude: +deliveryAddress?.location?.coordinates[1],
                  longitude: +deliveryAddress?.location?.coordinates[0]
                }}
              >
                <CustomerMarker />
              </Marker>
              {!!restaurant?.location?.coordinates?.length && (
                <Marker
                  coordinate={{
                    latitude: +restaurant.location.coordinates[1],
                    longitude: +restaurant.location.coordinates[0]
                  }}
                >
                  <RestaurantMarker />
                </Marker>
              )}
              {routeCoordinates.length > 1 && <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor={currentTheme.colors.accent} />}
              {riderLocation && (
                <Marker
                  coordinate={{
                    latitude: riderLocation.latitude,
                    longitude: riderLocation.longitude
                  }}
                >
                  <RiderMarker />
                </Marker>
              )}
            </MapView>
          </View>
        )}
        <View style={styles(currentTheme).statusSection}>
          <TextDefault H4 bold textColor={currentTheme.colors.textPrimary} style={styles(currentTheme).statusHeading}>
            {getStatusMessage(order, eta, riderLocation, now)}
          </TextDefault>
          {![ORDER_STATUS_ENUM.PENDING, ORDER_STATUS_ENUM.DELIVERED, ORDER_STATUS_ENUM.COMPLETED, ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(order?.orderStatus) && (
            <View style={styles(currentTheme).estimateRow}>
              <TextDefault textColor={currentTheme.colors.textSecondary}>{t('estimatedDeliveryTime')}</TextDefault>
              <TextDefault H4 bolder textColor={currentTheme.colors.accent}>
                {eta?.windowStartAt && eta?.windowEndAt ? `${formatClockTime(eta.windowStartAt)}–${formatClockTime(eta.windowEndAt)}` : t('calculating', { defaultValue: 'Calculating…' })}
              </TextDefault>
            </View>
          )}
          <OrderStatusTimeline currentStatus={order?.orderStatus} isPickup={order?.isPickedUp} theme={currentTheme} />
        </View>
        <View style={styles(currentTheme).contentInset}>
          <Instructions title={'Instructions'} theme={currentTheme} message={order?.instructions} />
        </View>
        <Detail navigation={props?.navigation} currencySymbol={configuration.currencySymbol} items={items} from={restaurant?.name} orderNo={order?.orderId} deliveryAddress={deliveryAddress?.deliveryAddress} subTotal={subTotal} tip={tip} tax={tax} deliveryCharges={deliveryCharges} total={total} theme={currentTheme} id={id} rider={order?.rider} orderStatus={order?.orderStatus} hasUnread={hasUnreadMessage} onChatOpen={() => setHasUnreadMessage(false)} />
        <View style={styles(currentTheme).paymentCard}>
          <TouchableOpacity accessibilityRole='button' accessibilityState={{ expanded: showPaymentDetails }} activeOpacity={0.7} onPress={() => setShowPaymentDetails((visible) => !visible)} style={styles(currentTheme).paymentHeader}>
            <View>
              <TextDefault H5 bold textColor={currentTheme.colors.textSecondary} isRTL>
                {t('paymentDetails', { defaultValue: 'Payment details' })}
              </TextDefault>
              <TextDefault H4 bolder textColor={currentTheme.colors.textPrimary} isRTL>
                {configuration.currencySymbol}
                {total.toFixed(2)}
              </TextDefault>
            </View>
            <Ionicons color={currentTheme.colors.textSecondary} name={showPaymentDetails ? 'chevron-up' : 'chevron-down'} size={scale(21)} />
          </TouchableOpacity>
          {showPaymentDetails && (
            <View style={styles(currentTheme).paymentBreakdown}>
              <PriceRow theme={currentTheme} title={t('subTotal')} currency={configuration.currencySymbol} price={subTotal.toFixed(2)} />
              <Taxes tax={tax} deliveryCharges={deliveryCharges} currency={configuration.currencySymbol} tip={tip} discountAmount={discountAmount} theme={currentTheme} />
            </View>
          )}
        </View>
        {isOrderCancelable && (
          <View style={styles(currentTheme).cancelWrap}>
            <Button disabled={!isOrderCancelable} text={t('cancelOrder')} buttonProps={{ onPress: cancelModalToggle }} buttonStyles={styles().cancelButtonContainer(currentTheme)} textProps={{ textColor: currentTheme.red600 }} textStyles={{ ...alignment.Pmedium }} />
          </View>
        )}
      </ScrollView>
      <CancelModal theme={currentTheme} modalVisible={cancelModalVisible} setModalVisible={cancelModalToggle} cancelOrder={cancelOrder} loading={loadingCancel} orderStatus={order?.orderStatus} />
    </View>
  )
}

export default OrderDetail
