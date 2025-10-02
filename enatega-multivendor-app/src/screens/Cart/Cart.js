import React, { useState, useEffect, useContext, useLayoutEffect, useRef } from 'react'
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { AntDesign } from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import CartItem from '../../components/CartItem/CartItem'
import { getTipping } from '../../apollo/queries'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useRestaurant } from '../../ui/hooks'
import { LocationContext } from '../../context/Location'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { DAYS } from '../../utils/enums'
import { textStyles } from '../../utils/textStyles'
import { calculateAmount, calculateDistance } from '../../utils/customFunctions'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import WouldYouLikeToAddThese from './Section'
import { SpecialInstructions } from '../../components/Cart/SpecialInstructions'
import { isOpen } from '../../utils/customFunctions'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

// Constants
const TIPPING = gql`
  ${getTipping}
`

function Cart(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  const { isLoggedIn, profile, restaurant: cartRestaurant, cart, cartCount, addQuantity, removeQuantity, isPickup, setIsPickup, instructions, setInstructions, coupon } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { location } = useContext(LocationContext)
  const { t, i18n } = useTranslation()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const [loadingData, setLoadingData] = useState(true)
  const [minimumOrder, setMinimumOrder] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const [deliveryCharges, setDeliveryCharges] = useState(0)

  const [orderDate, setOrderDate] = useState(new Date())
  const isCartEmpty = cart?.length === 0
  const cartLength = !isCartEmpty ? cart?.length : 0
  const { loading, data } = useRestaurant(cartRestaurant)

  const { loading: loadingTip, data: dataTip } = useQuery(TIPPING, {
    fetchPolicy: 'network-only'
  })
  const animatedQuantity = useSharedValue(1)

  const animateQuantityChange = () => {
    animatedQuantity.value = withSpring(1.3, {
      damping: 2, // Adjust for desired bounciness
      stiffness: 20 // Adjust for desired spring effect
    })

    setTimeout(() => {
      animatedQuantity.value = withSpring(1) // Reset scale to 1
    }, 200) // Match this duration with the spring duration
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedQuantity.value }]
    }
  })

  useEffect(() => {
    animateQuantityChange()
  }, [addQuantity, removeQuantity])

  const tip = props?.route.params && props?.route.params.tipAmount ? props?.route.params.tipAmount : null

  const [selectedTip, setSelectedTip] = useState()
  const modalRef = useRef(null)

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
      if (data && data?.restaurant) {
        const latOrigin = Number(data?.restaurant.location.coordinates[1])
        const lonOrigin = Number(data?.restaurant.location.coordinates[0])
        const latDest = Number(location.latitude)
        const longDest = Number(location.longitude)
        const distance = await calculateDistance(latOrigin, lonOrigin, latDest, longDest)
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

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: t('titleCart'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingLeft: scale(25),
        paddingRight: scale(25)
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG
      },
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View
              style={{
                ...alignment.PLsmall,
                alignItems: 'center'
              }}
            >
              <AntDesign name='arrowleft' size={22} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props?.navigation])

  useLayoutEffect(() => {
    if (!data) return
    didFocus()
  }, [data])
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_CART)
    }
    Track()
  }, [])
  // useEffect(() => {
  //   if (cart && cartCount > 0) {
  //     if (
  //       data &&
  //       data?.restaurant &&
  //       (!data?.restaurant?.isAvailable || !isOpen(data?.restaurant))
  //     ) {
  //       showAvailablityMessage()
  //     }
  //   }
  // }, [data])

  const showAvailablityMessage = () => {
    Alert.alert(
      '',
      `${data?.restaurant.name} ${t('restaurantClosed')}`,
      [
        {
          text: t('backToRestaurants'),
          onPress: () => {
            props?.navigation.navigate({
              name: 'Main',
              merge: true
            })
          },
          style: 'cancel'
        },
        {
          text: isLoggedIn && profile ? t('continueBtn') : t('close'),
          onPress: () => {},
          style: 'cancel'
        }
      ],
      { cancelable: true }
    )
  }

  function calculatePrice(delivery = 0, withDiscount) {
    let itemTotal = 0
    cart.forEach((cartItem) => {
      const food = populateFood(cartItem)
      if (!food) return
      itemTotal += food.price * food.quantity
    })
    if (withDiscount && coupon && coupon.discount) {
      itemTotal = itemTotal - (coupon.discount / 100) * itemTotal
    }
    // const deliveryAmount = delivery > 0 ? deliveryCharges : 0
    return itemTotal.toFixed(2)
  }

  function calculateTotal() {
    let total = 0
    const delivery = isPickup ? 0 : deliveryCharges
    total += +calculatePrice(delivery)
    // total += +taxCalculation()
    // total += +calculateTip()
    return parseFloat(total).toFixed(2)
  }

  async function didFocus() {
    const { restaurant } = data
    setSelectedRestaurant(restaurant)
    setMinimumOrder(restaurant.minimumOrder)
    setLoadingData(false)
  }

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

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
            props?.navigation.navigate({
              name: 'Main',
              merge: true
            })
          }
        >
          <TextDefault textColor={currentTheme.buttonText} bolder B700 center uppercase>
            {t('emptyCartBtn')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    )
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
  const onModalOpen = (modalRef) => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }
  if (loading || loadingData || loadingTip) return loadginScreen()

  const restaurant = data?.restaurant
  const addons = restaurant?.addons
  const options = restaurant?.options

  const foods = restaurant?.categories?.map((c) => c.foods.flat()).flat()

  function populateFood(cartItem) {
    const food = foods?.find((food) => food._id === cartItem._id)
    if (!food) return null
    const variation = food.variations.find((variation) => variation._id === cartItem.variation._id)
    if (!variation) return null

    const title = `${food.title}${variation.title ? `(${variation.title})` : ''}`
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
    const populateAddons = addons.filter((addon) => food?.variations[0]?.addons?.includes(addon._id))
    return {
      ...cartItem,
      optionsTitle,
      title: title,
      price: price.toFixed(2),
      image: food.image,
      addons: populateAddons
    }
  }

  let deliveryTime = Math.floor((orderDate - Date.now()) / 1000 / 60)
  if (deliveryTime < 1) deliveryTime += restaurant?.deliveryTime
  return (
    <>
      <View style={styles(currentTheme).mainContainer}>
        {cart?.length === 0 ? (
          emptyCart()
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={[styles().flex, styles().cartItems]}>
              <View
                style={{
                  ...alignment.PLsmall,
                  ...alignment.PRsmall,
                  marginTop: 10
                }}
              >
                <SpecialInstructions instructions={instructions} onSubmitInstructions={setInstructions} theme={currentTheme} t={t} />
              </View>
              <View
                style={{
                  ...alignment.PLsmall,
                  ...alignment.PRsmall,
                  marginTop: 10
                }}
              >
                <View style={[styles(currentTheme).dealContainer, styles().mB10]}>
                  <TextDefault textColor={currentTheme.gray500} style={styles().totalOrder} H5 bolder isRTL>
                    {t('yourOrder')} ({cartLength})
                  </TextDefault>
                  {cart?.map((cartItem, index) => {
                    const food = populateFood(cartItem)
                    if (!food) return null
                    return (
                      <View key={cartItem._id + index} style={[styles(currentTheme).itemContainer]}>
                        <CartItem
                          quantity={food.quantity}
                          dealName={food.title}
                          optionsTitle={food.optionsTitle}
                          itemImage={food.image}
                          itemAddons={food.addons}
                          dealPrice={(parseFloat(food.price) * food.quantity).toFixed(2)}
                          addQuantity={() => {
                            addQuantity(food.key)
                          }}
                          removeQuantity={() => {
                            removeQuantity(food.key)
                          }}
                        />
                      </View>
                    )
                  })}
                </View>
              </View>
              <View style={styles().suggestedItems}>
                <WouldYouLikeToAddThese itemId={foods[0]._id} restaurantId={restaurant?._id} />
              </View>
            </ScrollView>

            <View style={styles().totalBillContainer}>
              <View style={styles(currentTheme).buttonContainer}>
                <View style={styles().cartAmount}>
                  <Animated.View style={[animatedStyle]}>
                    <TextDefault textColor={currentTheme.black} style={styles().totalBill} bolder H2 isRTL>
                      {configuration.currencySymbol}
                      {calculateTotal()}
                    </TextDefault>
                  </Animated.View>

                  <TextDefault textColor={currentTheme.black} style={styles().totalBill} bolder Smaller isRTL>
                    {t('exclusiveVAt')}
                  </TextDefault>
                </View>
                {isLoggedIn && profile ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      if (calculateTotal() < minimumOrder) {
                        FlashMessage({
                          message: t('OrderPriceValidation')
                        })
                        return
                      }
                      navigation.navigate('Checkout')
                    }}
                    style={styles(currentTheme).button}
                  >
                    <TextDefault textColor={currentTheme.white} style={styles().checkoutBtn} bold H5 isRTL>
                      {t('checkoutBtn')}
                    </TextDefault>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      props?.navigation.navigate({ name: 'CreateAccount' })
                    }}
                    style={styles(currentTheme).button}
                  >
                    <TextDefault textColor={currentTheme.white} style={{ width: '100%', textAlign: 'center' }} H5 bolder center isRTL>
                      {t('loginOrSignUp')}
                    </TextDefault>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </>
  )
}

export default Cart
