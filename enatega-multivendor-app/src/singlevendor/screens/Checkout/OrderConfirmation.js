// import React, { useState, useContext, useLayoutEffect } from 'react'
// import { View, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native'
// import { AntDesign, Feather } from '@expo/vector-icons'
// import { useFocusEffect, useNavigation } from '@react-navigation/native'
// import { HeaderBackButton } from '@react-navigation/elements'
// import { useTranslation } from 'react-i18next'

// import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
// import ConfigurationContext from '../../../context/Configuration'
// import { theme } from '../../../utils/themeColors'
// import { scale } from '../../../utils/scaling'
// import { textStyles } from '../../../utils/textStyles'
// import OrderSummary from '../../components/Checkout/OrderSummary'

// import { OrderStatusTimeline, ORDER_STATUSES, DeliveryTimeBanner, DeliveryDetailsCard, ContactCourierCard, OrderItemsSection, DeliveryMap, DeliveredStatus } from '../../components/Checkout/OrderConfirmation'

// import styles from './OrderConfirmationStyles'
// import useOrderConfirmation from './useOrderConfirmation'

// const OrderConfirmation = (props) => {
//   const orderData = props?.route?.params?.orderData || {}
//   const orderId = props?.route?.params?.orderId || ''
//   const { loading, subtotal, deliveryFee, serviceFee, minimumOrderFee, taxAmount, total, isBelowMinimumOrder, minimumOrderAmount, deliveryDiscount, originalDeliveryCharges, freeDeliveriesRemaining, isBelowMaximumOrder, refetch, error, couponDiscountAmount, couponApplied, priorityDeliveryFee, isPriority, tipAmount, orderStatus,addressLabel,address ,customerLocation,orderItems} = useOrderConfirmation({ orderId })
//   console.log('tipping::', tipAmount, 'Order Amound:', total)
//   const navigation = useNavigation()
//   const { t, i18n } = useTranslation()
//   const configuration = useContext(ConfigurationContext)
//   const themeContext = useContext(ThemeContext)

//   const currentTheme = {
//     isRTL: i18n.dir() === 'rtl',
//     ...theme[themeContext.ThemeValue]
//   }

//   const currencySymbol = configuration?.currencySymbol || '€'

//   const [summaryExpanded, setSummaryExpanded] = useState(false)
//   const [showMap, setShowMap] = useState(false)

//   const [statusTimes] = useState({
//     confirmed: '8:00 pm',
//     packed: '8:10 pm',
//     picked_up: '8:15 pm'
//   })

//   const isDelivered = orderStatus === ORDER_STATUSES.DELIVERED || orderStatus === ORDER_STATUSES.COMPLETED

//   const isCancelled = orderStatus === ORDER_STATUSES.CANCELLED || orderStatus === ORDER_STATUSES.CANCELLEDBYREST

//   const riderLocation = null

//   const orderNumber = orderData.orderNumber || '#365421'

//   useFocusEffect(
//     React.useCallback(() => {
//       if (Platform.OS === 'android') {
//         StatusBar.setBackgroundColor(currentTheme.menuBar)
//       }
//       StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
//     }, [currentTheme, themeContext])
//   )

//   useLayoutEffect(() => {
//     props?.navigation.setOptions({
//       title: isDelivered ? t('Your order') || 'Your order' : t('Confirmation') || 'Confirmation',
//       headerRight: isDelivered
//         ? null
//         : () => (
//             <TouchableOpacity style={styles(currentTheme).helpButton}>
//               <Feather name='help-circle' size={24} color={currentTheme.fontMainColor} />
//             </TouchableOpacity>
//           ),
//       headerTitleAlign: 'center',
//       headerTitleStyle: {
//         color: currentTheme.newFontcolor,
//         ...textStyles.H4,
//         ...textStyles.Bolder
//       },
//       headerStyle: {
//         backgroundColor: currentTheme.newheaderBG,
//         shadowColor: 'transparent',
//         shadowRadius: 0,
//         elevation: 0,
//         borderBottomWidth: 0,
//         height: scale(100)
//       },
//       headerLeft: () => (
//         <HeaderBackButton
//           truncatedLabel=''
//           backImage={() => (
//             <View style={{ marginLeft: scale(10) }}>
//               <View style={styles(currentTheme).backButton}>{isDelivered ? <Feather name='x' size={20} color={currentTheme.fontMainColor} /> : <AntDesign name='arrowleft' size={20} color={currentTheme.fontMainColor} />}</View>
//             </View>
//           )}
//           onPress={() =>  {if(navigation.canGoBack()){navigation.goBack()}else{navigation.navigate('cart')} }}
//         />
//       )
//     })
//   }, [props?.navigation, currentTheme, isDelivered])

