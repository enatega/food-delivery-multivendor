import React, { useContext, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import AccountSectionHeader from '../../components/AccountSectionHeader'
import OrderSummaryDetails from '../../components/OrderHistory/OrderSummaryDetails'
import CartItem from '../../components/Cart/CartItem'
import TipBottomSheet from '../../components/OrderHistory/TipBottomSheet'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './OrderHistoryDetailStyle'
import useOrderConfirmation from '../Checkout/useOrderConfirmation'
import ConfigurationContext from '../../../context/Configuration'
import { OrderSummary } from '../../components/Checkout'

const OrderHistoryDetails = () => {
  const route = useRoute()
  const orderId = route?.params?.orderId
  console.log('orderId_from_order_history_details', orderId)
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const tipBottomSheetRef = useRef(null)
  const currencySymbol = configuration?.currencySymbol || '€'
  const [summaryExpanded, setSummaryExpanded] = useState(false)
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
  // Transform order items to match CartItem structure
  const transformedItems = orderItems?.map((item) => ({
    foodId: item._id || item.food,
    foodTitle: item.foodTitle || item.title,
    foodImage: item.foodImage || item.image,
    image: item.foodImage || item.image,
    quantity: item.foodQuantity || item.quantity,
    variations: [
      {
        variationId: item.variation?._id,
        variationTitle: item.variationTitle || item.variation?.title,
        quantity: item.foodQuantity || item.quantity,
        price: item.variation?.price || item.variation?.discounted || 0,
        discountedUnitPrice: item.variation?.discounted || item.variation?.price || 0,
        addons: item.addons || []
      }
    ]
  })) || []

  // Format date for scheduled section
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = days[date.getDay()]
    const month = months[date.getMonth()]
    const dayNum = date.getDate()
    return `${day}, ${month} ${dayNum}`
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes
    return `${hours}:${minutesStr} ${ampm}`
  }

  const scheduledDate = initialOrder?.preparationTime || initialOrder?.expectedTime || initialOrder?.createdAt
  const scheduledTime = initialOrder?.preparationTime || initialOrder?.expectedTime || initialOrder?.createdAt

  const handleIncreaseTip = () => {
    tipBottomSheetRef.current?.open()
  }

  const handleTipSelected = (amount) => {
    // Handle tip selection
    console.log('Tip selected:', amount)
    // You can update the order data or make an API call here
  }

  const handleTrackProgress = () => {
    // Handle track progress action
    console.log('Track progress pressed')
    navigation.navigate('OrderConfirmation', { orderId: orderId })
  }

  const themedStyles = styles(currentTheme)

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <AccountSectionHeader
          currentTheme={currentTheme}
          onBack={() => navigation.goBack()}
          headerText={t('Order details') || 'Order details'}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={currentTheme.singlevendorcolor} />
        </View>
      </SafeAreaView>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <AccountSectionHeader
          currentTheme={currentTheme}
          onBack={() => navigation.goBack()}
          headerText={t('Order details') || 'Order details'}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: scale(20) }}>
          <TextDefault textColor={currentTheme.fontMainColor} bolder>
            {t('Error loading order details') || 'Error loading order details'}
          </TextDefault>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={themedStyles.container}>
      <AccountSectionHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        headerText={t('Order details') || 'Order details'}
      />

      <ScrollView
        style={themedStyles.scrollView}
        contentContainerStyle={themedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Status Section */}
        <View style={themedStyles.section}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            style={themedStyles.sectionTitle}
            bolder
            h4
          >
            {t('Order status') || 'Order status'}
          </TextDefault>
          <View style={themedStyles.statusBadge}>
            <TextDefault
              textColor="#B8860B"
              style={themedStyles.statusText}
              bolder
            >
              {initialStatus || 'PENDING'}
            </TextDefault>
          </View>
        </View>

        {/* Scheduled For Section */}
        {scheduledDate && (
          <View style={themedStyles.section}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={themedStyles.sectionTitle}
              bolder
            >
              {t('Scheduled for') || 'Scheduled for'}
            </TextDefault>
            <View style={themedStyles.scheduledRow}>
              <Feather
                name="calendar"
                size={scale(18)}
                color={currentTheme.fontMainColor}
                style={themedStyles.calendarIcon}
              />
              <TextDefault
                textColor={currentTheme.fontMainColor}
                style={themedStyles.scheduledText}
              >
                {formatDate(scheduledDate)}. {formatTime(scheduledTime)}
              </TextDefault>
            </View>
          </View>
        )}

        {/* Order Items Section */}
        {transformedItems.length > 0 && (
          <View style={themedStyles.section}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={themedStyles.sectionTitle}
              bolder
            >
              {t('Order items') || 'Order items'}
            </TextDefault>
            {transformedItems.map((item, index) => (
              <CartItem
                key={item.foodId || index}
                item={item}
                currencySymbol={currencySymbol}
                isLastItem={index === transformedItems.length - 1}
                isOrderHistory={true}
              />
            ))}
          </View>
        )}

        {/* Payment Details Section */}
        {initialOrder?.paymentMethod && (
          <View style={themedStyles.section}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={themedStyles.sectionTitle}
              bolder
            >
              {t('Payment details') || 'Payment details'}
            </TextDefault>
            <View style={themedStyles.paymentRow}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                style={themedStyles.paymentMethod}
              >
                {initialOrder.paymentMethod}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                style={themedStyles.paymentAmount}
                bolder
              >
                {currencySymbol} {(initialOrder.paidAmount || total || 0).toFixed(2)}
              </TextDefault>
            </View>
          </View>
        )}

        {/* Spacer for buttons */}
        <View style={themedStyles.buttonSpacer} />
      </ScrollView>

      {/* Order Summary */}
      <View style={themedStyles.stickyBottomContainer}>
        <OrderSummary 
          priorityDeliveryFee={isPriority ? priorityDeliveryFee : 0} 
          couponDiscountAmount={couponApplied ? couponDiscountAmount : 0} 
          minimumOrderFee={minimumOrderFee} 
          freeDeliveriesRemaining={freeDeliveriesRemaining} 
          subtotal={subtotal} 
          deliveryFee={deliveryFee} 
          serviceFee={serviceFee} 
          deliveryDiscount={deliveryDiscount ?? 0} 
          originalDeliveryCharges={originalDeliveryCharges} 
          tipAmount={tipAmount} 
          total={total} 
          currencySymbol={currencySymbol} 
          expanded={summaryExpanded} 
          onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)} 
        />
      </View>

      {/* Action Buttons */}
      <View style={themedStyles.buttonContainer}>
        <TouchableOpacity
          style={themedStyles.increaseTipButton}
          onPress={handleIncreaseTip}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor={currentTheme.singlevendorcolor}
            style={themedStyles.buttonText}
            bolder
          >
            {t('Increase the tip') || 'Increase the tip'}
          </TextDefault>
        </TouchableOpacity>

        <TouchableOpacity
          style={themedStyles.trackProgressButton}
          onPress={handleTrackProgress}
          activeOpacity={0.7}
        >
          <TextDefault
            textColor="#FFFFFF"
            style={themedStyles.buttonText}
            bolder
          >
            {t('Track progress') || 'Track progress'}
          </TextDefault>
        </TouchableOpacity>
      </View>

      {/* Tip Bottom Sheet */}
      <TipBottomSheet
        ref={tipBottomSheetRef}
        onTipSelected={handleTipSelected}
        currencySymbol={currencySymbol}
        currentTip={tipAmount || 0}
      />
    </SafeAreaView>
  )
}

export default OrderHistoryDetails
