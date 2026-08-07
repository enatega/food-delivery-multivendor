import React, { useState, useEffect, useContext, useLayoutEffect, useRef, useCallback, useMemo } from 'react'
import { View, ScrollView, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { AntDesign } from '@expo/vector-icons'
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
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { DAYS } from '../../utils/enums'
import { textStyles } from '../../utils/textStyles'
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
import { populateCart } from '../../utils/populateCart'
import { PrimaryButton, SkeletonBlock, StateView, useMultivendorTheme } from '../../ui/designSystem'

// Constants
const TIPPING = gql`
  ${getTipping}
`

function Cart(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  const { isLoggedIn, profile, restaurant: cartRestaurant, cart, addQuantity, removeQuantity, instructions, setInstructions } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const { tokens } = useMultivendorTheme()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }
  const [loadingData, setLoadingData] = useState(true)
  const [minimumOrder, setMinimumOrder] = useState('')

  const [orderDate, setOrderDate] = useState(new Date())
  const isCartEmpty = cart?.length === 0
  const cartLength = !isCartEmpty ? cart?.length : 0
  const { loading, data } = useRestaurant(cartRestaurant)
  const restaurant = data?.restaurant
  const foods = useMemo(() => restaurant?.categories?.flatMap((category) => category.foods) ?? [], [restaurant])
  const populatedCart = useMemo(() => populateCart(restaurant, cart), [cart, restaurant])
  const cartTotal = useMemo(() => populatedCart.reduce((total, item) => total + Number(item.price) * item.quantity, 0), [populatedCart])

  const { data: dataTip } = useQuery(TIPPING, {
    fetchPolicy: 'cache-first'
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

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar)
      }
      StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
    }, [currentTheme.menuBar, themeContext.ThemeValue])
  )

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      title: t('titleCart'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: tokens.colors.textPrimary,
        ...textStyles.H4,
        ...textStyles.Bolder
      },
      headerTitleContainerStyle: {
        paddingLeft: scale(25),
        paddingRight: scale(25)
      },
      headerStyle: {
        backgroundColor: tokens.colors.canvas
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
              <AntDesign name='arrowleft' size={22} color={tokens.colors.textPrimary} />
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

  function calculateTotal() {
    return cartTotal.toFixed(2)
  }

  const isBelowMinimumOrder = !!minimumOrder && Number(calculateTotal()) < Number(minimumOrder)

  function didFocus() {
    const { restaurant } = data
    setMinimumOrder(restaurant.minimumOrder)
    setLoadingData(false)
  }

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  function emptyCart() {
    return (
      <StateView
        visual={<EmptyCart width={scale(156)} height={scale(156)} />}
        title={`${t('hungry')}?`}
        description={t('emptyCart')}
        action={<PrimaryButton
          label={t('emptyCartBtn')}
          onPress={() =>
            props?.navigation.navigate({
              name: 'Main',
              merge: true
            })
          }
        />}
      />
    )
  }
  function loadginScreen() {
    return (
      <View style={styles(currentTheme).cartSkeleton}>
        <SkeletonBlock width='64%' height={18} />
        <SkeletonBlock width='100%' height={64} borderRadius={tokens.radii.lg} />
        <SkeletonBlock width='28%' height={20} style={{ marginTop: tokens.spacing.sm }} />
        {[0, 1].map((item) => (
          <View key={item} style={styles(currentTheme).cartSkeletonRow}>
            <SkeletonBlock width={64} height={64} borderRadius={tokens.radii.md} />
            <View style={styles(currentTheme).cartSkeletonLines}>
              <SkeletonBlock width='72%' height={14} />
              <SkeletonBlock width='48%' height={11} />
              <SkeletonBlock width='36%' height={14} />
            </View>
            <SkeletonBlock width={104} height={40} borderRadius={tokens.radii.round} />
          </View>
        ))}
      </View>
    )
  }
  const onModalOpen = (modalRef) => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }
  if (loading || loadingData) return loadginScreen()

  let deliveryTime = Math.floor((orderDate - Date.now()) / 1000 / 60)
  if (deliveryTime < 1) deliveryTime += restaurant?.deliveryTime
  return (
    <>
      <View style={styles(currentTheme).mainContainer}>
        {cart?.length === 0 ? (
          emptyCart()
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false} style={styles().flex} contentContainerStyle={styles(currentTheme).cartContent}>
              <View>
                <SpecialInstructions instructions={instructions} onSubmitInstructions={setInstructions} theme={currentTheme} t={t} />
              </View>
              <View>
                <View style={[styles(currentTheme).dealContainer, styles().mB10]}>
                  <TextDefault textColor={tokens.colors.textPrimary} style={styles().totalOrder} H5 bolder isRTL>
                    {t('yourOrder')} ({cartLength})
                  </TextDefault>
                  {populatedCart.map((food, index) => {
                    return (
                      <View key={food.key || food._id + index} style={[styles(currentTheme).itemContainer]}>
                        <CartItem
                          quantity={food.quantity}
                          dealName={food.title}
                          optionsTitle={food.optionsTitle}
                          itemImage={food.image}
                          food={food.food}
                          cartItem={food.cartItem}
                          itemAddons={food.addons}
                          dealPrice={(parseFloat(food.price) * food.quantity).toFixed(2)}
                          restaurantData={restaurant}
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
              {foods[0] && (
              <View style={styles(currentTheme).suggestedItems}>
                  <WouldYouLikeToAddThese itemId={foods[0]._id} restaurantId={restaurant?._id} />
                </View>
              )}
            </ScrollView>

            {isLoggedIn && profile && isBelowMinimumOrder && (
              <View style={styles(currentTheme).minOrderMessageContainer}>
                <View style={styles(currentTheme).minOrderMessagePill}>
                  <AntDesign name='exclamationcircleo' size={scale(12)} color={currentTheme.red600} />
                  <TextDefault textColor={currentTheme.red600} style={styles().minOrderMessageText} bold Small isRTL numberOfLines={2}>
                    {t('minOrderNotReached', {
                      minOrder: `${configuration.currencySymbol}${minimumOrder}`
                    })}
                  </TextDefault>
                </View>
              </View>
            )}
            <View style={styles(tokens).totalBillContainer}>
              <View style={styles({ ...currentTheme, ...tokens }).buttonContainer}>
                <View style={styles().cartAmount}>
                  <Animated.View style={[animatedStyle]}>
                    <TextDefault textColor={tokens.colors.textPrimary} style={styles().totalBill} bolder H2 isRTL>
                      {configuration.currencySymbol}
                      {calculateTotal()}
                    </TextDefault>
                  </Animated.View>

                  <TextDefault textColor={tokens.colors.textMuted} style={styles().totalBill} bolder Smaller isRTL>
                    {t('exclusiveVAt')}
                  </TextDefault>
                </View>
                {isLoggedIn && profile ? (
                  <PrimaryButton
                    label={t('checkoutBtn')}
                    disabled={isBelowMinimumOrder}
                    onPress={() => {
                      if (isBelowMinimumOrder) {
                        FlashMessage({
                          message: t('OrderPriceValidation')
                        })
                        return
                      }
                      navigation.navigate('Checkout')
                    }}
                    style={styles(tokens).checkoutAction}
                  />
                ) : (
                  <PrimaryButton
                    label={t('loginOrSignUp')}
                    onPress={() => {
                      props?.navigation.navigate({ name: 'CreateAccount' })
                    }}
                    style={styles(tokens).checkoutAction}
                  />
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
