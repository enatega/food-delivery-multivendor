/* eslint-disable indent */
import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef
} from 'react'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
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
import { AntDesign, EvilIcons } from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'
import CartItem from '../../components/CartItem/CartItem'
import { getTipping, orderFragment } from '../../apollo/queries'
import { placeOrder } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import { stripeCurrencies, paypalCurrencies } from '../../utils/currencies'
import { theme } from '../../utils/themeColors'

import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useRestaurant } from '../../ui/hooks'
import { LocationContext } from '../../context/Location'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
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

// Constants
const PLACEORDER = gql`
  ${placeOrder}
`
const TIPPING = gql`
  ${getTipping}
`

function Cart(props) {
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

  const { loading, data } = useRestaurant(cartRestaurant)

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
    ;(async () => {
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
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: t('titleCart'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginTop: '1%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        borderRadius: scale(10),
        backgroundColor: currentTheme.black,
        borderColor: currentTheme.white,
        borderWidth: 1,
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                marginLeft: 10,
                width: 55,
                alignItems: 'center'
              }}>
              <Entypo name="cross" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation])

  useEffect(() => {
    if (!data) return
    didFocus()
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
        message: `(${t(minAmount)}) (${
          configuration.currencySymbol
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

          const title = `${food.title}${
            variation.title ? `(${variation.title})` : ''
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

  function emptyCart() {
    return (
      <View style={styles().subContainerImage}>
        <View style={styles().imageContainer}>
          <EmptyCart width={scale(200)} height={scale(200)} />
        </View>
        <View style={styles().descriptionEmpty}>
          <TextDefault textColor={currentTheme.fontMainColor} bolder center>
            {t('hungry')}?
          </TextDefault>
          <TextDefault textColor={currentTheme.fontSecondColor} bold center>
            {t('emptyCart')}
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).emptyButton}
          onPress={() =>
            props.navigation.navigate({
              name: 'Main',
              merge: true
            })
          }>
          <TextDefault
            textColor={currentTheme.buttonText}
            bolder
            B700
            center
            uppercase>
            {t('emptyCartBtn')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    )
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

  function renderRightSwipe(progress, key) {
    const scaleX = progress.interpolate({
      inputRange: [0, 1, 3],
      outputRange: [100, 0, 0]
    })
    return (
      <Animated.View
        style={[
          styles().trashContainer,
          // { transform: [{ translateX: scaleX }] }
        ]}>
        <RectButton
          rippleColor="black"
          style={styles().trashIcon}
          onPress={() => deleteItem(key)}>
          <EvilIcons name="trash" size={scale(25)} color={currentTheme.white} />
        </RectButton>
      </Animated.View>
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
              <View style={[styles(currentTheme).headerContainer]}>
                <View
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
                </View>
              </View>
              <View
                style={{
                  ...alignment.PLsmall,
                  ...alignment.PRsmall,
                  marginTop: 10
                }}>
                <View
                  style={[
                    styles(currentTheme).dealContainer,
                    styles().pT10,
                    styles().mB10
                  ]}>
                  {cart.map((food, index) => (
                    <Swipeable
                      key={food.key}
                      renderRightActions={(progress, dragX) =>
                        renderRightSwipe(progress, food.key)
                      }>
                      <View
                        style={[
                          styles(currentTheme).itemContainer,
                          styles().pB5
                        ]}>
                        <CartItem
                          quantity={food.quantity}
                          dealName={food.title}
                          optionsTitle={food.optionsTitle}
                          dealPrice={(
                            parseFloat(food.price) * food.quantity
                          ).toFixed(2)}
                          addQuantity={() => {
                            addQuantity(food.key)
                          }}
                          removeQuantity={() => {
                            removeQuantity(food.key)
                          }}
                        />
                        {index !== cart.length - 1 && (
                          <View
                            style={[
                              styles(currentTheme).horizontalLine,
                              styles().pB10,
                              styles().width100,
                              styles().mB10
                            ]}
                          />
                        )}
                      </View>
                    </Swipeable>
                  ))}
                </View>
                <View
                  style={[
                    styles(currentTheme).priceContainer,
                    styles().pT10,
                    styles().mB10
                  ]}>
                  <View
                    style={[styles().floatView, styles().pB10, styles().pT10]}>
                    <TextDefault
                      numberOfLines={1}
                      large
                      bold
                      textColor={currentTheme.darkBgFont}
                      style={{ width: '30%' }}>
                      {t('subTotal')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontMainColor}
                      large
                      bold
                      style={{ width: '70%' }}
                      right>
                      {configuration.currencySymbol} {calculatePrice(0, false)}
                    </TextDefault>
                  </View>
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().width100,
                      styles().mB10
                    ]}
                  />

                  {!isPickedUp && (
                    <View style={[styles().floatView, styles().pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.darkBgFont}
                        large
                        bold
                        style={{ width: '30%' }}>
                        {t('deliveryFee')}
                      </TextDefault>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontMainColor}
                        style={{ width: '70%' }}
                        large
                        bold
                        right>
                        {configuration.currencySymbol}{' '}
                        {deliveryCharges.toFixed(2)}
                      </TextDefault>
                    </View>
                  )}
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().width100,
                      styles().mB10
                    ]}
                  />

                  <View style={[styles().floatView, styles().pB10]}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.darkBgFont}
                      large
                      bold
                      style={{ width: '30%' }}>
                      {t('taxFee')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '70%' }}
                      large
                      bold
                      right>
                      {configuration.currencySymbol} {taxCalculation()}
                    </TextDefault>
                  </View>
                  {!coupon ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[styles().pB10, styles().width100]}
                      onPress={() => {
                        props.navigation.navigate('Coupon', {
                          paymentMethod,
                          coupon
                        })
                      }}>
                      <TextDefault
                        numberOfLines={1}
                        large
                        bolder
                        textColor={currentTheme.darkBgFont}>
                        {t('haveVoucher')}
                      </TextDefault>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles().floatView, styles().pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontMainColor}
                        small
                        style={{ width: '30%' }}>
                        {coupon ? coupon.title : null}
                      </TextDefault>
                      <View
                        numberOfLines={1}
                        style={[
                          styles().floatText,
                          styles(currentTheme).floatRight,
                          styles().couponContainer
                        ]}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            props.navigation.setParams({ coupon: null })
                          }}>
                          <TextDefault
                            small
                            textColor={currentTheme.buttonBackgroundPink}>
                            {coupon ? t('remove') : null}
                          </TextDefault>
                        </TouchableOpacity>
                        <TextDefault
                          textColor={currentTheme.fontMainColor}
                          bold
                          large>
                          {configuration.currencySymbol}
                          {parseFloat(
                            calculatePrice(0, false) - calculatePrice(0, true)
                          ).toFixed(2)}
                        </TextDefault>
                      </View>
                    </View>
                  )}
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().pB5,
                      styles().width100,
                      styles().mB10
                    ]}
                  />

                  <View
                    style={[
                      styles().floatView,
                      styles().pB10,
                      styles().tipRow
                    ]}>
                    <TextDefault
                      numberOfLines={1}
                      large
                      bold
                      textColor={currentTheme.darkBgFont}
                      style={{ width: '30%' }}>
                      {t('tip')}
                    </TextDefault>
                    <View
                      numberOfLines={1}
                      style={[
                        styles().floatText,
                        styles(currentTheme).floatRight,
                        styles().tipContainer
                      ]}>
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
                    </View>
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
                            setSelectedTip(label)
                          }}>
                          <TextDefault
                            style={
                              selectedTip === label && {
                                ...textStyles.Bolder
                              }
                            }
                            textColor={
                              selectedTip === label
                                ? currentTheme.black
                                : currentTheme.darkBgFont
                            }
                            small
                            bold
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
                          style={
                            !!tip && {
                              ...textStyles.Bolder
                            }
                          }
                          textColor={
                            tip ? currentTheme.black : currentTheme.darkBgFont
                          }
                          small
                          bold
                          center>
                          {t('Custom')}
                        </TextDefault>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles(currentTheme).horizontalLine,
                      styles().pB10,
                      styles().width100,
                      styles().mB10
                    ]}
                  />
                  <View style={[styles().floatView, styles().pB10]}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '30%' }}
                      bolder>
                      {t('total')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '70%' }}
                      bolder
                      right>
                      {configuration.currencySymbol}
                      {calculateTotal()}
                    </TextDefault>
                  </View>
                </View>

                {isLoggedIn && profile && (
                  <>
                    <View
                      style={[
                        styles(currentTheme).dealContainer,
                        styles().pT10,
                        styles().mB10
                      ]}>
                      <View style={[styles().floatView, styles().pB10]}>
                        <MaterialIcons
                          style={{ marginRight: 10 }}
                          name="place"
                          size={24}
                          color={currentTheme.main}
                        />
                        <TextDefault
                          numberOfLines={1}
                          large
                          bolder
                          textColor={currentTheme.fontMainColor}>
                          {t('contactInfo')}
                        </TextDefault>
                      </View>
                      <View style={[styles().floatView, styles().pB10]}>
                        <TextDefault
                          numberOfLines={1}
                          small
                          bold
                          textColor={currentTheme.darkBgFont}
                          style={{ width: '30%' }}>
                          {t('email')}
                          {' :'}
                        </TextDefault>
                        <TextDefault
                          numberOfLines={1}
                          small
                          bold
                          textColor={currentTheme.darkBgFont}
                          style={{ width: '70%' }}
                          right>
                          {profile.email}
                        </TextDefault>
                      </View>
                      <View style={[styles().floatView, styles().pB10]}>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.darkBgFont}
                          small
                          bold
                          style={{ width: '30%' }}>
                          {t('phone')}
                          {' :'}
                        </TextDefault>
                        <TextDefault
                          numberOfLines={1}
                          textColor={currentTheme.darkBgFont}
                          small
                          bold
                          style={{ width: '70%' }}
                          right>
                          {profile.phone ? profile.phone : 'None'}
                        </TextDefault>
                      </View>
                      <View
                        style={[
                          styles(currentTheme).horizontalLine,
                          styles().width100,
                          styles().mB10
                        ]}
                      />
                      {isPickedUp ? (
                        <>
                          <View style={[styles().floatView, styles().pB10]}>
                            <TextDefault
                              numberOfLines={1}
                              textColor={currentTheme.darkBgFont}
                              small
                              bold
                              style={{ width: '30%' }}>
                              {t('titlePickUpDetails')}
                              {' :'}
                            </TextDefault>
                            <TextDefault
                              small
                              right
                              bold
                              textColor={currentTheme.darkBgFont}
                              style={{ width: '70%' }}>
                              {`${selectedRestaurant.address}`}
                            </TextDefault>
                          </View>
                          <View style={[styles().width100, styles().mB10]} />
                        </>
                      ) : (
                        <>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles().pB10}
                            onPress={event => {
                              if (!profile.addresses.length) {
                                props.navigation.navigate('NewAddress', {
                                  backScreen: 'Cart'
                                })
                              } else {
                                props.navigation.navigate('CartAddress', {
                                  address: location
                                })
                              }
                            }}>
                            <View style={[styles().floatView, styles().pB10]}>
                              <TextDefault
                                numberOfLines={1}
                                small
                                bold
                                textColor={currentTheme.darkBgFont}
                                style={{ width: '30%' }}>
                                {t('titleDeliveryDetails')} {' :'}
                              </TextDefault>
                              {location ? (
                                <View style={[styles().addressAllignment]}>
                                  <TextDefault
                                    small
                                    bold
                                    right
                                    style={{ width: '65%' }}
                                    textColor={
                                      currentTheme.darkBgFont
                                    }>{`${location.deliveryAddress}`}</TextDefault>
                                  <View style={[styles().addressDetailAllign]}>
                                    <TextDefault
                                      textColor={currentTheme.darkBgFont}>
                                      {' '}
                                      {location.details}
                                    </TextDefault>
                                  </View>
                                </View>
                              ) : (
                                <TextDefault
                                  small
                                  textColor={currentTheme.fontSecondColor}>
                                  {t('deliveryAddressmessage')}
                                </TextDefault>
                              )}
                            </View>
                          </TouchableOpacity>
                          <View style={styles().changeAddressContainer}>
                            <TouchableOpacity
                              activeOpacity={0.7}
                              style={styles(currentTheme).changeAddressBtn}
                              onPress={event => {
                                if (!profile.addresses.length) {
                                  props.navigation.navigate('NewAddress', {
                                    backScreen: 'Cart'
                                  })
                                } else {
                                  props.navigation.navigate('CartAddress', {
                                    address: location
                                  })
                                }
                              }}>
                              <TextDefault bolder small>
                                {' '}
                                {t('changeAddress')}
                              </TextDefault>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                      <View style={[styles().width100, styles().mB10]} />
                    </View>
                    <View
                      style={[
                        styles(currentTheme).dealContainer,
                        styles().pT10,
                        styles().mB10
                      ]}>
                      <View style={[styles().floatView, styles().mB10]}>
                        <MaterialIcons
                          style={{ marginRight: 10 }}
                          name="payment"
                          size={24}
                          color={currentTheme.main}
                        />
                        <TextDefault
                          large
                          bolder
                          textColor={currentTheme.fontMainColor}
                          style={{ width: '60%' }}>
                          {t('paymentMethod')}
                        </TextDefault>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[styles().width30]}
                          onPress={() => {
                            props.navigation.navigate('Payment', {
                              paymentMethod,
                              coupon
                            })
                          }}>
                          <TextDefault
                            small
                            bolder
                            textColor={currentTheme.darkBgFont}
                            right>
                            {t('change')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles().floatView,
                          styles().pB10,
                          styles().pT10
                        ]}
                        onPress={() => {
                          props.navigation.navigate('Payment', {
                            paymentMethod,
                            coupon
                          })
                        }}>
                        <View style={{ width: '10%' }}>
                          <Image
                            resizeMode="cover"
                            style={[
                              styles().iconStyle,
                              { ...alignment.MRxSmall }
                            ]}
                            source={paymentMethod.icon}
                          />
                        </View>
                        <TextDefault
                          textColor={currentTheme.darkBgFont}
                          medium
                          bolder
                          style={{ width: '45%' }}>
                          {paymentMethod.label}
                        </TextDefault>
                        <TextDefault
                          textColor={currentTheme.fontMainColor}
                          style={{ width: '45%' }}
                          large
                          bold
                          right>
                          {configuration.currencySymbol} {calculateTotal()}
                        </TextDefault>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
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
                {isLoggedIn && profile ? (
                  <TouchableOpacity
                    disabled={loadingOrderMutation}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (validateOrder()) onPayment()
                    }}
                    style={styles(currentTheme).button}>
                    {loadingOrderMutation ? (
                      <ActivityIndicator
                        size="large"
                        style={{ flex: 1, justifyContent: 'center' }}
                        color={currentTheme.buttonText}
                      />
                    ) : (
                      <>
                        <View style={styles().buttontLeft}>
                          <View style={styles(currentTheme).buttonLeftCircle}>
                            <TextDefault
                              bolder
                              center
                              textColor={currentTheme.white}
                              smaller>
                              {cartCount}
                            </TextDefault>
                          </View>
                        </View>
                        <TextDefault
                          textColor={currentTheme.black}
                          style={{ width: '30%' }}
                          bolder
                          B700
                          small
                          center
                          uppercase>
                          {t('orderBtn')}
                        </TextDefault>
                        <TextDefault
                          textColor={currentTheme.black}
                          style={{ width: '35%' }}
                          bold
                          small
                          right>
                          {configuration.currencySymbol}
                          {calculateTotal()}
                        </TextDefault>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      props.navigation.navigate({ name: 'CreateAccount' })
                    }}
                    style={styles(currentTheme).button}>
                    <TextDefault
                      textColor={currentTheme.black}
                      style={{ width: '100%' }}
                      H5
                      bolder
                      center
                      uppercase>
                      {t('loginOrCreateAccount')}
                    </TextDefault>
                  </TouchableOpacity>
                )}
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

export default Cart
