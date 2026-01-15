import React, { useContext, useRef } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
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

const OrderHistoryDetails = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const tipBottomSheetRef = useRef(null)


  // Dummy data
  const orderData = {
    status: 'Ongoing',
    scheduledDate: 'Thu, Sep 16',
    scheduledTime: '4:30 PM',
    orderNumber: '#365421',
    deliveryAddress: '45 Al Jazeera Street, Doha, Qatar',
    items: [
      {
        id: 1,
        name: 'Veggie Spring Rolls',
        description: 'Carrots, bell peppers, cucumbers, and cabb...',
        quantity: 1,
        price: 12.40,
        image: require('../../assets/images/empty_OrderHistory.png') // Placeholder - replace with actual image
      },
      {
        id: 2,
        name: 'Apple Juice',
        description: 'Golden Delicious Apples, Filter Water, Ascor...',
        quantity: 1,
        price: 8.74,
        image: require('../../assets/images/empty_OrderHistory.png') // Placeholder - replace with actual image
      }
    ],
    itemSubtotal: 12.40,
    deliveryFee: 0.00,
    deliveryDistance: '500 m',
    courierTip: 0.00,
    total: 15.00,
    paymentMethod: 'Visa **** 9432',
    paymentAmount: 15.00
  }

  // Transform order items to match CartItem structure
  const transformedItems = orderData.items.map((item) => ({
    foodId: item.id,
    foodTitle: item.name,
    image: typeof item.image === 'number' ? item.image : item.image,
    price: item.price,
    quantity: item.quantity,
    foodTotal: item.price.toFixed(2),
    variations: [
      {
        variationId: item.id,
        variationTitle: item.description,
        quantity: item.quantity,
        addons: []
      }
    ]
  }))

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
  }

  const themedStyles = styles(currentTheme)

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
          >
            {t('Order status') || 'Order status'}
          </TextDefault>
          <View style={themedStyles.statusBadge}>
            <TextDefault
              textColor="#B8860B"
              style={themedStyles.statusText}
              bolder
            >
              {orderData.status}
            </TextDefault>
          </View>
        </View>

        {/* Scheduled For Section */}
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
              {orderData.scheduledDate}. {orderData.scheduledTime}
            </TextDefault>
          </View>
        </View>

        {/* Order Items Section */}
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
              key={item.foodId}
              item={item}
              currencySymbol="€"
              isLastItem={index === transformedItems.length - 1}
              isOrderHistory={true}
            />
          ))}
        </View>

        {/* Order Summary Section */}
        <View style={themedStyles.section}>
          <OrderSummaryDetails
            orderNumber={orderData.orderNumber}
            deliveryAddress={orderData.deliveryAddress}
            itemSubtotal={orderData.itemSubtotal}
            deliveryFee={orderData.deliveryFee}
            deliveryDistance={orderData.deliveryDistance}
            courierTip={orderData.courierTip}
            total={orderData.total}
            currencySymbol="€"
          />
        </View>

        {/* Payment Details Section */}
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
              {orderData.paymentMethod}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={themedStyles.paymentAmount}
              bolder
            >
              € {orderData.paymentAmount.toFixed(2)}
            </TextDefault>
          </View>
        </View>

        {/* Spacer for buttons */}
        <View style={themedStyles.buttonSpacer} />
      </ScrollView>

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
        currencySymbol="€"
        currentTip={orderData.courierTip}
      />
    </SafeAreaView>
  )
}

export default OrderHistoryDetails
