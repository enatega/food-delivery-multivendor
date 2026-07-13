import { View, Alert, StatusBar, Platform, Dimensions, KeyboardAvoidingView } from 'react-native'
import styles from './styles'
import RadioComponent from '../../components/CustomizeComponents/RadioComponent/RadioComponent'
import TitleComponent from '../../components/CustomizeComponents/TitleComponent/TitleComponent'
import CartComponent from '../../components/CustomizeComponents/CartComponent/CartComponent'
import HeadingComponent from '../../components/CustomizeComponents/HeadingComponent/HeadingComponent'
import ImageHeader from '../../components/CustomizeComponents/ImageHeader/ImageHeader'
import FrequentlyBoughtTogether from '../../components/ItemDetail/Section'
import Options from './Options'
import { theme } from '../../utils/themeColors'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import UserContext from '../../context/User'
import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

// Hooks
import React, { useState, useContext, useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, useAnimatedRef } from 'react-native-reanimated'
import { IconButton } from 'react-native-paper'
import { Text } from 'react-native'
import { scale } from '../../utils/scaling'
import { TextField } from 'react-native-material-textfield'

// Utils
import { truncateText } from '../../utils/customFunctions'

const { height } = Dimensions.get('window')
const TOP_BAR_HEIGHT = Math.round(height * 0.08)
const HEADER_MAX_HEIGHT = Math.round(height * 0.4)
const HEADER_MIN_HEIGHT = TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT

