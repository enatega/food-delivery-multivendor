/* eslint-disable indent */
import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, Alert, TextInput, Dimensions } from 'react-native'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign, EvilIcons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { Modalize } from 'react-native-modalize'
import { getTipping, orderFragment } from '../../apollo/queries'
import { getCoupon, placeOrder } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import { stripeCurrencies, paypalCurrencies } from '../../utils/currencies'
import { theme } from '../../utils/themeColors'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'

import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useRestaurant } from '../../ui/hooks'
import { LocationContext } from '../../context/Location'
import { useFocusEffect } from '@react-navigation/native'
import { textStyles } from '../../utils/textStyles'
import { calculateAmount, calculateDistance } from '../../utils/customFunctions'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import styles from './styles'
import Location from '../../components/Main/Location/Location'
import { customMapStyle } from '../../utils/customMapStyles'
import Spinner from '../../components/Spinner/Spinner'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import { FulfillmentMode } from '../../components/Checkout/FulfillmentMode'
import { Instructions } from '../../components/Checkout/Instructions'
import PickUp from '../../components/Pickup'
import { PaymentModeOption } from '../../components/Checkout/PaymentOption'
import { isOpen } from '../../utils/customFunctions'
import { WrongAddressModal } from '../../components/Checkout/WrongAddressModal'
import { useCallback } from 'react'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

// Constants
const PLACEORDER = gql`
  ${placeOrder}
`
const TIPPING = gql`
  ${getTipping}
`
const GET_COUPON = gql`
  ${getCoupon}
`
const { height: HEIGHT } = Dimensions.get('window')

