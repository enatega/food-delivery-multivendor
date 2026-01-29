import React, { useState, useContext, useLayoutEffect, useMemo, useEffect, useRef } from 'react'
import { View, ScrollView, TouchableOpacity, Platform, StatusBar, ActivityIndicator } from 'react-native'
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
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from './OrderConfirmationStyles'

import useOrderConfirmation from './useOrderConfirmation'
import useOrderTracking from './useOrderTracking' // ✅ NEW
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import useAddToCart from '../ProductDetails/useAddToCart'
// import { ORDER_STATUS_ENUM } from '../../utils/enums'

const OrderConfirmation = (props) => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()

  const orderId = props?.route?.params?.orderId
  console.log('orderData_data',orderId);
  const orderData = props?.route?.params?.orderData || {}

  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const currencySymbol = configuration?.currencySymbol || '€'

  // Add to cart hook – navigate to cart once when reorder succeeds (callback avoids navigation during render)
  const { addItemToCart, loadingItemIds, updateUserCartLoading } = useAddToCart({
    foodId: null,
    onCartUpdateSuccess: () => navigation.navigate('cart')
  })

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
    initialOrder,
    orderNo,
    // riderPhone
  } = useOrderConfirmation({ orderId })
    console.log("🚀 ~ OrderConfirmation ~ couponDiscountAmount:", couponDiscountAmount)
    console.log("initialOrder", JSON.stringify(initialOrder,null,2));
    

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
      longitude: parseFloat(liveOrder?.rider?.location?.coordinates[0]) ?? undefined,
      latitude: parseFloat(liveOrder?.rider?.location?.coordinates[1]) ?? undefined
    }
  const rider = liveOrder?.rider || null
  // ----------------------------------
  // 3️⃣ Derived UI states
  // ----------------------------------
  const isDelivered = useMemo(() => orderStatus === ORDER_STATUS_ENUM.DELIVERED || orderStatus === ORDER_STATUS_ENUM.COMPLETED, [orderStatus])

  const isCancelled = useMemo(() => orderStatus === ORDER_STATUS_ENUM.CANCELLED || orderStatus === ORDER_STATUS_ENUM.CANCELLEDBYREST, [orderStatus])

  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const hasNavigatedRef = useRef(false)

  // ----------------------------------
  // 4️⃣ Navigate to FeedBack when delivered
  // ----------------------------------
  useEffect(() => {
    if (isDelivered && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      const timeoutId = setTimeout(() => {
        navigation.navigate('FeedBack', { isDelivered, orderId })
      }, 3000)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [isDelivered, navigation, orderId])

  // ----------------------------------
  // 5️⃣ StatusBar handling
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
  // 6️⃣ Header config
  // ----------------------------------
  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: isDelivered ? t('Your order') : t('Confirmation'),

      headerRight: isDelivered
        ? null
        : () => (
          <TouchableOpacity onPress={()=> navigation.navigate('FastHelpSupport')} hitSlop={12} style={styles(currentTheme).helpButton}>
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
    navigation.navigate('ChatWithRider', { id: orderId, orderNo, total, riderPhone: rider?.phone })
  }

  const handleOrderAgain = () => {
    console.log('orderItems____Json', JSON.stringify(orderItems,null,2));
    if (!orderItems || orderItems.length === 0) {
      return
    }

    // Build array of items in the required format
    const itemsArray = orderItems
      .filter((item) => item.food && item.variation?._id)
      .map((item) => {
        const foodId = item.food
        const variationId = item.variation?._id
        const quantity = item.quantity || item.foodQuantity || 1
        const addons = item.addons || []
        
        console.log(
          'item_Json_Data',
          JSON.stringify(
            {
              foodId,
              variationId,
              quantity,
              addons,
            },
            null,
            2
          )
        )
        
        return {
          _id: foodId,
          categoryId: '123',
          variation: {
            _id: variationId,
            addons,
            count: quantity
          }
        }
      })

    // Add all items to cart at once if we have valid items
    if (itemsArray.length > 0) {
      // Use the first item's data for the function signature, but pass the full array
      const firstItem = orderItems.find((item) => item.food && item.variation?._id)
      if (firstItem) {
        const foodId = firstItem.food
        const variationId = firstItem.variation?._id
        const quantity = firstItem.quantity || firstItem.foodQuantity || 1
        const addons = firstItem.addons || []
        addItemToCart(foodId, '', variationId, addons, quantity, itemsArray)
      }
    }

    // Navigate to cart screen
  }

  // ----------------------------------
  // 7️⃣ UI
  // ----------------------------------
  return (
    <View style={styles(currentTheme).mainContainer}>
      <ScrollView style={styles().scrollView} contentContainerStyle={styles().contentContainer} showsVerticalScrollIndicator={false}>
        {/* ORDER STATUS */}
        {isCancelled ? (
          <DeliveredStatus appName='FAST' title={t('Order cancelled')} subtitle={t('Your order has been cancelled')} error />
        ) : isDelivered ? (
          <DeliveredStatus appName='FAST' isPickUpOrder={orderData?.isPickedUp ?? liveOrder?.isPickedUp} />
        ) : (
          <>
            <DeliveryTimeBanner minTime={remainingTime} maxTime={remainingTime + 5} />
            <OrderStatusTimeline currentStatus={orderStatus} isPickUpOrder={ orderData?.isPickedUp ?? liveOrder?.isPickedUp} />
          </>
        )}

        {/* DELIVERY DETAILS */}
        {!liveOrder?.isPickedUp && (
          <DeliveryDetailsCard addressLabel={addressLabel} address={address} showMap={showMap} onToggleMap={setShowMap} mapComponent={<DeliveryMap customerLocation={customerLocation} riderLocation={riderLocation} showRoute={!isDelivered} />} />
        )}
        {/* CONTACT COURIER */}
        {rider && !isDelivered && !isCancelled && <ContactCourierCard onPress={() => handleContactCourier()} contactlessDelivery />}

        {/* ORDER ITEMS */}
        <OrderItemsSection items={orderItems} currencySymbol={currencySymbol} initialExpanded={false} />

        <View style={{ height: scale(180) }} />
      </ScrollView>

      {/* STICKY SUMMARY */}
      <View style={styles(currentTheme).stickyBottomContainer}>
        <OrderSummary priorityDeliveryFee={isPriority ? priorityDeliveryFee : 0} couponDiscountAmount={couponApplied ? couponDiscountAmount : 0} minimumOrderFee={minimumOrderFee} freeDeliveriesRemaining={freeDeliveriesRemaining} subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} deliveryDiscount={deliveryDiscount ?? 0} originalDeliveryCharges={originalDeliveryCharges} tipAmount={tipAmount} total={total} currencySymbol={currencySymbol} expanded={summaryExpanded} onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)} />
        {(isDelivered || isCancelled) && (
          <TouchableOpacity style={styles(currentTheme).orderAgainButton} onPress={handleOrderAgain}>
            { updateUserCartLoading ? <ActivityIndicator size="small" color={currentTheme.white} /> :  <TextDefault H4 textColor={currentTheme.white} center bold>
              {t('Order again')}
            </TextDefault> }
           
          </TouchableOpacity>
        )}
      </View>      
    </View>
  )
}

export default OrderConfirmation