function ItemDetail(props) {
  const { food, addons, options, restaurant } = props?.route?.params

  // States
  const [listZindex, setListZindex] = useState(0)
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState({
    ...food?.variations[0],
    addons: food?.variations[0].addons?.map((fa) => {
      const addon = addons?.find((a) => a._id === fa)
      const addonOptions = addon?.options?.map((ao) => {
        return options?.find((o) => o._id === ao)
      })
      return {
        ...addon,
        options: addonOptions
      }
    })
  })
  const [selectedAddons, setSelectedAddons] = useState([])
  const [specialInstructions, setSpecialInstructions] = useState('')

  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const Analytics = analytics()
  const { restaurant: restaurantCart, setCartRestaurant, cart, addQuantity, addCartItem } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const inset = useSafeAreaInsets()
  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  const scrollViewRef = useAnimatedRef()
  const addonRefs = useRef({})
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    }
  })
  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [SCROLL_RANGE - 10, SCROLL_RANGE], [0, 1], Extrapolation.CLAMP)
    return {
      opacity,
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, SCROLL_RANGE], [HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 0], Extrapolation.CLAMP)
        }
      ]
    }
  })

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  useEffect(() => {
    async function Track() {
      try {
        await Analytics.track(Analytics.events.OPENED_RESTAURANT_ITEM, {
          restaurantID: restaurant,
          foodID: food?._id,
          foodName: food?.title,
          foodRestaurantName: food?.restaurantName
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }
    Track()
  })
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      title: truncateText(20, food?.restaurantName),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG
      },
      headerTitleStyle: {
        color: currentTheme.newFontcolor
      },
      headerShadowVisible: false,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={styles(currentTheme).backBtnContainer}>
              <MaterialIcons name='arrow-back' size={25} color={currentTheme.newIconColor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])

  function scrollToError(addonId, totalAddons) {
    setTimeout(() => {
      if (addonRefs.current[addonId] && scrollViewRef.current && totalAddons > 0) {
        addonRefs.current[addonId].measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current.scrollTo({
            // Solution: Round the final value to an integer
            y: Math.round(Math.max(0, pageY - HEADER_MAX_HEIGHT)),
            animated: true
          })
        })
      }
    }, 300)
  }
  function validateButton() {
    if (!selectedVariation) return false
    const validatedAddons = []
    selectedVariation?.addons?.forEach((addon) => {
      const selected = selectedAddons?.find((ad) => ad._id === addon._id)
      if (!selected && addon?.quantityMinimum === 0) {
        validatedAddons.push(false)
      } else if (selected && selected?.options?.length >= addon?.quantityMinimum && selected?.options?.length <= addon?.quantityMaximum) {
        validatedAddons.push(false)
      } else validatedAddons.push(true)
    })
    return validatedAddons.every((val) => val === false)
  }

  async function onPressAddToCart(quantity) {
    const isValidOrder = validateOrderItem()
    if (isValidOrder) {
      Analytics.track(Analytics.events.ADD_TO_CART, {
        title: food?.title,
        restaurantName: food?.restaurantName,
        variations: food?.variations
      })
      if (!restaurantCart || restaurant === restaurantCart) {
        await addToCart(quantity, restaurant !== restaurantCart)
      } else if (food?.restaurant !== restaurantCart) {
        Alert.alert(
          '',
          t('cartClearWarning'),
          [
            {
              text: t('Cancel'),
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: t('okText'),
              onPress: async () => {
                await addToCart(quantity, true)
              }
            }
          ],
          { cancelable: false }
        )
      }
    }
  }

  // Add to cart
  const addToCart = async (quantity, clearFlag) => {
    const addons = selectedAddons.map((addon) => ({
      ...addon,
      options: addon?.options?.map(({ _id }) => ({
        _id
      }))
    }))

    const cartItem = clearFlag
      ? null
      : cart.find((cartItem) => {
          if (cartItem?._id === food?._id && cartItem?.variation?._id === selectedVariation?._id) {
            if (cartItem?.addons?.length === addons?.length) {
              if (addons?.length === 0) return true
              const addonsResult = addons?.every((newAddon) => {
                const cartAddon = cartItem.addons?.find((ad) => ad._id === newAddon._id)

                if (!cartAddon) return false
                const optionsResult = newAddon?.options?.every((newOption) => {
                  const cartOption = cartAddon?.options?.find((op) => op._id === newOption._id)

                  if (!cartOption) return false
                  return true
                })

                return optionsResult
              })

              return addonsResult
            }
          }
          return false
        })

    if (!cartItem) {
      await setCartRestaurant(restaurant)
      await addCartItem(food?._id, selectedVariation?._id, quantity, addons, clearFlag, specialInstructions)
    } else {
      await addQuantity(cartItem?.key, quantity)
    }
    navigation.goBack()
  }

  const onSelectVariation = (variation) => {
    if (variation?._id) {
      setSelectedVariation({
        ...variation,
        addons: variation?.addons?.map((fa) => {
          const addon = addons?.find((a) => a._id === fa)
          const addonOptions = addon?.options?.map((ao) => {
            return options?.find((o) => o._id === ao)
          })
          return {
            ...addon,
            options: addonOptions
          }
        })
      })
    }
  }

  async function onSelectOption(addon, option) {
    const index = selectedAddons?.findIndex((ad) => ad._id === addon._id)
    if (index > -1) {
      if (addon?.quantityMinimum === 1 && addon?.quantityMaximum === 1) {
        selectedAddons[index].options = [option]
      } else {
        const optionIndex = selectedAddons[index].options?.findIndex((opt) => opt._id === option._id)
        if (optionIndex > -1) {
          selectedAddons[index].options = selectedAddons[index].options?.filter((opt) => opt._id !== option._id)
        } else {
          selectedAddons[index].options?.push(option)
        }
        if (!selectedAddons[index].options?.length) {
          selectedAddons.splice(index, 1)
        }
      }
    } else {
      selectedAddons.push({ _id: addon._id, options: [option] })
    }
    setSelectedAddons([...selectedAddons])
  }

  const calculatePrice = useCallback(() => {
    const variation = selectedVariation.price
    let addons = 0
    selectedAddons.forEach((addon) => {
      addons += addon?.options?.reduce((acc, option) => {
        return acc + option?.price
      }, 0)
    })
    return (variation + addons).toFixed(2)
  }, [selectedVariation, addons,selectedAddons])

  const calculateDiscountedPrice = useCallback(() => {
    const variation = selectedVariation.discounted
    let addons = 0
    selectedAddons.forEach((addon) => {
      addons += addon?.options?.reduce((acc, option) => {
        return acc + option?.price
      }, 0)
    })
    return (variation + addons).toFixed(2)
  }, [selectedVariation, addons])

  function validateOrderItem() {
    let hasError = false
    const validatedAddons = selectedVariation?.addons?.map((addon) => {
      const selected = selectedAddons?.find((ad) => ad._id === addon._id)

      if (!selected && addon?.quantityMinimum === 0) {
        addon.error = false
      } else if (selected && selected?.options?.length >= addon?.quantityMinimum && selected?.options?.length <= addon?.quantityMaximum) {
        addon.error = false
      } else {
        addon.error = true
        if (!hasError) {
          hasError = true
          scrollToError(addon._id, selectedVariation?.addons?.length)
        }
      }
      return addon
    })
    setSelectedVariation({ ...selectedVariation, addons: validatedAddons })
    return !hasError
  }

  if (!connect) return <ErrorView />
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={scrollHandler}
          style={[styles(currentTheme).scrollViewStyle, { zIndex: listZindex }]}
          scrollEventThrottle={1}
          onScrollEndDrag={(e) => {
            if (e?.nativeEvent?.contentOffset?.y >= 70) {
              setListZindex(4)
              calculatePrice()
            } else {
              setListZindex(1)
              calculatePrice()
            }
          }}
          onMomentumScrollEnd={(e) => {
            if (e?.nativeEvent?.contentOffset?.y >= 70) {
              setListZindex(4)
              calculatePrice()
            } else {
              setListZindex(1)
              calculatePrice()
            }
          }}
          contentContainerStyle={{
            // paddingTop: HEADER_MAX_HEIGHT,
            paddingBottom: scale(Math.round(height * 0.09))
          }}
        >
          <View>
            {food?.image ? <ImageHeader image={food?.image} /> : <Text>No image to display</Text>}
            <Text
              style={[
                styles(currentTheme).descriptionText,
                {
                  width: '90%',
                  height: 'auto',
                  fontSize: 14,
                  alignSelf: 'center'
                }
              ]}
            >
              {food?.description}
            </Text>
            <HeadingComponent title={food?.title} price={calculatePrice()} discountedPrice={calculateDiscountedPrice()} />
          </View>
          <View style={[styles(currentTheme).subContainer]}>
            <View>
              {food?.variations?.length > 1 && (
                <View key={"1223323"}>
                  <TitleComponent title={t('SelectVariation')} subTitle={t('SelectOne')} status={t('Required')} />
                  <RadioComponent
                    options={food?.variations}
                    selected={selectedVariation}
                    onPress={(e) => {
                      onSelectVariation(food?.variations.find((v) => v._id === e._id))
                    }}
                    setSelectedVariation={onSelectVariation}
                    selectedVariation={selectedVariation}
                  />
                </View>
              )}
              {selectedVariation?.addons?.map((addon) => {
                return (<View key={addon?._id}>
                  <TitleComponent title={addon?.title} subTitle={addon?.description} error={addon.error} status={addon?.quantityMinimum === 0 ? t('optional') : `${addon?.quantityMinimum} ${t('Required')}`} />
                  <Options addon={addon} onSelectOption={onSelectOption} addonRefs={addonRefs} />
                </View>)
              })}
            </View>

            <View style={styles(currentTheme).line}></View>
            <View style={styles(currentTheme).inputContainer}>
              <TitleComponent title={t('specialInstructions')} subTitle={t('anySpecificPreferences')} status={t('optional')} />
              <TextField style={styles(currentTheme).input} placeholder={t('noMayo')} textAlignVertical='center' value={specialInstructions} onChangeText={setSpecialInstructions} maxLength={144} textColor={currentTheme.fontMainColor} baseColor={currentTheme.lightHorizontalLine} errorColor={currentTheme.textErrorColor} tintColor={themeContext.ThemeValue === 'Dark' ? "white" : "black"} placeholderTextColor={themeContext.ThemeValue === 'Dark' ? "white" : "black"} />
            </View>
            {/** frequently bought together */}
            <FrequentlyBoughtTogether itemId={food?._id} restaurantId={restaurant} />
          </View>
        </Animated.ScrollView>

        <Animated.View style={[styles(currentTheme).titleContainer, { opacity: 1, height: 35, marginTop: -12, zIndex: 9, padding: 2 }, animatedTitleStyle]}>
          <HeadingComponent title={food?.title} price={calculatePrice()} />
        </Animated.View>
        <View style={{ backgroundColor: currentTheme.themeBackground, zIndex: 10 }}>
          <CartComponent onPress={onPressAddToCart} disabled={validateButton()} />
        </View>
        <View
          style={{
            paddingBottom: inset.bottom,
            backgroundColor: currentTheme.themeBackground
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default ItemDetail
