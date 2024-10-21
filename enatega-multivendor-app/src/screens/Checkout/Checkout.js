/* eslint-disable indent */
import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Text,
  TextInput,
  Dimensions
} from 'react-native'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Octicons
} from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'
import { getTipping, orderFragment } from '../../apollo/queries'
import { getCoupon, placeOrder } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import { stripeCurrencies, paypalCurrencies } from '../../utils/currencies'
import { theme } from '../../utils/themeColors'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'

import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useRestaurant } from '../../ui/hooks'
import { LocationContext } from '../../context/Location'
import { useFocusEffect } from '@react-navigation/native'
import { DAYS } from '../../utils/enums'
import { textStyles } from '../../utils/textStyles'
import { calculateDistance } from '../../utils/customFunctions'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import styles from './styles'
import Location from '../../components/Main/Location/Location'
import { customMapStyle } from '../../utils/customMapStyles'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import Spinner from '../../components/Spinner/Spinner'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import { fontStyles } from '../../utils/fontStyles'
import { FulfillmentMode } from '../../components/Checkout/FulfillmentMode'
import { Instructions } from '../../components/Checkout/Instructions'
import ArrowForwardIcon from '../../assets/SVG/arrow-forward-icon'
import PickUp from '../../components/Pickup'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import { PaymentModeOption } from '../../components/Checkout/PaymentOption'


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

  const configuration = useContext(ConfigurationContext)
  const {
    isLoggedIn,
    profile,
    clearCart,
    restaurant: cartRestaurant,
    cart,
    cartCount,
    updateCart,
    isPickup,
    setIsPickup,
    instructions
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { location } = useContext(LocationContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const voucherModalRef = useRef(null)
  const tipModalRef = useRef(null)
  const [loadingData, setLoadingData] = useState(true)
  const [minimumOrder, setMinimumOrder] = useState('')
  const [orderDate, setOrderDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const [deliveryCharges, setDeliveryCharges] = useState(0)
  const [restaurantName, setrestaurantName] = useState('...')
  const [voucherCode, setVoucherCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [tip, setTip] = useState(null)
  const [tipAmount, setTipAmount] = useState(null)
  const modalRef = useRef(null)
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

  function onCouponCompleted(data) {
    if (data?.coupon) {
      if (data?.coupon.enabled) {
        setCoupon(data?.coupon)
        FlashMessage({
          message: t('coupanApply')
        })
        setVoucherCode('')
        onModalClose(voucherModalRef)
      } else {
        FlashMessage({
          message: t('coupanFailed')
        })
      }
    }
  }

  function onCouponError() {
    FlashMessage({
      message: t('invalidCoupan')
    })
  }

  const [mutateCoupon, { loading: couponLoading }] = useMutation(GET_COUPON, {
    onCompleted: onCouponCompleted,
    onError: onCouponError
  })

  const { loading: loadingTip, data: dataTip } = useQuery(TIPPING, {
    fetchPolicy: 'network-only'
  })

  const [mutateOrder] = useMutation(PLACEORDER, {
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

  const paymentMethod =
    props.route.params && props.route.params.paymentMethod
      ? props.route.params.paymentMethod
      : COD_PAYMENT

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
    } else if (dataTip && !selectedTip) {
      setSelectedTip(dataTip.tips.tipVariations[1])
    }
  }, [tip, data])

  useEffect(() => {
    let isSubscribed = true
      ; (async () => {
        if (data && !!data.restaurant) {
          const latOrigin = Number(data.restaurant.location.coordinates[1])
          const lonOrigin = Number(data.restaurant.location.coordinates[0])
          const latDest = Number(location.latitude)
          const longDest = Number(location.longitude)
          const distance = await calculateDistance(
            latOrigin,
            lonOrigin,
            latDest,
            longDest
          )
          const amount = Math.ceil(distance) * configuration.deliveryRate
          isSubscribed &&
            setDeliveryCharges(amount > 0 ? amount : configuration.deliveryRate)
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
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useEffect(() => {
    props.navigation.setOptions({
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
          <TextDefault
            style={{ color: currentTheme.newFontcolor, ...textStyles.H5 }}
          >
            {data && data.restaurant.name && data.restaurant.address && (
              <>
                {data.restaurant.name} {' - '} {data.restaurant.address}
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
              <AntDesign
                name='arrowleft'
                size={22}
                color={currentTheme.fontFourthColor}
              />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation, data])

  useEffect(() => {
    if (!data) return
    didFocus()
    setrestaurantName(`${data.restaurant.name} - ${data.restaurant.address}`)
  }, [data])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CART)
    }
    Track()
  }, [])
  useEffect(() => {
    if (cart && cartCount > 0) {
      if (
        data &&
        data.restaurant &&
        (!data.restaurant.isAvailable || !isOpen())
      ) {
        showAvailablityMessage()
      }
    }
  }, [data])

  const showAvailablityMessage = () => {
    Alert.alert(
      '',
      `${data.restaurant.name} closed at the moment`,
      [
        {
          text: 'Go back to restaurants',
          onPress: () => {
            props.navigation.navigate({
              name: 'Main',
              merge: true
            })
          },
          style: 'cancel'
        },
        {
          text: 'Continue',
          onPress: () => { },
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
    await Analytics.track(Analytics.events.ORDER_PLACED, {
      userId: data.placeOrder.user._id,
      orderId: data.placeOrder.orderId,
      name: data.placeOrder.user.name,
      email: data.placeOrder.user.email,
      restaurantName: data.placeOrder.restaurant.name,
      restaurantAddress: data.placeOrder.restaurant.address,
      orderPaymentMethod: data.placeOrder.paymentMethod,
      orderItems: data.placeOrder.items,
      orderAmount: data.placeOrder.orderAmount,
      orderPaidAmount: data.placeOrder.paidAmount,
      tipping: data.placeOrder.tipping,
      orderStatus: data.placeOrder.orderStatus,
      orderDate: data.placeOrder.orderDate
    })
    if (paymentMode === 'COD') {
      props.navigation.reset({
        routes: [
          { name: 'Main' },
          {
            name: 'OrderDetail',
            params: { _id: data?.placeOrder?._id }
          }
        ]
      })
      clearCart()
    } else if (paymentMode === 'PAYPAL') {
      props.navigation.replace('Paypal', {
        _id: data.placeOrder.orderId,
        currency: configuration.currency
      })
    } else if (paymentMode === 'STRIPE') {
      props.navigation.replace('StripeCheckout', {
        _id: data.placeOrder.orderId,
        amount: data.placeOrder.orderAmount,
        email: data.placeOrder.user.email,
        currency: configuration.currency
      })
    }
  }
  function onError(error) {
    setLoadingOrder(false)
    console.log('onError', error)
    if (error.graphQLErrors.length) {
      console.log('error', JSON.stringify(error))
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } else {
      FlashMessage({
        message: error.message
      })
    }
  }

  function calculateTip() {
    if (tip) {
      return tip
    } else if (selectedTip) {
      let total = 0
      const delivery = isPickup ? 0 : deliveryCharges
      total += +calculatePrice(delivery, true)
      total += +taxCalculation()
      const tipPercentage = (
        (total / 100) *
        parseFloat(selectedTip).toFixed(2)
      ).toFixed(2)
      return tipPercentage
    } else {
      return 0
    }
  }

  function taxCalculation() {
    const tax = data.restaurant ? +data.restaurant.tax : 0
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
    if (!data.restaurant.isAvailable || !isOpen()) {
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
      // FlashMessage({
      //   // message: `The minimum amount of (${configuration.currencySymbol} ${minimumOrder}) for your order has not been reached.`
      //   message: `(${t(minAmount)}) (${configuration.currencySymbol
      //     } ${minimumOrder}) (${t(forYourOrder)})`
      // })
      return false
    }
    if (!location._id) {
      props.navigation.navigate('CartAddress')
      return false
    }
    if (!paymentMode) {
      FlashMessage({
        message: t('setPaymentMethod')
      })
      return false
    }
    if (profile.phone.length < 1) {
      props.navigation.navigate('PhoneNumber', { backScreen: 'Cart' })
      return false
    }
    if (profile.phone.length > 0 && !profile.phoneIsVerified) {
      FlashMessage({
        message: t('numberVerificationAlert') 
      })
      props.navigation.navigate('PhoneNumber')
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
    return cartData.map((food) => {
      return {
        food: food._id,
        quantity: food.quantity,
        variation: food.variation._id,
        addons: food.addons
          ? food.addons.map(({ _id, options }) => ({
            _id,
            options: options.map(({ _id }) => _id)
          }))
          : [],
        specialInstructions: food.specialInstructions
      }
    })
  }
  async function onPayment() {
    if (checkPaymentMethod(configuration.currency)) {
      const items = transformOrder(cart)
      mutateOrder({
        variables: {
          restaurant: cartRestaurant,
          orderInput: items,
          paymentMethod: paymentMode,
          couponCode: coupon ? coupon.title : null,
          tipping: +calculateTip(),
          taxationAmount: +taxCalculation(),
          orderDate: orderDate,
          isPickedUp: isPickup,
          deliveryCharges: isPickup ? 0 : deliveryCharges,
          address: {
            label: location.label,
            deliveryAddress: location.deliveryAddress,
            details: location.details,
            longitude: '' + location.longitude,
            latitude: '' + location.latitude
          },
          instructions
        }
      })
    } else {
      FlashMessage({
        message: t('paymentNotSupported')
      })
    }
  }

  const isOpen = () => {
    const date = new Date()
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const todaysTimings = data.restaurant.openingTimes.find(
      (o) => o.day === DAYS[day]
    )
    const times = todaysTimings.times.filter(
      (t) =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    )

    return times.length > 0
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
          const food = foods.find((food) => food._id === cartItem._id)
          if (!food) return null
          const variation = food.variations.find(
            (variation) => variation._id === cartItem.variation._id
          )
          if (!variation) return null

          const title = `${food.title}${variation.title ? `(${variation.title})` : ''
            }`
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

        if (props.navigation.isFocused()) {
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
        if (props.navigation.isFocused()) {
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
        <Placeholder
          Animation={(props) => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}
        >
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>

        <Placeholder
          Animation={(props) => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}
        >
          <PlaceholderLine style={styles().height60} />
          <PlaceholderLine />
        </Placeholder>

        <Placeholder
          Animation={(props) => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}
        >
          <PlaceholderLine style={styles().height100} />
          <PlaceholderLine />
          <PlaceholderLine />
          <View
            style={[
              styles(currentTheme).horizontalLine,
              styles().width100,
              styles().mB10
            ]}
          />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={(props) => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}
        >
          <PlaceholderLine style={styles().height100} />
          <PlaceholderLine />
          <PlaceholderLine />
          <View
            style={[
              styles(currentTheme).horizontalLine,
              styles().width100,
              styles().mB10
            ]}
          />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  if (loading || loadingData || loadingTip) return loadginScreen()

  let deliveryTime = Math.floor((orderDate - Date.now()) / 1000 / 60)
  if (deliveryTime < 1) deliveryTime += restaurant?.deliveryTime

  return (
    <>
      <View style={styles(currentTheme).mainContainer}>
        {!!cart.length && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles().flex]}
            >
              <View>
                <View style={[styles(currentTheme).headerContainer]}>
                  <View style={styles().mapView}>
                    <MapView
                      style={styles().flex}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      zoomControlEnabled={false}
                      rotateEnabled={false}
                      cacheEnabled={false}
                      initialRegion={initialRegion}
                      customMapStyle={customMapStyle}
                      provider={PROVIDER_GOOGLE}
                    ></MapView>
                    <View style={styles().marker}>
                      <RestaurantMarker />
                    </View>
                  </View>
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().width100,
                    ]}
                  />
                </View>
                <FulfillmentMode theme={currentTheme} setIsPickup={setIsPickup} isPickup={isPickup} />
                <View style={[styles(currentTheme).headerContainer]}>
                  <Location
                    locationIcon={currentTheme.newIconColor}
                    locationLabel={currentTheme.newFontcolor}
                    location={currentTheme.newFontcolor}
                    navigation={props.navigation}
                    addresses={profile.addresses}
                    forwardIcon={true}
                    screenName={'checkout'}
                  />

                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().width100
                    ]}
                  />
                  <TouchableOpacity onPress={() => { onModalOpen(modalRef) }} style={styles(currentTheme).deliveryTime}>
                    <View style={[styles().iconContainer]}>
                      <View style={styles().icon}>
                        <EvilIcons name='calendar' size={scale(20)} />
                      </View>
                    </View>
                    <View style={styles(currentTheme).labelContainer}>
                      <View style={{ marginLeft: scale(5) }}>
                        <TextDefault
                          textColor={currentTheme.newFontcolor}
                          numberOfLines={1}
                          H5
                          bolder
                        >
                          {t(isPickup ? 'pickUp' : 'delivery')}{' '}
                          ({deliveryTime} {t('mins')})
                        </TextDefault>
                      </View>
                    </View>
                    <View style={[styles().iconContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                      <View style={[styles().icon, { backgroundColor: null }]}>
                        <Feather
                          name='chevron-right'
                          size={20}
                          color={currentTheme.secondaryText}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                </View>
                <View>
                  <Instructions theme={currentTheme} title={'Instruction for the courier'} message={instructions} />
                </View>

                {isLoggedIn && profile && (
                  <>
                    <View style={styles().paymentSec}>
                      <TextDefault
                        numberOfLines={1}
                        H5
                        bolder
                        textColor={currentTheme.fontNewColor}
                      >
                        {t('titlePayment')}
                      </TextDefault>
                      <View>
                        <PaymentModeOption title={'Cash'} icon={'dollar'} selected={paymentMode === 'COD'} theme={currentTheme} onSelect={() => { setPaymentMode('COD') }} />
                        <PaymentModeOption title={'Card (Stripe)'} icon={'credit-card'} selected={paymentMode === 'STRIPE'} theme={currentTheme} onSelect={() => { setPaymentMode('STRIPE') }} />
                        <PaymentModeOption title={'Card (Paypal)'} icon={'credit-card'} selected={paymentMode === 'PAYPAL'} theme={currentTheme} onSelect={() => { setPaymentMode('PAYPAL') }} />
                      </View>
                    </View>
                  </>
                )}
                <View
                  style={[
                    styles(currentTheme).horizontalLine2,
                    { width: '92%', alignSelf: 'center' }
                  ]}
                />

                <View style={styles().voucherSec}>
                  {!coupon ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles().voucherSecInner}
                      onPress={() => onModalOpen(voucherModalRef)}
                    >
                      <MaterialCommunityIcons
                        name='ticket-confirmation-outline'
                        size={24}
                        color={currentTheme.lightBlue}
                      />
                      <TextDefault
                        H4
                        bolder
                        textColor={currentTheme.lightBlue}
                        center
                      >
                        {t('applyVoucher')}
                      </TextDefault>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TextDefault
                        numberOfLines={1}
                        H5
                        bolder
                        textColor={currentTheme.fontNewColor}
                      >
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
                          <AntDesign
                            name='tags'
                            size={24}
                            color={currentTheme.main}
                          />
                          <View>
                            <TextDefault
                              numberOfLines={1}
                              tnormal
                              bold
                              textColor={currentTheme.fontFourthColor}
                            >
                              {coupon ? coupon.title : null} applied
                            </TextDefault>
                            <TextDefault
                              small
                              bold
                              textColor={currentTheme.fontFourthColor}
                            >
                              -{configuration.currencySymbol}
                              {parseFloat(
                                calculatePrice(0, false) -
                                calculatePrice(0, true)
                              ).toFixed(2)}
                            </TextDefault>
                          </View>
                        </View>
                        <View style={styles(currentTheme).changeBtn}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setCoupon(null)}
                          >
                            <TextDefault
                              small
                              bold
                              textColor={currentTheme.darkBgFont}
                              center
                            >
                              {coupon ? t('remove') : null}
                            </TextDefault>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </View>
                <View style={styles().tipSec}>
                  <View style={[styles().tipRow]}>
                    <TextDefault
                      numberOfLines={1}
                      H5
                      bolder
                      textColor={currentTheme.fontNewColor}
                    >
                      {t('AddTip')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      normal
                      bolder
                      uppercase
                      textItalic
                      textColor={currentTheme.fontNewColor}
                    >
                      {t('optional')}
                    </TextDefault>
                  </View>
                  {dataTip && (
                    <View style={styles().buttonInline}>
                      {dataTip.tips.tipVariations.map((label, index) => (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          key={index}
                          style={[
                            selectedTip === label
                              ? styles(currentTheme).activeLabel
                              : styles(currentTheme).labelButton
                          ]}
                          onPress={() => {
                            props.navigation.setParams({ tipAmount: null })
                            setTip(null)
                            setSelectedTip((prevState) =>
                              prevState === label ? null : label
                            )
                          }}
                        >
                          <TextDefault
                            textColor={
                              selectedTip === label
                                ? currentTheme.black
                                : currentTheme.fontFourthColor
                            }
                            normal
                            bolder
                            center
                          >
                            {label}%
                          </TextDefault>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={
                          tip
                            ? styles(currentTheme).activeLabel
                            : styles(currentTheme).labelButton
                        }
                        onPress={() => onModalOpen(tipModalRef)}
                      >
                        <TextDefault
                          textColor={
                            tip
                              ? currentTheme.black
                              : currentTheme.fontFourthColor
                          }
                          normal
                          bolder
                          center
                        >
                          {t('Other')}
                        </TextDefault>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={[styles(currentTheme).priceContainer]}>
                  <TextDefault
                    numberOfLines={1}
                    H5
                    bolder
                    textColor={currentTheme.fontNewColor}
                    style={{ ...alignment.MBmedium }}
                  >
                    {t('paymentSummary')}
                  </TextDefault>
                  <View style={styles().billsec}>
                    <TextDefault
                      numberOfLines={1}
                      normal
                      bold
                      textColor={currentTheme.fontFourthColor}
                    >
                      {t('subTotal')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold
                    >
                      {configuration.currencySymbol}
                      {calculatePrice(0, false)}
                    </TextDefault>
                  </View>
                  <View style={styles(currentTheme).horizontalLine2} />

                  {!isPickup && (
                    <>
                      <View style={styles().billsec}>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.fontFourthColor}
                          normal
                          bold
                        >
                          {t('deliveryFee')}
                        </TextDefault>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.fontFourthColor}
                          normal
                          bold
                        >
                          {configuration.currencySymbol}
                          {deliveryCharges.toFixed(2)}
                        </TextDefault>
                      </View>
                      <View style={styles(currentTheme).horizontalLine2} />
                    </>
                  )}

                  <View style={styles().billsec}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold
                    >
                      {t('taxFee')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold
                    >
                      {configuration.currencySymbol}
                      {taxCalculation()}
                    </TextDefault>
                  </View>
                  <View style={styles(currentTheme).horizontalLine2} />
                  <View style={styles().billsec}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold
                    >
                      {t('tip')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold
                    >
                      {configuration.currencySymbol}
                      {parseFloat(calculateTip()).toFixed(2)}
                    </TextDefault>
                  </View>
                  {coupon && (
                    <View>
                      <View style={styles(currentTheme).horizontalLine2} />
                      <View style={styles().billsec}>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.fontFourthColor}
                          normal
                          bold
                        >
                          {t('voucherDiscount')}
                        </TextDefault>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.fontFourthColor}
                          normal
                          bold
                        >
                          -{configuration.currencySymbol}
                          {parseFloat(
                            calculatePrice(0, false) - calculatePrice(0, true)
                          ).toFixed(2)}
                        </TextDefault>
                      </View>
                    </View>
                  )}
                  <View style={styles(currentTheme).horizontalLine2} />
                  <View style={styles().billsec}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      H4
                      bolder
                    >
                      {t('total')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold
                    >
                      {configuration.currencySymbol}
                      {calculateTotal()}
                    </TextDefault>
                  </View>
                </View>

                <View
                  style={[
                    styles(currentTheme).termsContainer,
                    styles().pT10,
                    styles().mB10
                  ]}
                >
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    style={alignment.MBsmall}
                    small
                  >
                    {t('condition1')}
                  </TextDefault>
                  <TextDefault
                    textColor={currentTheme.fontSecondColor}
                    style={alignment.MBsmall}
                    small
                    bold
                  >
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
                  style={[
                    styles(currentTheme).button,
                    { opacity: loadingOrder ? 0.5 : 1 }
                  ]}
                >
                  {!loadingOrder && (
                    <TextDefault
                      textColor={currentTheme.color4}
                      style={styles().checkoutBtn}
                      bold
                      H4
                    >
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
            <View style={styles().modalHeader}>
              <View activeOpacity={0.7} style={styles().modalheading}>
                <FontAwesome
                  name={paymentMethod?.icon}
                  size={20}
                  color={currentTheme.newIconColor}
                />
                <TextDefault
                  H4
                  bolder
                  textColor={currentTheme.newFontcolor}
                  center
                >
                  {t('AddTip')}
                </TextDefault>
              </View>
              <Feather
                name='x-circle'
                size={24}
                color={currentTheme.newIconColor}
                onPress={() => onModalClose(tipModalRef)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <TextDefault uppercase bold textColor={currentTheme.gray500}>
                {t('enterCode')}
              </TextDefault>
              <TextInput
                keyboardType='numeric'
                placeholder={t('enterAmount')}
                value={tipAmount}
                onChangeText={(text) => setTipAmount(text)}
                style={styles(currentTheme).modalInput}
              />
            </View>
            <TouchableOpacity
              disabled={!tipAmount}
              activeOpacity={0.7}
              onPress={onTipping}
              style={[styles(currentTheme).button, { height: scale(40) }]}
            >
              <TextDefault
                textColor={currentTheme.black}
                style={styles().checkoutBtn}
                bold
                H4
              >
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
            <View style={styles().modalHeader}>
              <View activeOpacity={0.7} style={styles().modalheading}>
                <MaterialCommunityIcons
                  name='ticket-confirmation-outline'
                  size={24}
                  color={currentTheme.newIconColor}
                />
                <TextDefault
                  H4
                  bolder
                  textColor={currentTheme.newFontcolor}
                  center
                >
                  {t('applyVoucher')}
                </TextDefault>
              </View>
              <Feather
                name='x-circle'
                size={24}
                color={currentTheme.newIconColor}
                onPress={() => onModalClose(voucherModalRef)}
              />
            </View>
            <View style={{ gap: 8 }}>
              <TextDefault uppercase bold textColor={currentTheme.gray500}>
                {t('enterCode')}
              </TextDefault>
              <TextInput
                label={t('inputCode')}
                placeholder={t('inputCode')}
                value={voucherCode}
                onChangeText={(text) => setVoucherCode(text)}
                style={styles(currentTheme).modalInput}
              />
            </View>
            <TouchableOpacity
              disabled={!voucherCode || couponLoading}
              activeOpacity={0.7}
              onPress={() => {
                mutateCoupon({ variables: { coupon: voucherCode } })
              }}
              style={[
                styles(currentTheme).button,
                !voucherCode && styles(currentTheme).buttonDisabled,
                { height: scale(40) },
                { opacity: couponLoading ? 0.5 : 1 }
              ]}
            >
              {!couponLoading && (
                <TextDefault
                  textColor={currentTheme.black}
                  style={styles().checkoutBtn}
                  bold
                  H4
                >
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
        ref={modalRef}
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
        <PickUp
          minimumTime={restaurant?.deliveryTime}
          setOrderDate={setOrderDate}
          isPickedUp={isPickup}
          setIsPickedUp={setIsPickup}
          orderDate={orderDate}
          pickupTextColor={currentTheme.newFontcolor}
        />
        <TouchableOpacity
          onPress={() => {
            modalRef.current.close()
          }}
          style={styles(currentTheme).pickupButton}
        >
          <Text style={styles(currentTheme).applyButton}>{t('apply')}</Text>
        </TouchableOpacity>
      </Modalize>
    </>
  )
}

export default Checkout
