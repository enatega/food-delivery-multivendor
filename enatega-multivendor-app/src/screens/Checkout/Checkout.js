/* eslint-disable indent */
import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef
} from 'react'
import { MaterialIcons, Entypo, Feather, Ionicons } from '@expo/vector-icons'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Animated,
  Text
} from 'react-native'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'
import { getTipping, orderFragment } from '../../apollo/queries'
import { placeOrder } from '../../apollo/mutations'
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
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { textStyles } from '../../utils/textStyles'
import Pickup from '../../components/Pickup'
import { calculateDistance } from '../../utils/customFunctions'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import styles from './styles'
import Location from '../../components/Main/Location/Location'
import { customMapStyle } from '../../utils/customMapStyles'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'

// Constants
const PLACEORDER = gql`
  ${placeOrder}
`
const TIPPING = gql`
  ${getTipping}
`

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
    addQuantity,
    removeQuantity,
    deleteItem,
    updateCart
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { location } = useContext(LocationContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const modalRef = useRef(null)
  const [loadingData, setLoadingData] = useState(true)
  const [minimumOrder, setMinimumOrder] = useState('')
  const [isPickedUp, setIsPickedUp] = useState(false)
  const [orderDate, setOrderDate] = useState(moment())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const [deliveryCharges, setDeliveryCharges] = useState(0)
  const [restaurantName, setrestaurantName] = useState('...')

  const { loading, data } = useRestaurant(cartRestaurant)
  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0021
  }

  const { loading: loadingTip, data: dataTip } = useQuery(TIPPING, {
    fetchPolicy: 'network-only'
  })

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
      setIsModalOpen(true)
    }
  }

  const [mutateOrder, { loading: loadingOrderMutation }] = useMutation(
    PLACEORDER,
    {
      onCompleted,
      onError,
      update
    }
  )

  const COD_PAYMENT = {
    payment: 'COD',
    label: t('cod'),
    index: 2,
    icon: require('../../assets/images/cashIcon.png')
  }

  const paymentMethod =
    props.route.params && props.route.params.paymentMethod
      ? props.route.params.paymentMethod
      : COD_PAYMENT
  const coupon =
    props.route.params && props.route.params.coupon
      ? props.route.params.coupon
      : null

  const tip =
    props.route.params && props.route.params.tipAmount
      ? props.route.params.tipAmount
      : null

  const [selectedTip, setSelectedTip] = useState()
  const inset = useSafeAreaInsets()

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
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle('dark-content')
  })

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <TextDefault
            style={{
              color: currentTheme.btnText,
              ...textStyles.H4,
              ...textStyles.Bolder
            }}>
            {t('titleCheckout')}
          </TextDefault>
          <TextDefault
            style={{ color: currentTheme.btnText, ...textStyles.H5 }}>
            {data && data.restaurant.name}
            {' - '}
            {data && data.restaurant.address}
          </TextDefault>
        </View>
      ),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.btnText,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        backgroundColor: currentTheme.transparent
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View style={{ ...alignment.PLxSmall }}>
              <AntDesign
                name="arrowleft"
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
    if (paymentMethod.payment === 'COD') {
      await clearCart()
      props.navigation.reset({
        routes: [
          { name: 'Main' },
          {
            name: 'OrderDetail',
            params: { _id: data.placeOrder._id }
          }
        ]
      })
    } else if (paymentMethod.payment === 'PAYPAL') {
      console.log('here')
      props.navigation.replace('Paypal', {
        _id: data.placeOrder.orderId,
        currency: configuration.currency
      })
    } else if (paymentMethod.payment === 'STRIPE') {
      props.navigation.replace('StripeCheckout', {
        _id: data.placeOrder.orderId,
        amount: data.placeOrder.orderAmount,
        email: data.placeOrder.user.email,
        currency: configuration.currency
      })
    }
  }
  function onError(error) {
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
      const delivery = isPickedUp ? 0 : deliveryCharges
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
    const delivery = isPickedUp ? 0 : deliveryCharges
    const amount = +calculatePrice(delivery, true)
    const taxAmount = ((amount / 100) * tax).toFixed(2)
    return taxAmount
  }

  function calculatePrice(delivery = 0, withDiscount) {
    let itemTotal = 0
    cart.forEach(cartItem => {
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
    const delivery = isPickedUp ? 0 : deliveryCharges
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
      FlashMessage({
        // message: `The minimum amount of (${configuration.currencySymbol} ${minimumOrder}) for your order has not been reached.`
        message: `(${t(minAmount)}) (${configuration.currencySymbol
          } ${minimumOrder}) (${t(forYourOrder)})`
      })
      return false
    }
    if (!location._id) {
      props.navigation.navigate('CartAddress')
      return false
    }
    if (!paymentMethod) {
      FlashMessage({
        message: t('setPaymentMethod')
      })
      return false
    }
    if (profile.phone.length < 1) {
      props.navigation.navigate('Profile', { backScreen: 'Cart' })
      return false
    }
    if (profile.phone.length > 0 && !profile.phoneIsVerified) {
      FlashMessage({
        message: t('numberVerificationAlert')
      })
      props.navigation.navigate('Profile')
      return false
    }
    return true
  }

  function checkPaymentMethod(currency) {
    if (paymentMethod.payment === 'STRIPE') {
      return stripeCurrencies.find(val => val.currency === currency)
    }
    if (paymentMethod.payment === 'PAYPAL') {
      return paypalCurrencies.find(val => val.currency === currency)
    }
    return true
  }

  function transformOrder(cartData) {
    return cartData.map(food => {
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
          paymentMethod: paymentMethod.payment,
          couponCode: coupon ? coupon.title : null,
          tipping: +calculateTip(),
          taxationAmount: +taxCalculation(),
          orderDate: orderDate,
          isPickedUp: isPickedUp,
          deliveryCharges: isPickedUp ? 0 : deliveryCharges,
          address: {
            label: location.label,
            deliveryAddress: location.deliveryAddress,
            details: location.details,
            longitude: '' + location.longitude,
            latitude: '' + location.latitude
          }
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
      o => o.day === DAYS[day]
    )
    const times = todaysTimings.times.filter(
      t =>
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
    const foods = restaurant.categories.map(c => c.foods.flat()).flat()
    const { addons, options } = restaurant
    try {
      if (cartCount && cart) {
        const transformCart = cart.map(cartItem => {
          const food = foods.find(food => food._id === cartItem._id)
          if (!food) return null
          const variation = food.variations.find(
            variation => variation._id === cartItem.variation._id
          )
          if (!variation) return null

          const title = `${food.title}${variation.title ? `(${variation.title})` : ''
            }`
          let price = variation.price
          const optionsTitle = []
          if (cartItem.addons) {
            cartItem.addons.forEach(addon => {
              const cartAddon = addons.find(add => add._id === addon._id)
              if (!cartAddon) return null
              addon.options.forEach(option => {
                const cartOption = options.find(opt => opt._id === option._id)
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
          const updatedItems = transformCart.filter(item => item)
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
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>

        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height60} />
          <PlaceholderLine />
        </Placeholder>

        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
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
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
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
  return (
    <>
      <View style={styles(currentTheme).mainContainer}>
        {!cart.length && emptyCart()}
        {!!cart.length && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles().flex]}>
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
                      provider={PROVIDER_GOOGLE}></MapView>
                    <View style={styles().marker}>
                      <CustomMarker
                        width={40}
                        height={40}
                        transform={[{ translateY: -20 }]}
                        translateY={-20}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().width100,
                      styles().mB10
                    ]}
                  />
                </View>
                <View style={[styles(currentTheme).headerContainer]}>
                  <View style={styles().location}>
                    <Location
                      locationIconGray={{
                        backgroundColor: 'transparent',
                        width: 17
                      }}
                    />
                  </View>
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().width100,
                      styles().mB10
                    ]}
                  />
                  <View style={styles(currentTheme).deliveryTime}>
                    <View style={styles().clockIcon}>
                      <AntDesign
                        name="clockcircleo"
                        size={15}
                        color={currentTheme.fontFourthColor}
                      />
                    </View>
                    <TextDefault
                      textColor={props.black}
                      numberOfLines={1}
                      H5
                      bolder>
                      Within {data.restaurant.deliveryTime} -{' '}
                      {data?.restaurant.deliveryTime + 10} mins
                    </TextDefault>
                  </View>
                </View>
                <View style={styles().tipSec}>
                  <View style={[styles().tipRow]}>
                    <TextDefault
                      numberOfLines={1}
                      H5
                      bolder
                      textColor={currentTheme.fontNewColor}>
                      Add a Tip for Rider
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      normal
                      bolder
                      uppercase
                      textItalic
                      textColor={currentTheme.fontNewColor}>
                      optional
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
                            setSelectedTip(prevState =>
                              prevState === label ? null : label
                            )
                          }}>
                          <TextDefault
                            textColor={currentTheme.fontFourthColor}
                            normal
                            bolder
                            center>
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
                        onPress={() => {
                          props.navigation.navigate('Tip')
                        }}>
                        <TextDefault
                          textColor={currentTheme.fontFourthColor}
                          normal
                          bolder
                          center>
                          Others
                        </TextDefault>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* <View
                    numberOfLines={1}
                    style={[styles().floatText, styles().tipContainer]}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ ...alignment.PxSmall }}
                      onPress={() => {
                        setSelectedTip(null)
                        props.navigation.setParams({ tipAmount: null })
                      }}>
                      <TextDefault
                        small
                        bold
                        textColor={currentTheme.darkBgFont}>
                        {tip || selectedTip ? t('remove') : null}
                      </TextDefault>
                    </TouchableOpacity>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      large
                      bold>
                      {configuration.currencySymbol}{' '}
                      {parseFloat(calculateTip()).toFixed(2)}
                    </TextDefault>
                  </View> */}
                </View>

                {/* <View
                  style={[
                    styles(currentTheme).priceContainer,
                    styles().pT10,
                    styles().mB10,
                    styles().pB10
                  ]}>
                  <View style={styles(currentTheme).imageContainer}>
                    <View style={{ marginLeft: scale(10) }}>
                      <Image
                        resizeMode="cover"
                        source={require('../../assets/images/delivery.png')}
                      />
                    </View>
                    <View
                      style={{
                        marginLeft: scale(20)
                      }}>
                      <TextDefault
                        textColor={currentTheme.darkBgFont}
                        style={{ padding: 5 }}
                        bolder>
                        {isPickedUp ? t('pickUp') : t('delivery')}{' '}
                      </TextDefault>
                      <TextDefault
                        textColor={currentTheme.darkBgFont}
                        style={{ padding: 5 }}
                        bold>
                        {`${orderDate.format('MM-D-YYYY, h:mm a')}`}
                      </TextDefault>
                      <TouchableOpacity
                        onPress={onOpen}
                        style={styles(currentTheme).cartInnerContainer}>
                        <TextDefault bold textColor={'white'} center>
                          {t('change')}
                        </TextDefault>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View> */}

                <View style={styles().voucherSec}>
                  <TextDefault
                    numberOfLines={1}
                    H5
                    bolder
                    textColor={currentTheme.fontNewColor}>
                    Voucher
                  </TextDefault>

                  {!coupon ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                      <TextDefault
                        numberOfLines={1}
                        large
                        bolder
                        textColor={currentTheme.darkBgFont}>
                        {t('haveVoucher')}
                      </TextDefault>
                      <View style={styles(currentTheme).changeBtn}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            props.navigation.navigate('Coupon', {
                              coupon
                            })
                          }}>
                          <TextDefault
                            small
                            bold
                            textColor={currentTheme.darkBgFont}
                            center>
                            Add
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingTop: scale(8),
                          gap: scale(5)
                        }}>
                        <AntDesign
                          name="tags"
                          size={24}
                          color={currentTheme.main}
                        />
                        <View>
                          <TextDefault
                            numberOfLines={1}
                            tnormal
                            bold
                            textColor={currentTheme.fontFourthColor}>
                            {coupon ? coupon.title : null} applied
                          </TextDefault>
                          <TextDefault
                            small
                            bold
                            textColor={currentTheme.fontFourthColor}>
                            -{configuration.currencySymbol}
                            {parseFloat(
                              calculatePrice(0, false) - calculatePrice(0, true)
                            ).toFixed(2)}
                          </TextDefault>
                        </View>
                      </View>
                      <View style={styles(currentTheme).changeBtn}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            props.navigation.setParams({ coupon: null })
                          }}>
                          <TextDefault
                            small
                            bold
                            textColor={currentTheme.darkBgFont}
                            center>
                            {coupon ? t('remove') : null}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {isLoggedIn && profile && (
                  <>
                    <View style={styles().paymentSec}>
                      <TextDefault
                        numberOfLines={1}
                        H5
                        bolder
                        textColor={currentTheme.fontNewColor}>
                        Choose Payment Method
                      </TextDefault>
                      <View style={[styles(currentTheme).paymentSecInner]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: scale(18)
                          }}>
                          <View style={styles().currencyLogo}>
                            <Ionicons
                              name="logo-usd"
                              size={15}
                              color={currentTheme.fontFourthColor}
                            />
                          </View>
                          <TextDefault
                            textColor={currentTheme.fontFourthColor}
                            medium
                            bolder>
                            {paymentMethod.label}
                          </TextDefault>
                        </View>
                        <View style={styles(currentTheme).changeBtn}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              props.navigation.navigate('Payment', {
                                paymentMethod
                              })
                            }}>
                            <TextDefault
                              small
                              bold
                              textColor={currentTheme.darkBgFont}
                              center>
                              {t('change')}
                            </TextDefault>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </>
                )}

                <View style={[styles(currentTheme).priceContainer]}>
                  <TextDefault
                    numberOfLines={1}
                    H5
                    bolder
                    textColor={currentTheme.fontNewColor}
                    style={{ ...alignment.MBmedium }}>
                    Payment Summary
                  </TextDefault>
                  <View style={styles().billsec}>
                    <TextDefault
                      numberOfLines={1}
                      normal
                      bold
                      textColor={currentTheme.fontFourthColor}>
                      {t('subTotal')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold>
                      {configuration.currencySymbol}
                      {calculatePrice(0, false)}
                    </TextDefault>
                  </View>
                  <View style={styles(currentTheme).horizontalLine2} />

                  {!isPickedUp && (
                    <View style={styles().billsec}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontFourthColor}
                        normal
                        bold>
                        {t('deliveryFee')}
                      </TextDefault>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontFourthColor}
                        normal
                        bold>
                        {configuration.currencySymbol}
                        {deliveryCharges.toFixed(2)}
                      </TextDefault>
                    </View>
                  )}
                  <View style={styles(currentTheme).horizontalLine2} />

                  <View style={styles().billsec}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold>
                      {t('taxFee')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold>
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
                      bold>
                      Tip
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold>
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
                          bold>
                          Voucher Discount
                        </TextDefault>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.fontFourthColor}
                          normal
                          bold>
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
                      bolder>
                      {t('total')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontFourthColor}
                      normal
                      bold>
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
                  ]}>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    style={alignment.MBsmall}
                    small>
                    {t('condition1')}
                  </TextDefault>
                  <TextDefault
                    textColor={currentTheme.fontSecondColor}
                    style={alignment.MBsmall}
                    small
                    bold>
                    {t('condition2')}
                  </TextDefault>
                </View>
              </View>
            </ScrollView>
            {!isModalOpen && (
              <View style={styles(currentTheme).buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (validateOrder()) onPayment()
                  }}
                  style={styles(currentTheme).button}>
                  <TextDefault
                    textColor={currentTheme.fontFourthColor}
                    style={styles().checkoutBtn}
                    bold
                    H4>
                    {t('Place Order')}
                  </TextDefault>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        <Modalize
          ref={modalRef}
          modalStyle={styles(currentTheme).modal}
          modalHeight={Platform.OS === 'android' ? 280 : 420}
          overlayStyle={styles(currentTheme).overlay}
          handleStyle={styles(currentTheme).handle}
          handlePosition="inside"
          onClosed={() => {
            setIsModalOpen(false)
          }}
          onOpened={() => {
            setIsModalOpen(true)
          }}
          openAnimationConfig={{
            timing: { duration: 400 },
            spring: { speed: 20, bounciness: 10 }
          }}
          closeAnimationConfig={{
            timing: { duration: 400 },
            spring: { speed: 20, bounciness: 10 }
          }}>
          <Pickup
            minimumTime={new Date()}
            setOrderDate={setOrderDate}
            isPickedUp={isPickedUp}
            setIsPickedUp={setIsPickedUp}
            orderDate={orderDate}
          />
          <TouchableOpacity
            onPress={() => {
              modalRef.current.close()
            }}
            style={[
              {
                backgroundColor: currentTheme.buttonBackground,
                alignItems: 'center',
                height: scale(35),
                justifyContent: 'center',
                borderRadius: scale(10),
                width: '90%',
                alignSelf: 'center'
              }
            ]}>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>
              {t('apply')}
            </Text>
          </TouchableOpacity>
        </Modalize>
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Checkout
