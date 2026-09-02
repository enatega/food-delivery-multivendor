import React, { useState, useContext, useLayoutEffect, useRef, useCallback } from 'react'
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { HeaderBackButton } from '@react-navigation/elements'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import UserContext from '../../../context/User'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

import FulfillmentTabs from '../../components/Checkout/FulfillmentTabs'
import DeliveryOptions from '../../components/Checkout/DeliveryOptions'
import DeliveryTimeOptions from '../../components/Checkout/DeliveryTimeOptions'
import PaymentSection from '../../components/Checkout/PaymentSection'
import TipSection from '../../components/Checkout/TipSection'
import OrderSummary from '../../components/Checkout/OrderSummary'
import VoucherBottomSheet from '../../components/Checkout/VoucherBottomSheet'
import useScheduleStore from '../../stores/scheduleStore'
import styles from './Styles'
import useCheckout from './useCheckout'
import { LocationContext } from '../../../context/Location'
import MainModalize from '../../../components/Main/Modalize/MainModalize'
import AddressModalHeader from '../../components/Home/AddressModalHeader'
import AddressModalFooter from '../../components/Home/AddressModalFooter'
import CustomHomeIcon from '../../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomWorkIcon from '../../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomApartmentIcon from '../../../assets/SVG/imageComponents/CustomApartmentIcon'
import CustomOtherIcon from '../../../assets/SVG/imageComponents/CustomOtherIcon'
import { COUPON } from '../../apollo/mutations'
import { useMutation } from '@apollo/client'
import { ActivityIndicator } from 'react-native-paper'
import OrderSummaryError from '../../components/Checkout/OrderSummaryError'
import { WrongAddressModal } from '../../../components/Checkout/WrongAddressModal'
import { APP_MODES } from '../../../mode/constants'
import { getModeItem, removeModeItem, setModeItem } from '../../../mode/storage'
import OrderSummarySkeleton from './OrderSummarySkeleton'
import SmallOrderFeeTip from '../../components/Checkout/SmallOrderFeeTip'

