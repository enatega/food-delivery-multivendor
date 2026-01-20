import React, { useState, useContext, useLayoutEffect, useMemo } from 'react'
import { View, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../../context/Configuration'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { textStyles } from '../../../utils/textStyles'

import { OrderStatusTimeline, ORDER_STATUSES, DeliveryTimeBanner, DeliveryDetailsCard, ContactCourierCard, OrderItemsSection, DeliveryMap, DeliveredStatus } from '../../components/Checkout/OrderConfirmation'

import OrderSummary from '../../components/Checkout/OrderSummary'
import styles from './OrderConfirmationStyles'

import useOrderConfirmation from './useOrderConfirmation'
import useOrderTracking from './useOrderTracking' // ✅ NEW
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
// import { ORDER_STATUS_ENUM } from '../../utils/enums'

const OrderConfirmation = (props) => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()

  const orderId = props?.route?.params?.orderId
  const orderData = props?.route?.params?.orderData || {}

  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const currencySymbol = configuration?.currencySymbol || '€'

  // ----------------------------------
  // 1️⃣ Base order fetch (REST-like)
  // ----------------------------------
  const {
    loading,
    error,
    refetch,

    subtotal,
    deliveryFee,
    serviceFee,
    minimumOrderFee,
    taxAmount,
    total,

    deliveryDiscount,
    originalDeliveryCharges,
    freeDeliveriesRemaining,
    couponDiscountAmount,
    couponApplied,
    priorityDeliveryFee,
    isPriority,
    tipAmount,

    orderStatus: initialStatus,
    addressLabel,
    address,
    customerLocation,
    orderItems,
    initialOrder
  } = useOrderConfirmation({ orderId })

  // ----------------------------------
  // 2️⃣ Real-time tracking (SUBSCRIPTION)
  // ----------------------------------
  const { order: liveOrder, remainingTime } = useOrderTracking({
    orderId,
    initialOrder
  })

  const orderStatus = liveOrder?.orderStatus
  const riderLocation =
    {
      longitude: liveOrder?.rider?.location?.coordinates[0],
      // '72.9799622661803',
      latitude:
        // '33.703496283644384'
        liveOrder?.rider?.location?.coordinates[1]
    } || null
  console.log('rider location:', riderLocation, customerLocation)
  const rider = liveOrder?.rider || null
  // ----------------------------------
  // 3️⃣ Derived UI states
  // ----------------------------------
  const isDelivered = useMemo(() => orderStatus === ORDER_STATUS_ENUM.DELIVERED || orderStatus === ORDER_STATUS_ENUM.COMPLETED, [orderStatus])

  const isCancelled = useMemo(() => orderStatus === ORDER_STATUS_ENUM.CANCELLED || orderStatus === ORDER_STATUS_ENUM.CANCELLEDBYREST, [orderStatus])

  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [showMap, setShowMap] = useState(false)

  // ----------------------------------
  // 4️⃣ StatusBar handling
  // ----------------------------------
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar)
      }
      StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
    }, [currentTheme, themeContext])
  )

  // ----------------------------------
  // 5️⃣ Header config
  // ----------------------------------
  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: isDelivered ? t('Your order') : t('Confirmation'),

      headerRight: isDelivered
        ? null
        : () => (
            <TouchableOpacity style={styles(currentTheme).helpButton}>
              <Feather name='help-circle' size={24} color={currentTheme.fontMainColor} />
            </TouchableOpacity>
          ),

      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },

      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        height: scale(100)
      },

      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ marginLeft: scale(10) }}>
              <View style={styles(currentTheme).backButton}>{isDelivered ? <Feather name='x' size={20} color={currentTheme.fontMainColor} /> : <AntDesign name='arrowleft' size={20} color={currentTheme.fontMainColor} />}</View>
            </View>
          )}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack()
            else navigation.navigate('cart')
          }}
        />
      )
    })
  }, [currentTheme, isDelivered])

  const handleContactCourier = () => {
    navigation.navigate('ChatWithRider', { id: orderId, orderNo, total, riderPhone })
  }

  // ----------------------------------
  // 6️⃣ UI
  // ----------------------------------
  return (
    <View style={styles(currentTheme).mainContainer}>
      <ScrollView style={styles().scrollView} contentContainerStyle={styles().contentContainer} showsVerticalScrollIndicator={false}>
        {/* ORDER STATUS */}
        {isCancelled ? (
          <DeliveredStatus appName='FAST' title={t('Order cancelled')} subtitle={t('Your order has been cancelled')} error />
        ) : isDelivered ? (
          <DeliveredStatus appName='FAST' />
        ) : (
          <>
            <DeliveryTimeBanner minTime={remainingTime} maxTime={remainingTime + 5} />
            <OrderStatusTimeline currentStatus={orderStatus} />
          </>
        )}

        {/* DELIVERY DETAILS */}
        <DeliveryDetailsCard addressLabel={addressLabel} address={address} showMap={showMap} onToggleMap={setShowMap} mapComponent={<DeliveryMap customerLocation={customerLocation} riderLocation={riderLocation} showRoute={!isDelivered} />} />

        {/* CONTACT COURIER */}
        {rider && !isDelivered && !isCancelled && <ContactCourierCard onPress={()=> handleContactCourier()} contactlessDelivery />}

        {/* ORDER ITEMS */}
        <OrderItemsSection items={orderItems} currencySymbol={currencySymbol} initialExpanded={false} />

        <View style={{ height: scale(180) }} />
      </ScrollView>

      {/* STICKY SUMMARY */}
      <View style={styles(currentTheme).stickyBottomContainer}>
        <OrderSummary priorityDeliveryFee={isPriority ? priorityDeliveryFee : 0} couponDiscountAmount={couponApplied ? couponDiscountAmount : 0} minimumOrderFee={minimumOrderFee} freeDeliveriesRemaining={freeDeliveriesRemaining} subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} deliveryDiscount={deliveryDiscount ?? 0} originalDeliveryCharges={originalDeliveryCharges} tipAmount={tipAmount} total={total} currencySymbol={currencySymbol} expanded={summaryExpanded} onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)} />
      </View>
    </View>
  )
}

export default OrderConfirmation