function Checkout(props) {
  const Analytics = analytics()
  useFocusEffect(
    useCallback(() => {
      // Alert.alert( "Server is currently unavailable. Please try again later.");
      console.log('Server is currently unavailable. Please try again later.')
    }, [])
  )

  const configuration = useContext(ConfigurationContext)
  const { isLoggedIn, profile, clearCart, restaurant: cartRestaurant, cart, cartCount, updateCart, isPickup, setIsPickup, instructions, coupon, setCoupon } = useContext(UserContext)

  const themeContext = useContext(ThemeContext)
  const { location } = useContext(LocationContext)
  const { t, i18n } = useTranslation()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const voucherModalRef = useRef(null)
  const tipModalRef = useRef(null)
  const [loadingData, setLoadingData] = useState(true)
  const [minimumOrder, setMinimumOrder] = useState('')
  const [orderDate, setOrderDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const [tax, setTax] = useState(0)
  const [deliveryCharges, setDeliveryCharges] = useState(0)
  const [restaurantName, setrestaurantName] = useState('...')
  const [voucherCode, setVoucherCode] = useState('')
  const [tip, setTip] = useState(null)
  const [tipAmount, setTipAmount] = useState('')
  const calenderModalRef = useRef(null)
  const [paymentMode, setPaymentMode] = useState('COD')

  const { loading, data } = useRestaurant(cartRestaurant)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const latOrigin = data?.restaurant?.location?.coordinates[1]
  const lonOrigin = data?.restaurant?.location?.coordinates[0]
  const initialRegion = {
    latitude: +latOrigin,
    longitude: +lonOrigin,
    latitudeDelta: 0.4,
    longitudeDelta: 0.5
  }
  const [isModalVisible, setisModalVisible] = useState(false)
  const [orderConfirmedTime, setOrderConfirmedTime] = useState(null)

  const restaurant = data?.restaurant

  const onModalOpen = (modalRef) => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  const onModalClose = (modalRef) => {
    const modal = modalRef.current
    if (modal) {
      modal.close()
    }
  }

  const handleCartNavigation = async () => {
    setisModalVisible(false)
    props?.navigation.navigate('CartAddress')
  }

  function onCouponCompleted(data) {
    if (data?.coupon) {
      if (data?.coupon.enabled) {
        setCoupon(data?.coupon)
        FlashMessage({
          message: t('coupanApply')
        })
        setVoucherCode('')
        onModalClose(voucherModalRef)
        setLoadingOrder(false)
      } else {
        FlashMessage({
          message: t('coupanFailed')
        })
        setLoadingOrder(false)
      }
    }
  }

  function onCouponError() {
    FlashMessage({
      message: t('invalidCoupan')
    })
    setLoadingOrder(false)
  }

  const [mutateCoupon, { loading: couponLoading }] = useMutation(GET_COUPON, {
    onCompleted: onCouponCompleted,
    onError: onCouponError
  })

  const { loading: loadingTip, data: dataTip } = useQuery(TIPPING, {
    fetchPolicy: 'no-cache'
  })

  const [mutateOrder, { loading: mutateOrderLoading }] = useMutation(PLACEORDER, {
    onCompleted,
    onError,
    update
  })

  const COD_PAYMENT = {
    payment: 'COD',
    label: t('cod'),
    index: 2,
    icon: 'dollar'
  }

  const paymentMethod = props?.route.params && props?.route.params.paymentMethod ? props?.route.params.paymentMethod : COD_PAYMENT

  const [selectedTip, setSelectedTip] = useState()
  const inset = useSafeAreaInsets()

  function onTipping() {
    if (isNaN(tipAmount)) FlashMessage({ message: t('invalidAmount') })
    else if (Number(tipAmount) <= 0) {
      FlashMessage({ message: t('amountMustBe') })
    } else {
      setTip(tipAmount)
      setTipAmount(null)
      onModalClose(tipModalRef)
    }
  }

  useEffect(() => {
    if (tip) {
      setSelectedTip(null)
    }
    // uncomment it if you want to select the tip by default
    // else if (dataTip && !selectedTip) {
    //   setSelectedTip(dataTip.tips.tipVariations[1])
    // }
  }, [tip, data])

  useEffect(() => {
    let isSubscribed = true
    ;(async () => {
      if (data && !!data?.restaurant) {
        const latOrigin = Number(data?.restaurant.location.coordinates[1])
        const lonOrigin = Number(data?.restaurant.location.coordinates[0])
        const latDest = Number(location.latitude)
        const longDest = Number(location.longitude)
        const distance = calculateDistance(latOrigin, lonOrigin, latDest, longDest)

        let costType = configuration.costType
        let amount = calculateAmount(costType, configuration.deliveryRate, distance)

        if (isSubscribed) {
          setDeliveryCharges(amount > 0 ? amount : configuration.deliveryRate)
        }
      }
    })()
    return () => {
      isSubscribed = false
    }
  }, [data, location])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useEffect(() => {
    props?.navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <TextDefault
            style={{
              color: currentTheme.newFontcolor,
              ...textStyles.H4,
              ...textStyles.Bolder
            }}
          >
            {t('titleCheckout')}
          </TextDefault>
          <TextDefault numberOfLines={1} style={{ color: currentTheme.newFontcolor, ...textStyles.H5 }}>
            {data && data?.restaurant.name && data?.restaurant.address && (
              <>
                {data?.restaurant.name} {' - '}
                {data.restaurant.address}
              </>
            )}
          </TextDefault>
        </View>
      ),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },

      headerStyle: {
        backgroundColor: currentTheme.newheaderBG
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLxSmall, width: scale(30) }}>
              <AntDesign name='arrowleft' size={22} color={currentTheme.fontFourthColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props?.navigation, data])

  useEffect(() => {
    if (!data) return
    didFocus()
    setrestaurantName(`${data?.restaurant.name} - ${data?.restaurant.address}`)
  }, [data])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CART)
    }
    Track()
  }, [])
  useEffect(() => {
    if (cart && cartCount > 0) {
      if (data && data?.restaurant && (!data?.restaurant?.isAvailable || !isOpen(data?.restaurant))) {
        showAvailablityMessage()
      }
    }
  }, [data])

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />
  const showAvailablityMessage = () => {
    Alert.alert(
      '',
      `${data?.restaurant.name} closed at the moment`,
      [
        {
          text: 'Go back to restaurants',
          onPress: () => {
            props?.navigation.navigate({
              name: 'Main',
              merge: true
            })
          },
          style: 'cancel'
        },
        {
          text: 'close',
          onPress: () => {},
          style: 'cancel'
        }
      ],
      { cancelable: true }
    )
  }

  function update(cache, { data: { placeOrder } }) {
    try {
      if (placeOrder && placeOrder.paymentMethod === 'COD') {
        cache.modify({
          fields: {
            orders(existingOrders = []) {
              const newOrder = cache.writeFragment({
                data: placeOrder,
                fragment: gql`
                  ${orderFragment}
                `
              })
              return [newOrder, ...existingOrders]
            }
          }
        })
      }
    } catch (error) {
      console.log('update error', error)
    }
  }

  async function onCompleted(data) {
    setOrderConfirmedTime(new Date())
    await Analytics.track(Analytics.events.ORDER_PLACED, {
      userId: data?.placeOrder.user._id,
      orderId: data?.placeOrder.orderId,
      name: data?.placeOrder.user.name,
      email: data?.placeOrder.user.email,
      restaurantName: data?.placeOrder.restaurant.name,
      restaurantAddress: data?.placeOrder.restaurant.address,
      orderPaymentMethod: data?.placeOrder.paymentMethod,
      orderItems: data?.placeOrder.items,
      orderAmount: data?.placeOrder.orderAmount,
      orderPaidAmount: data?.placeOrder.paidAmount,
      tipping: data?.placeOrder.tipping,
      orderStatus: data?.placeOrder.orderStatus,
      orderDate: data?.placeOrder.orderDate
    })
    if (paymentMode === 'COD') {
      props.navigation.reset({
        routes: [
          { name: 'Main' },
          {
            name: 'OrderDetail',
            params: {
              _id: data?.placeOrder?._id,
              order: data?.placeOrder
            }
          }
        ]
      })
      clearCart()
    } else if (paymentMode === 'PAYPAL') {
      props?.navigation.replace('Paypal', {
        _id: data?.placeOrder.orderId,
        currency: configuration.currency
      })
    } else if (paymentMode === 'STRIPE') {
      props?.navigation.replace('StripeCheckout', {
        _id: data?.placeOrder.orderId,
        amount: data?.placeOrder.orderAmount,
        email: data?.placeOrder.user.email,
        currency: configuration.currency
      })
    }
  }
  function onError(error) {
    setLoadingOrder(false)
    if (error.graphQLErrors.length) {
      if (error.graphQLErrors[0].message === "Sorry! we can't deliver to your address.") {
        setisModalVisible(true)
      }
    } else {
      FlashMessage({
        message: error.message
      })
    }
    if (error?.networkError) {
      // console.log(`Network Error: ${networkError.message}`);
      if (error?.networkError.statusCode === 502) {
        // FlashMessage({
        //   message: "Server is currently unavailable. Please try again later."
        // })
        console.log('Server is currently unavailable. Please try again later.')
      }
      if (error?.networkError.statusCode === 504) {
        FlashMessage({
          message: 'Request timed out. Please try again.'
        })
      }
    }
  }

  function calculateTip() {
    // if (paymentMode !== 'HYP') {
    //   return 0 // Return 0 if payment mode is not 'COD'
    // }
    if (isPickup) {
      return 0 // No tip for pickup orders since no rider is involved
    }
    if (tip) {
      return tip
    } else if (selectedTip) {
      return selectedTip
    } else {
      return 0
    }
  }

  function taxCalculation() {
    const tax = data?.restaurant ? +data?.restaurant.tax : 0
    if (tax === 0) {
      return tax.toFixed(2)
    }
    const delivery = isPickup ? 0 : deliveryCharges
    const amount = +calculatePrice(delivery, true)
    const taxAmount = ((amount / 100) * tax).toFixed(2)
    return taxAmount
  }

  function calculatePrice(delivery = 0, withDiscount) {
    let itemTotal = 0
    cart.forEach((cartItem) => {
      itemTotal += cartItem.price * cartItem.quantity
    })
    if (withDiscount && coupon && coupon.discount) {
      itemTotal = itemTotal - (coupon.discount / 100) * itemTotal
    }
    const deliveryAmount = delivery > 0 ? deliveryCharges : 0
    return (itemTotal + deliveryAmount).toFixed(2)
  }

  function calculateTotal() {
    let total = 0
    const delivery = isPickup ? 0 : deliveryCharges
    total += +calculatePrice(delivery, true)
    total += +taxCalculation()
    total += +calculateTip()
    return parseFloat(total).toFixed(2)
  }

  function validateOrder() {
    if (!data?.restaurant?.isAvailable || !isOpen(data?.restaurant)) {
      showAvailablityMessage()
      return
    }
    if (!cart.length) {
      FlashMessage({
        message: t('validateItems')
      })
      return false
    }
    if (calculatePrice(deliveryCharges, true) < minimumOrder) {
      FlashMessage({
        message: `The minimum amount of (${configuration.currencySymbol} ${minimumOrder}) for your order has not been reached.`
        // message: `(${t(minAmount)}) (${configuration.currencySymbol
        //   } ${minimumOrder}) (${t(forYourOrder)})`
      })
      return false
    }
    if (!isPickup && !location._id) {
      props?.navigation.navigate('CartAddress')
      return false
    }
    if (!paymentMode) {
      FlashMessage({
        message: t('setPaymentMethod')
      })
      return false
    }
    if (profile?.phone?.length < 1) {
      props?.navigation.navigate('PhoneNumber', { name: profile?.name, screen: 'Checkout' })
      return false
    }
    if (profile.phone.length > 0 && !profile.phoneIsVerified) {
      FlashMessage({
        message: t('numberVerificationAlert')
      })
      props?.navigation.navigate('PhoneNumber', { name: profile?.name, screen: 'Checkout' })
      return false
    }
    return true
  }

  function checkPaymentMethod(currency) {
    if (paymentMode === 'STRIPE') {
      return stripeCurrencies.find((val) => val.currency === currency)
    }
    if (paymentMode === 'PAYPAL') {
      return paypalCurrencies.find((val) => val.currency === currency)
    }
    return true
  }

  function transformOrder(cartData) {
    return cartData?.map((food) => {
      return {
        food: food?._id,
        quantity: food?.quantity,
        variation: food?.variation._id,
        addons: food?.addons
          ? food?.addons.map(({ _id, options }) => ({
              _id,
              options: options.map(({ _id }) => _id)
            }))
          : [],
        specialInstructions: food?.specialInstructions
      }
    })
  }
  async function onPayment() {
    try {
      if (checkPaymentMethod(configuration.currency)) {
        const items = transformOrder(cart)
        const orderVariables = {
          restaurant: cartRestaurant,
          orderInput: items,
          paymentMethod: paymentMode,
          couponCode: coupon ? coupon.title : null,
          tipping: +calculateTip(),
          taxationAmount: +taxCalculation(),
          orderDate: orderDate,
          isPickedUp: isPickup,
          deliveryCharges: isPickup ? 0 : deliveryCharges,
          instructions
        }

        if (isPickup) {
          // For pickup, use the location from context
          orderVariables.address = {
            label: 'Current Location',
            deliveryAddress: 'Pickup',
            details: 'User will pick up the order',
            longitude: '' + location.longitude,
            latitude: '' + location.latitude
          }
        } else {
          // For delivery, use the selected address
          orderVariables.address = {
            label: location.label,
            deliveryAddress: location.deliveryAddress,
            details: location.details,
            longitude: '' + location.longitude,
            latitude: '' + location.latitude
          }
        }

        await mutateOrder({ variables: orderVariables })
        setLoadingOrder(false)
        setIsPickup(false)
      } else {
        FlashMessage({
          message: t('paymentNotSupported')
        })
        setLoadingOrder(false)
      }
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  async function didFocus() {
    const { restaurant } = data
    setSelectedRestaurant(restaurant)
    setMinimumOrder(restaurant.minimumOrder)
    const foods = restaurant.categories.map((c) => c.foods.flat()).flat()
    const { addons, options } = restaurant
    try {
      if (cartCount && cart) {
        const transformCart = cart.map((cartItem) => {
          const food = foods.find((food) => food?._id === cartItem._id)
          if (!food) return null
          const variation = food?.variations.find((variation) => variation._id === cartItem.variation._id)
          if (!variation) return null

          const title = `${food?.title}${variation.title ? `(${variation.title})` : ''}`
          let price = variation.price
          const optionsTitle = []
          if (cartItem.addons) {
            cartItem.addons.forEach((addon) => {
              const cartAddon = addons.find((add) => add._id === addon._id)
              if (!cartAddon) return null
              addon.options.forEach((option) => {
                const cartOption = options.find((opt) => opt._id === option._id)
                if (!cartOption) return null
                price += cartOption.price
                optionsTitle.push(cartOption.title)
              })
            })
          }
          return {
            ...cartItem,
            optionsTitle,
            title: title,
            price: price.toFixed(2)
          }
        })

        if (props?.navigation.isFocused()) {
          const updatedItems = transformCart.filter((item) => item)
          if (updatedItems.length === 0) await clearCart()
          await updateCart(updatedItems)
          setLoadingData(false)
          if (transformCart.length !== updatedItems.length) {
            FlashMessage({
              message: t('itemNotAvailable')
            })
          }
        }
      } else {
        if (props?.navigation.isFocused()) {
          setLoadingData(false)
        }
      }
    } catch (e) {
      FlashMessage({
        message: e.message
      })
    }
  }

  function loadginScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>

        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height60} />
          <PlaceholderLine />
        </Placeholder>

        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height100} />
          <PlaceholderLine />
          <PlaceholderLine />
          <View style={[styles(currentTheme).horizontalLine, styles().width100, styles().mB10]} />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height100} />
          <PlaceholderLine />
          <PlaceholderLine />
          <View style={[styles(currentTheme).horizontalLine, styles().width100, styles().mB10]} />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }
  let deliveryTime = Math.floor((orderDate - Date.now()) / 1000 / 60)
  if (deliveryTime < 1) deliveryTime += restaurant?.deliveryTime
  if (loading || loadingData || loadingTip || mutateOrderLoading || loadingOrder) return loadginScreen()

  return (
    <>
      <View style={styles(currentTheme).mainContainer}>
        {!!cart.length && (
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={[styles().flex]}>
              <View>
                <View style={[styles(currentTheme).headerContainer]}>
                  <View style={styles().mapView}>
                    <MapView style={styles().flex} scrollEnabled={false} zoomEnabled={false} zoomControlEnabled={false} rotateEnabled={false} cacheEnabled={false} initialRegion={initialRegion} customMapStyle={customMapStyle} provider={PROVIDER_DEFAULT}></MapView>
                    <View style={styles().marker}>
                      <RestaurantMarker />
                    </View>
                  </View>
                  <View style={[styles(currentTheme).horizontalLine, styles().width100]} />
                </View>
                <FulfillmentMode theme={currentTheme} setIsPickup={setIsPickup} isPickup={isPickup} t={t} />
                <View style={[styles(currentTheme).headerContainer]}>
                  {!isPickup && (
                    <View style={alignment.PLsmall}>
                      <Location locationIcon={currentTheme.newIconColor} locationLabel={currentTheme.newFontcolor} location={currentTheme.newFontcolor} navigation={props?.navigation} addresses={profile?.addresses} forwardIcon={true} screenName={'checkout'} />
                    </View>
                  )}

                  <View style={[styles(currentTheme).horizontalLine, styles().width100]} />
                  <TouchableOpacity
                    onPress={() => {
                      onModalOpen(calenderModalRef)
                    }}
                    style={styles(currentTheme).deliveryTime}
                  >
                    <View style={[styles().iconContainer]}>
                      <View style={styles().icon}>
                        <EvilIcons name='calendar' size={scale(20)} />
                      </View>
                    </View>
                    <View style={styles(currentTheme).labelContainer}>
                      <View style={{ marginHorizontal: scale(5) }}>
                        {/* <TextDefault textColor={currentTheme.newFontcolor} numberOfLines={1} H5 bolder isRTL>                         
                          {t(isPickup ? 'pickUp' : 'delivery')} ({deliveryTime} {t('mins')})
                        </TextDefault> */}
                        {/* <TextDefault textColor={currentTheme.newFontcolor} numberOfLines={1} H5 bolder isRTL>
                          {orderConfirmedTime ? `${t(isPickup ? 'pickUp' : 'delivery')} (${deliveryTime} ${t('mins')})` : `${t(isPickup ? 'pickUp' : 'delivery')} (${restaurant?.deliveryTime} ${t('mins')})`}
                        </TextDefault> */}
                        <TextDefault textColor={currentTheme.newFontcolor} numberOfLines={1} H5 bolder isRTL>
                          {t(isPickup ? 'pickUp' : 'delivery')} {deliveryTime} {''}
                          {t('mins')}
                        </TextDefault>
                      </View>
                    </View>
                    <View style={[styles().iconContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                      <View style={[styles().icon, { backgroundColor: null }]}>
                        <Feather name={currentTheme?.isRTL ? 'chevron-left' : 'chevron-right'} size={20} color={currentTheme.secondaryText} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Instructions theme={currentTheme} title={'Instruction for the restaurant'} message={instructions} />
                </View>

                {isLoggedIn && profile && (
                  <>
                    <View style={styles().paymentSec}>
                      <TextDefault numberOfLines={1} H5 bolder textColor={currentTheme.fontNewColor} isRTL>
                        {t('titlePayment')}
                      </TextDefault>
                      <View>
                        <PaymentModeOption
                          title={t('cod')}
                          icon={'shekel'}
                          selected={paymentMode === 'COD'}
                          theme={currentTheme}
                          onSelect={() => {
                            setPaymentMode('COD')
                          }}
                        />
                        {/* <PaymentModeOption
                          title={t('paypal')}
                          icon={'credit-card'}
                          selected={paymentMode === 'PAYPAL'}
                          theme={currentTheme}
                          onSelect={() => {
                            setPaymentMode('PAYPAL')
                          }}
                        /> */}
                        {restaurant?.stripeDetailsSubmitted && (
                          <PaymentModeOption
                            title={t('Stripe')}
                            icon={'credit-card'}
                            selected={paymentMode === 'STRIPE'}
                            theme={currentTheme}
                            onSelect={() => {
                              setPaymentMode('STRIPE')
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </>
                )}
                <View style={[styles(currentTheme).horizontalLine2, { width: '92%', alignSelf: 'center' }]} />

                <View style={styles().voucherSec}>
                  {!coupon ? (
                    <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).voucherSecInner} onPress={() => onModalOpen(voucherModalRef)}>
                      <MaterialCommunityIcons name='ticket-confirmation-outline' size={24} color={currentTheme.lightBlue} />
                      <TextDefault H4 bolder textColor={currentTheme.lightBlue} center>
                        {t('applyVoucher')}
                      </TextDefault>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TextDefault numberOfLines={1} H5 bolder textColor={currentTheme.fontNewColor}>
                        Voucher
                      </TextDefault>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: scale(8),
                            gap: scale(5)
                          }}
                        >
                          <AntDesign name='tags' size={24} color={currentTheme.main} />
                          <View>
                            <TextDefault numberOfLines={1} tnormal bold textColor={currentTheme.fontFourthColor}>
                              {coupon ? coupon.title : null} applied
                            </TextDefault>
                            <TextDefault small bold textColor={currentTheme.fontFourthColor}>
                              -{configuration.currencySymbol}
                              {parseFloat(calculatePrice(0, false) - calculatePrice(0, true)).toFixed(2)}
                            </TextDefault>
                          </View>
                        </View>
                        <View style={styles(currentTheme).changeBtn}>
                          <TouchableOpacity activeOpacity={0.7} onPress={() => setCoupon(null)}>
                            <TextDefault small bold textColor={currentTheme.darkBgFont} center>
                              {coupon ? t('remove') : null}
                            </TextDefault>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
                {!isPickup && (
                  <View style={styles().tipSec}>
                    <View style={[styles(currentTheme).tipRow]}>
                      <TextDefault numberOfLines={1} H5 bolder textColor={currentTheme.fontNewColor}>
                        {t('AddTip')}
                      </TextDefault>
                      <TextDefault numberOfLines={1} normal bolder uppercase textItalic textColor={currentTheme.fontNewColor}>
                        {t('optional')}
                      </TextDefault>
                    </View>
                    {dataTip && (
                      <View style={styles(currentTheme).buttonInline}>
                        {dataTip.tips.tipVariations.map((label, index) => (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            key={index}
                            style={[selectedTip === label ? styles(currentTheme).activeLabel : styles(currentTheme).labelButton]}
                            onPress={() => {
                              props?.navigation.setParams({ tipAmount: null })
                              setTip(null)
                              setSelectedTip((prevState) => (prevState === label ? null : label))
                            }}
                          >
                            <TextDefault textColor={selectedTip === label ? currentTheme.black : currentTheme.fontFourthColor} normal bolder center>
                              {configuration.currencySymbol} {label}
                            </TextDefault>
                          </TouchableOpacity>
                        ))}
                        <TouchableOpacity activeOpacity={0.7} style={tip ? styles(currentTheme).activeLabel : styles(currentTheme).labelButton} onPress={() => onModalOpen(tipModalRef)}>
                          <TextDefault textColor={tip ? currentTheme.black : currentTheme.fontFourthColor} normal bolder center>
                            {t('Other')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                <View style={[styles(currentTheme).priceContainer]}>
                  <TextDefault numberOfLines={1} H5 bolder textColor={currentTheme.fontNewColor} style={{ ...alignment.MBmedium }} isRTL>
                    {t('paymentSummary')}
                  </TextDefault>
                  <View style={styles(currentTheme).billsec}>
                    <TextDefault numberOfLines={1} normal bold textColor={currentTheme.fontFourthColor}>
                      {t('subTotal')}
                    </TextDefault>
                    <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                      {configuration.currencySymbol}
                      {calculatePrice(0, false)}
                    </TextDefault>
                  </View>
                  <View style={styles(currentTheme).horizontalLine2} />

                  {!isPickup && (
                    <>
                      <View style={styles(currentTheme).billsec}>
                        <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                          {t('deliveryFee')}
                        </TextDefault>
                        <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                          {configuration.currencySymbol}
                          {deliveryCharges.toFixed(2)}
                        </TextDefault>
                      </View>
                      <View style={styles(currentTheme).horizontalLine2} />
                    </>
                  )}

                  <View style={styles(currentTheme).billsec}>
                    <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                      {t('taxFee')}
                    </TextDefault>
                    <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                      {configuration.currencySymbol}
                      {taxCalculation()}
                    </TextDefault>
                  </View>

                  {!isPickup && (
                    <>
                      <View style={styles(currentTheme).horizontalLine2} />
                      <View style={styles(currentTheme).billsec}>
                        <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                          {t('tip')}
                        </TextDefault>
                        <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                          {configuration.currencySymbol}
                          {parseFloat(calculateTip()).toFixed(2)}
                        </TextDefault>
                      </View>
                    </>
                  )}

                  {coupon && (
                    <View>
                      <View style={styles(currentTheme).horizontalLine2} />
                      <View style={styles(currentTheme).billsec}>
                        <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                          {t('voucherDiscount')}
                        </TextDefault>
                        <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                          -{configuration.currencySymbol}
                          {parseFloat(calculatePrice(0, false) - calculatePrice(0, true)).toFixed(2)}
                        </TextDefault>
                      </View>
                    </View>
                  )}
                  <View style={styles(currentTheme).horizontalLine2} />
                  <View style={styles(currentTheme).billsec}>
                    <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} H4 bolder>
                      {t('total')}
                    </TextDefault>
                    <TextDefault numberOfLines={1} textColor={currentTheme.fontFourthColor} normal bold>
                      {configuration.currencySymbol}
                      {calculateTotal()}
                    </TextDefault>
                  </View>
                </View>

                <View style={[styles(currentTheme).termsContainer, styles().pT10, styles().mB10]}>
                  <TextDefault textColor={currentTheme.fontMainColor} style={alignment.MBsmall} small isRTL>
                    {t('condition1')}
                  </TextDefault>
                  <TextDefault textColor={currentTheme.fontSecondColor} style={alignment.MBsmall} small bold isRTL>
                    {t('condition2')}
                  </TextDefault>
                </View>
              </View>
            </ScrollView>
            {!isModalOpen && (
              <View style={styles(currentTheme).buttonContainer}>
                <TouchableOpacity
                  disabled={loadingOrder}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (validateOrder()) {
                      setLoadingOrder(true)
                      onPayment()
                    }
                  }}
                  style={[styles(currentTheme).button, { opacity: loadingOrder ? 0.5 : 1 }]}
                >
                  {!loadingOrder && (
                    <TextDefault textColor={currentTheme.color4} style={styles().checkoutBtn} bold H4>
                      {t('placeOrder')}
                    </TextDefault>
                  )}
                  {loadingOrder && <Spinner backColor={'transparent'} />}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* Tip Modal */}
        <Modalize
          ref={tipModalRef}
          modalStyle={[styles(currentTheme).modal]}
          overlayStyle={styles(currentTheme).overlay}
          handleStyle={styles(currentTheme).handle}
          modalHeight={550}
          handlePosition='inside'
          openAnimationConfig={{
            timing: { duration: 400 },
            spring: { speed: 20, bounciness: 10 }
          }}
          closeAnimationConfig={{
            timing: { duration: 400 },
            spring: { speed: 20, bounciness: 10 }
          }}
        >
          <View style={styles().modalContainer}>
            <View style={styles(currentTheme).modalHeader}>
              <View activeOpacity={0.7} style={styles(currentTheme).modalheading}>
                <FontAwesome name={paymentMethod?.icon} size={20} color={currentTheme.newIconColor} />
                <TextDefault H4 bolder textColor={currentTheme.newFontcolor} center>
                  {t('AddTip')}
                </TextDefault>
              </View>
              <Feather name='x-circle' size={24} color={currentTheme.newIconColor} onPress={() => onModalClose(tipModalRef)} />
            </View>
            <View style={{ gap: 8 }}>
              <TextDefault uppercase bold textColor={currentTheme.gray500} isRTL>
                {t('enterAmount')}
              </TextDefault>
              <TextInput keyboardType='numeric' placeholder={'e.g. 25'} placeholderTextColor={currentTheme.inputPlaceHolder} value={tipAmount} onChangeText={(text) => setTipAmount(text)} style={styles(currentTheme).modalInput} />
            </View>
            <TouchableOpacity disabled={!tipAmount} activeOpacity={0.7} onPress={onTipping} style={[styles(currentTheme).button, { height: scale(40) }]}>
              <TextDefault textColor={currentTheme.black} style={styles().checkoutBtn} bold H4>
                {t('apply')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </Modalize>
        {/* Voucher Modal */}
        <Modalize
          ref={voucherModalRef}
          modalStyle={[styles(currentTheme).modal]}
          overlayStyle={styles(currentTheme).overlay}
          handleStyle={styles(currentTheme).handle}
          modalHeight={600}
          handlePosition='inside'
          openAnimationConfig={{
            timing: { duration: 400 },
            spring: { speed: 20, bounciness: 10 }
          }}
          closeAnimationConfig={{
            timing: { duration: 400 },
            spring: { speed: 20, bounciness: 10 }
          }}
        >
          <View style={styles().modalContainer}>
            <View style={styles(currentTheme).modalHeader}>
              <View activeOpacity={0.7} style={styles(currentTheme).modalheading}>
                <MaterialCommunityIcons name='ticket-confirmation-outline' size={24} color={currentTheme.newIconColor} />
                <TextDefault H4 bolder textColor={currentTheme.newFontcolor} center>
                  {t('applyVoucher')}
                </TextDefault>
              </View>
              <Feather name='x-circle' size={24} color={currentTheme.newIconColor} onPress={() => onModalClose(voucherModalRef)} />
            </View>
            <View style={{ gap: 8 }}>
              <TextDefault uppercase bold textColor={currentTheme.gray500} isRTL>
                {t('enterCode')}
              </TextDefault>
              <TextInput label={t('inputCode')} placeholder={t('inputCode')} placeholderTextColor={currentTheme.inputPlaceHolder} value={voucherCode} onChangeText={(text) => setVoucherCode(text)} style={styles(currentTheme).modalInput} />
            </View>
            <TouchableOpacity
              disabled={!voucherCode || couponLoading}
              activeOpacity={0.7}
              onPress={() => {
                mutateCoupon({ variables: { coupon: voucherCode } })
              }}
              style={[styles(currentTheme).button, !voucherCode && styles(currentTheme).buttonDisabled, { height: scale(40) }, { opacity: couponLoading ? 0.5 : 1 }]}
            >
              {!couponLoading && (
                <TextDefault textColor={currentTheme.black} style={styles().checkoutBtn} bold H4>
                  {t('apply')}
                </TextDefault>
              )}
              {couponLoading && <Spinner backColor={'transparent'} />}
            </TouchableOpacity>
          </View>
        </Modalize>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
      <Modalize
        ref={calenderModalRef}
        modalStyle={styles(currentTheme).modal}
        modalHeight={HEIGHT / 2}
        overlayStyle={styles(currentTheme).overlay}
        handleStyle={styles(currentTheme).handle}
        handlePosition='inside'
        openAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 20, bounciness: 10 }
        }}
        closeAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 20, bounciness: 10 }
        }}
      >
        <PickUp minimumTime={restaurant?.deliveryTime} setOrderDate={setOrderDate} isPickedUp={isPickup} setIsPickedUp={setIsPickup} orderDate={orderDate} pickupTextColor={currentTheme.newFontcolor} />
        <TouchableOpacity
          onPress={() => {
            calenderModalRef.current.close()
          }}
          style={styles(currentTheme).pickupButton}
        >
          <TextDefault textColor={currentTheme.fontMainColor} style={styles().checkoutBtn} bold H4>
            {t('apply')}
          </TextDefault>
        </TouchableOpacity>
      </Modalize>
      <WrongAddressModal theme={currentTheme} modalVisible={isModalVisible} setModalVisible={() => setisModalVisible(!isModalVisible)} handleNavigation={handleCartNavigation} />
    </>
  )
}

export default Checkout