//   const handleContactCourier = () => {
//     // Navigate to chat or call courier
//     // navigation.navigate('ChatWithRider');
//     console.log('contact courier clicked')
//   }

//   return (
//     <View style={styles(currentTheme).mainContainer}>
//       <ScrollView style={styles().scrollView} contentContainerStyle={styles().contentContainer} showsVerticalScrollIndicator={false}>
//         {/* {isDelivered ? (
//           // Delivered State
//           <DeliveredStatus appName='FAST' />
//         ) : (
//           // Tracking State
//           <>
//             <DeliveryTimeBanner minTime={15} maxTime={25} />
//             <OrderStatusTimeline currentStatus={orderStatus} statusTimes={statusTimes} />
//           </>
//         )} */}

//         {isCancelled ? (
//           <DeliveredStatus appName='FAST' title={t('Order cancelled')} subtitle={t('Your order has been cancelled')} error />
//         ) : isDelivered ? (
//           <DeliveredStatus appName='FAST' />
//         ) : (
//           <>
//             {/* <DeliveryTimeBanner minTime={15} maxTime={25} /> */}
//             <OrderStatusTimeline currentStatus={orderStatus} statusTimes={statusTimes} />
//           </>
//         )}

//         {/* Delivery Details */}
//         <DeliveryDetailsCard addressLabel={addressLabel} address={address} showMap={showMap} onToggleMap={setShowMap} mapComponent={<DeliveryMap customerLocation={customerLocation} riderLocation={riderLocation} showRoute={!isDelivered} />} />

//         {/* Contact Courier - only show when not delivered */}
//         {!isDelivered && <ContactCourierCard onPress={handleContactCourier} contactlessDelivery={true} />}

//         {/* Order Items */}
//         <OrderItemsSection items={orderItems} currencySymbol={currencySymbol} initialExpanded={false} />

//         {/* Spacer for sticky bottom */}
//         <View style={{ height: scale(180) }} />
//       </ScrollView>

//       {/* Sticky Bottom: Summary */}
//       <View style={styles(currentTheme).stickyBottomContainer}>
//         {/* <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} tipAmount={tipAmount} total={total} currencySymbol={currencySymbol} expanded={summaryExpanded} onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)} orderNumber={summaryExpanded ? orderNumber : null} /> */}
//         <OrderSummary priorityDeliveryFee={isPriority ? priorityDeliveryFee : 0} couponDiscountAmount={couponApplied ? couponDiscountAmount : 0} minimumOrderFee={isBelowMaximumOrder ? minimumOrderFee : 0} freeDeliveriesRemaining={freeDeliveriesRemaining} subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} deliveryDiscount={deliveryDiscount ?? 0} originalDeliveryCharges={originalDeliveryCharges} tipAmount={tipAmount} total={total} currencySymbol={currencySymbol} expanded={summaryExpanded} onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)} />
//       </View>
//     </View>
//   )
// }

// export default OrderConfirmation

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
    orderNo,
    riderPhone
  } = useOrderConfirmation({ orderId })

  // ----------------------------------
  // 2️⃣ Real-time tracking (SUBSCRIPTION)
  // ----------------------------------
  const { order: liveOrder, remainingTime } = useOrderTracking({
    orderId,
    initialOrder: {
      orderStatus: initialStatus,
      rider: orderData?.rider || null
    }
  })

  const orderStatus = liveOrder?.orderStatus
  const riderLocation = liveOrder?.rider?.location || null
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