const Checkout = (props) => {
  const { location, setLocation } = useContext(LocationContext)
  const { isLoggedIn, profile } = useContext(UserContext)
  console.log('Location Checkout Data:', location)
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()

  const themeContext = useContext(ThemeContext)
  const { cart } = useContext(UserContext)

  // Get schedule from Zustand store
  const { selectedSchedule } = useScheduleStore()

  // Ref for voucher bottom sheet
  const voucherBottomSheetRef = useRef(null)
  const modalRef = useRef()
  const addressIcons = {
    House: CustomHomeIcon,
    Office: CustomWorkIcon,
    Apartment: CustomApartmentIcon,
    Other: CustomOtherIcon
  }

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // const currencySymbol = configuration?.currencySymbol || '€'

  // State management
  const [fulfillmentMode, setFulfillmentMode] = useState('delivery') // 'delivery' or 'collection'
  const [leaveAtDoor, setLeaveAtDoor] = useState(false)
  const [callOnArrival, setCallOnArrival] = useState(false)
  const [courierInstructions, setCourierInstructions] = useState('')
  const [deliveryTime, setDeliveryTime] = useState(selectedSchedule ? 'schedule' : 'standard') // 'priority', 'standard', 'schedule'
  const [paymentMethod, setPaymentMethod] = useState('COD') // 'card' or 'voucher'
  const [selectedCard] = useState('**** 9432')
  const [selectedVoucher, setSelectedVoucher] = useState(null)
  const [voucherCode, setVoucherCode] = useState('')
  const [tipAmount, setTipAmount] = useState(0)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [isWrongAddressModalVisible, setIsWrongAddressModalVisible] = useState(false)
  const [isSmallOrderFeeTipVisible, setIsSmallOrderFeeTipVisible] = useState(true)
  const [, setIsSmallOrderFeePromoVisible] = useState(false)
  const [, setIsSmallOrderFeePromoExpanded] = useState(false)
  const isSubscribed = Boolean(profile?.stripe_plan_id)
  const { loading, subtotal, deliveryFee, serviceFee, currencySymbol, minimumOrderFee, taxAmount, total, dealDiscount, isBelowMinimumOrder, minimumOrderAmount, deliveryDiscount, originalDeliveryCharges, freeDeliveriesRemaining, isBelowMaximumOrder, placeOrder, placingOrder, error, couponDiscountAmount, couponApplied, recalculateSummary, priorityDeliveryFee, creditsUsed, maximumOrderAmount, checkoutQuoteId, idempotencyKey } = useCheckout({
    fulfillmentMode,
    deliveryAddress: location,
    selectedVoucher,
    onPlaceOrderError: () => setIsWrongAddressModalVisible(true)
  })

  const handleApplyVoucher = useCallback(
    (voucher) => {
      console.log('🎟️ Applying voucher:', voucher)
      setSelectedVoucher(voucher)
      recalculateSummary({ coupon: voucher?._id })
      setModeItem('selectedVoucher', JSON.stringify(voucher), APP_MODES.SINGLE).catch((error) => {
        console.log('🚀 ~ handleApplyVoucher ~ error:', error)
      })

      // TODO: Implement voucher validation and discount calculation
    },
    [recalculateSummary]
  )

  const handleRemoveVoucher = useCallback(() => {
    setSelectedVoucher(null)
    recalculateSummary({ coupon: '' })
    removeModeItem('selectedVoucher', APP_MODES.SINGLE).catch((error) => {
      console.log('🚀 ~ handleRemoveVoucher ~ error:', error)
    })
  }, [recalculateSummary])

  const [applyCoupon, { loading: applyingCoupon }] = useMutation(COUPON, {
    onCompleted: (data) => {
      if (!data?.coupon?.success) {
        return
      }
      const coupon = data?.coupon?.coupon
      if (coupon) {
        handleApplyVoucher(coupon)
        setVoucherCode('')
      }
    },
    onError: (err) => {
      console.log('Error applying coupon', err)
    }
  })

  error && console.log('error_____onError', placeOrder)

  console.log('checkout hook data:', location, loading, subtotal, deliveryFee, serviceFee, minimumOrderFee, taxAmount, total, isBelowMinimumOrder, minimumOrderAmount, deliveryDiscount)
  React.useEffect(() => {
    console.log('📦 Fulfillment Mode Changed:', fulfillmentMode)

    // When switching to collection mode, clear the delivery time selection
    if (fulfillmentMode === 'collection') {
      console.log('🔄 Switching to Click & Collect - clearing delivery time selection')
      setDeliveryTime(null)
    } else if (fulfillmentMode === 'delivery') {
      // When switching back to delivery, set default selection
      console.log('🔄 Switching to Delivery - setting default time')
      if (!deliveryTime || deliveryTime === null) {
        setDeliveryTime(selectedSchedule ? 'schedule' : 'standard')
      }
    }
  }, [fulfillmentMode])

  React.useEffect(() => {
    console.log('⏰ Delivery Time Changed:', deliveryTime)
    if (deliveryTime === 'schedule' && selectedSchedule) {
      console.log('📅 Scheduled Details:', {
        date: selectedSchedule.dateLabel,
        time: selectedSchedule.timeSlot.time,
        timeSlotId: selectedSchedule.timeSlot.id,
        startTime: selectedSchedule.timeSlot.startTime,
        endTime: selectedSchedule.timeSlot.endTime
      })
    }
  }, [deliveryTime, selectedSchedule])

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: t('Checkout') || 'Checkout',
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingHorizontal: scale(20)
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        shadowColor: 'transparent',
        shadowRadius: 0,
        shadowOffset: { height: 0 },
        elevation: 0,
        borderBottomWidth: 0,
        height: scale(84)
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLsmall, alignItems: 'center' }}>
              <View
                style={{
                  width: scale(34),
                  height: scale(34),
                  borderRadius: scale(17),
                  backgroundColor: currentTheme.colorBgTertiary || '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: currentTheme.colorBorder,
                  shadowColor: 'transparent',
                  elevation: 0
                }}
              >
                <AntDesign name='arrowleft' size={19} color={currentTheme.fontMainColor || '#000'} />
              </View>
            </View>
          )}
          onPress={() => navigation.goBack()}
        />
      )
    })
  }, [props?.navigation, currentTheme])

  const getAndApplySelectedVoucher = useCallback(async() => {
    try {
      const voucher = await getModeItem('selectedVoucher', APP_MODES.SINGLE)
      const parsedVoucher = JSON.parse(voucher)
      if (!parsedVoucher) return
      if (selectedVoucher?._id && parsedVoucher?._id === selectedVoucher?._id) return
      handleApplyVoucher(parsedVoucher)
    } catch (error) {
      console.log('🚀 ~ getAndApplySelectedVoucher ~ error:', error)
    }
  }, [handleApplyVoucher, selectedVoucher?._id])

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar)
      }
      StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')

      getAndApplySelectedVoucher()

      // Handle schedule selection for both delivery and collection modes
      if (selectedSchedule) {
        console.log('📅 Schedule detected on focus, setting deliveryTime to schedule')
        setDeliveryTime('schedule')
      } else if (deliveryTime === 'schedule') {
        // If no schedule exists but deliveryTime is 'schedule', reset it
        if (fulfillmentMode === 'delivery') {
          setDeliveryTime('standard')
        } else if (fulfillmentMode === 'collection') {
          setDeliveryTime(null)
        }
      }
    }, [currentTheme, themeContext, selectedSchedule, fulfillmentMode, deliveryTime, getAndApplySelectedVoucher])
  )

  const handlePlaceOrder = () => {
    // Prepare order data with complete delivery information
    const orderData = {
      fulfillmentMode,
      deliveryAddress: location,
      deliveryTime,
      paymentMethod,
      tipAmount,
      total,
      subtotal,
      deliveryFee,
      items: cart,
      orderNumber: '#' + Math.floor(100000 + Math.random() * 900000),
      // Delivery preferences (only for delivery mode)
      ...(fulfillmentMode === 'delivery' && {
        deliveryPreferences: {
          leaveAtDoor,
          callOnArrival,
          courierInstructions
        }
      }),
      // Include scheduled delivery details if schedule is selected
      ...(deliveryTime === 'schedule' &&
        selectedSchedule && {
        scheduledDelivery: {
          date: selectedSchedule.date,
          dateLabel: selectedSchedule.dateLabel,
          dayName: selectedSchedule.dayName,
          timeSlot: {
            id: selectedSchedule.timeSlot.id,
            time: selectedSchedule.timeSlot.time,
            startTime: selectedSchedule.timeSlot.startTime,
            endTime: selectedSchedule.timeSlot.endTime
          }
        }
      })
    }

    const modifiedLocation = {
      _id: location?._id,
      deliveryAddress: location?.deliveryAddress,
      details: location?.details,
      label: location?.label,
      latitude: location?.latitude?.toString(),
      longitude: location?.longitude?.toString()
    }

    const orderVariables = {
      paymentMethod,
      address: modifiedLocation,
      tipping: tipAmount,
      orderDate: `${new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()}`,
      isPickedUp: fulfillmentMode === 'collection',
      specialInstructions: orderData?.deliveryPreferences?.courierInstructions || '',
      couponCode: selectedVoucher?._id || '',
      instructions: orderData?.deliveryPreferences?.courierInstructions || '',
      scheduleData: {
        scheduleTimeId: selectedSchedule?.timeSlot?.id || null,
        isScheduled: deliveryTime === 'schedule',
        dayId: selectedSchedule?.dayId || null
      },

      isPriority: deliveryTime === 'priority',
      checkoutQuoteId,
      idempotencyKey
    }
    console.log('🛒 PLACE ORDER - Complete Order Data:', selectedSchedule, orderData, orderVariables)
    placeOrder({
      variables: orderVariables
    })

    // Navigate to Order Confirmation screen

    // navigation.navigate('OrderConfirmation', { orderData })
  }

  const isOrderValid = () => {
    if (error) return false
    if (loading) return false
    if (isBelowMinimumOrder) return false
    if (fulfillmentMode === 'delivery' && !location) return false
    // In collection mode, user must select a time option
    if (fulfillmentMode === 'collection' && !deliveryTime) return false
    return true
  }

  const handleApplyVoucherCode = () => {
    const code = voucherCode.trim()
    if (!code) return
    applyCoupon({ variables: { coupon: code } })
  }

  const modalHeader = () => <AddressModalHeader onClose={() => modalRef.current.close()}></AddressModalHeader>

  const modalFooter = () => <AddressModalFooter onClose={() => modalRef.current.close()}></AddressModalFooter>

  const setAddressLocation = async(address) => {
    if (modalRef?.current) {
      modalRef?.current?.close()
    }
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
  }
  const onOpen = useCallback(() => {
    console.log('open')
    if (modalRef.current) {
      modalRef.current.open()
    }
  }, [])

  const handleWrongAddressSelectAnother = useCallback(() => {
    setIsWrongAddressModalVisible(false)
    onOpen()
  }, [onOpen])

  const handleTipSelection = (amount) => {
    setTipAmount((prev) => (prev === amount ? 0 : amount))
  }
  return (
    <View style={styles(currentTheme).mainContainer}>
      <ScrollView style={styles().scrollView} contentContainerStyle={styles().contentContainer} showsVerticalScrollIndicator={false}>
        <FulfillmentTabs selectedMode={fulfillmentMode} onSelectMode={setFulfillmentMode} />
        {fulfillmentMode === 'delivery' && <DeliveryOptions deliveryAddress={location} onSelectAddress={() => onOpen()} leaveAtDoor={leaveAtDoor} onToggleLeaveAtDoor={setLeaveAtDoor} callOnArrival={callOnArrival} onToggleCallOnArrival={setCallOnArrival} courierInstructions={courierInstructions} onChangeCourierInstructions={setCourierInstructions} />}
        <DeliveryTimeOptions priorityDeliveryFee={priorityDeliveryFee} selectedTime={deliveryTime} onSelectTime={setDeliveryTime} mode={fulfillmentMode} scheduledTime={selectedSchedule} />
        <PaymentSection
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          selectedCard={selectedCard}
          selectedVoucher={selectedVoucher}
          voucherCode={voucherCode}
          onChangeVoucherCode={setVoucherCode}
          onApplyVoucherCode={handleApplyVoucherCode}
          applyingVoucher={applyingCoupon}
          onRemoveVoucher={handleRemoveVoucher}
          onChangeCard={() => {
            /* TODO: Navigate to payment methods */
          }}
          onChangeVoucher={() => {
            /* TODO: Navigate to vouchers */
          }}
          onOpenVouchers={() => navigation.navigate('Vouchers', { returnTo: 'Checkout' })}
          voucherBottomSheetRef={voucherBottomSheetRef}
        />
        {fulfillmentMode === 'delivery' && <TipSection selectedTip={tipAmount} onSelectTip={handleTipSelection} currencySymbol={currencySymbol} />}
        <View style={{ height: scale(24) }} />
      </ScrollView>
      <View style={styles(currentTheme).stickyBottomContainer}>
        {loading
          ? (
          <OrderSummarySkeleton />
            )
          : error
            ? (
          <OrderSummaryError onRetry={recalculateSummary} />
              )
            : (
          <OrderSummary creditsUsed={creditsUsed} dealDiscount={dealDiscount} isCheckout={true} priorityDeliveryFee={deliveryTime === 'priority' ? priorityDeliveryFee : 0} couponDiscountAmount={couponApplied ? couponDiscountAmount : 0} minimumOrderFee={isBelowMaximumOrder ? minimumOrderFee : 0} freeDeliveriesRemaining={freeDeliveriesRemaining} subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} deliveryDiscount={deliveryDiscount ?? 0} originalDeliveryCharges={originalDeliveryCharges} tipAmount={fulfillmentMode === 'delivery' ? tipAmount : 0} total={total} currencySymbol={currencySymbol} expanded={summaryExpanded} onToggleExpanded={() => setSummaryExpanded(!summaryExpanded)} />
              )}
        {minimumOrderFee > 0 && isSmallOrderFeeTipVisible && (
          <SmallOrderFeeTip
            currencySymbol={currencySymbol}
            minimumOrderAmount={maximumOrderAmount}
            onClose={() => {
              setIsSmallOrderFeeTipVisible(false)
              if (!isSubscribed) {
                setIsSmallOrderFeePromoVisible(true)
                setIsSmallOrderFeePromoExpanded(true)
              }
            }}
            currentTheme={currentTheme}
            t={t}
          />
        )}
        {/* {minimumOrderFee > 0 && isSmallOrderFeePromoVisible && !isSubscribed && (
          <SmallOrderFeeSubscribeCard
            currentTheme={currentTheme}
            t={t}
            expanded={isSmallOrderFeePromoExpanded}
            onToggle={() => setIsSmallOrderFeePromoExpanded((prev) => !prev)}
            onSubscribe={() => navigation.navigate('Membership')}
          />
        )} */}
        <TouchableOpacity style={[styles(currentTheme).placeOrderButton, !isOrderValid() && styles(currentTheme).placeOrderButtonDisabled]} onPress={handlePlaceOrder} disabled={!isOrderValid()} activeOpacity={0.7}>
          {placingOrder
            ? (
            <ActivityIndicator size={18} color={currentTheme.singleVendorOnBrand} />
              )
            : (
            <TextDefault textColor={isOrderValid() ? currentTheme.singleVendorOnBrand : currentTheme.fontSecondColor} bolder H5>
              {t('placeOrder') || 'Place order'}
            </TextDefault>
              )}
        </TouchableOpacity>
      </View>
      <VoucherBottomSheet ref={voucherBottomSheetRef} onApplyVoucher={handleApplyVoucher} />
      <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
      <WrongAddressModal theme={currentTheme} modalVisible={isWrongAddressModalVisible} setModalVisible={() => setIsWrongAddressModalVisible(false)} handleNavigation={handleWrongAddressSelectAnother} isSingleVendor={true} />
    </View>
  )
}

export default Checkout
