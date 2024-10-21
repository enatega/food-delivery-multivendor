import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import {
  View,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard, 
  TouchableOpacity
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styles from './styles'
import RadioComponent from '../../components/CustomizeComponents/RadioComponent/RadioComponent'
import CheckComponent from '../../components/CustomizeComponents/CheckComponent/CheckComponent'
import TitleComponent from '../../components/CustomizeComponents/TitleComponent/TitleComponent'
import CartComponent from '../../components/CustomizeComponents/CartComponent/CartComponent'
import HeadingComponent from '../../components/CustomizeComponents/HeadingComponent/HeadingComponent'
import ImageHeader from '../../components/CustomizeComponents/ImageHeader/ImageHeader'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { TextField } from 'react-native-material-textfield'
import analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import FrequentlyBoughtTogether from '../../components/ItemDetail/Section'
import { IMAGE_LINK } from '../../utils/constants'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import { scale } from '../../utils/scaling'
import { Card } from 'react-native-paper'
const { height } = Dimensions.get('window')
const TOP_BAR_HEIGHT = height * 0.08
const HEADER_MAX_HEIGHT = height * 0.34
const HEADER_MIN_HEIGHT = height * 0.05 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
function ItemDetail(props) {
  const Analytics = analytics()

  const { food, addons, options, restaurant } = props.route.params
  const navigation = useNavigation()
  const { t } = useTranslation()

  const [selectedVariation, setSelectedVariation] = useState({
    ...food.variations[0],
    addons: food.variations[0].addons.map((fa) => {
      const addon = addons.find((a) => a._id === fa)
      const addonOptions = addon.options.map((ao) => {
        return options.find((o) => o._id === ao)
      })
      return {
        ...addon,
        options: addonOptions
      }
    })
  })

  const imageUrl =
    food?.image && food?.image.trim() !== '' ? food.image : IMAGE_LINK

  const [selectedAddons, setSelectedAddons] = useState([])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const {
    restaurant: restaurantCart,
    setCartRestaurant,
    cart,
    addQuantity,
    addCartItem
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.OPENED_RESTAURANT_ITEM, {
        restaurantID: restaurant,
        foodID: food._id,
        foodName: food.title,
        foodRestaurantName: food.restaurantName
      })
    }
    Track()
  })
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      title: food.restaurantName,
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
              <MaterialIcons
                name='arrow-back'
                size={25}
                color={currentTheme.newIconColor}
              />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])

  function validateButton() {
    if (!selectedVariation) return false
    const validatedAddons = []
    selectedVariation.addons.forEach((addon) => {
      const selected = selectedAddons.find((ad) => ad._id === addon._id)
      if (!selected && addon.quantityMinimum === 0) {
        validatedAddons.push(false)
      } else if (
        selected &&
        selected?.options?.length >= addon.quantityMinimum &&
        selected.options.length <= addon.quantityMaximum
      ) {
        validatedAddons.push(false)
      } else validatedAddons.push(true)
    })
    return validatedAddons.every((val) => val === false)
  }

  async function onPressAddToCart(quantity) {
    if (validateOrderItem()) {
      Analytics.track(Analytics.events.ADD_TO_CART, {
        title: food.title,
        restaurantName: food.restaurantName,
        variations: food.variations
      })
      if (!restaurantCart || restaurant === restaurantCart) {
        await addToCart(quantity, restaurant !== restaurantCart)
      } else if (food.restaurant !== restaurantCart) {
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

  const addToCart = async (quantity, clearFlag) => {
    const addons = selectedAddons.map((addon) => ({
      ...addon,
      options: addon.options.map(({ _id }) => ({
        _id
      }))
    }))

    const cartItem = clearFlag
      ? null
      : cart.find((cartItem) => {
          if (
            cartItem._id === food._id &&
            cartItem.variation._id === selectedVariation._id
          ) {
            if (cartItem?.addons?.length === addons.length) {
              if (addons.length === 0) return true
              const addonsResult = addons.every((newAddon) => {
                const cartAddon = cartItem.addons.find(
                  (ad) => ad._id === newAddon._id
                )

                if (!cartAddon) return false
                const optionsResult = newAddon.options.every((newOption) => {
                  const cartOption = cartAddon.options.find(
                    (op) => op._id === newOption._id
                  )

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
      await addCartItem(
        food._id,
        selectedVariation._id,
        quantity,
        addons,
        clearFlag,
        specialInstructions
      )
    } else {
      await addQuantity(cartItem.key, quantity)
    }
    navigation.goBack()
  }

  function onSelectVariation(variation) {
    setSelectedVariation({
      ...variation,
      addons: variation.addons.map((fa) => {
        const addon = addons.find((a) => a._id === fa)
        const addonOptions = addon.options.map((ao) => {
          return options.find((o) => o._id === ao)
        })
        return {
          ...addon,
          options: addonOptions
        }
      })
    })
  }

  async function onSelectOption(addon, option) {
    const index = selectedAddons.findIndex((ad) => ad._id === addon._id)
    if (index > -1) {
      if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
        selectedAddons[index].options = [option]
      } else {
        const optionIndex = selectedAddons[index].options.findIndex(
          (opt) => opt._id === option._id
        )
        if (optionIndex > -1) {
          selectedAddons[index].options = selectedAddons[index].options.filter(
            (opt) => opt._id !== option._id
          )
        } else {
          selectedAddons[index].options.push(option)
        }
        if (!selectedAddons[index].options.length) {
          selectedAddons.splice(index, 1)
        }
      }
    } else {
      selectedAddons.push({ _id: addon._id, options: [option] })
    }
    setSelectedAddons([...selectedAddons])
  }

  function calculatePrice() {
    const variation = selectedVariation.price
    let addons = 0
    selectedAddons.forEach((addon) => {
      addons += addon.options.reduce((acc, option) => {
        return acc + option.price
      }, 0)
    })
    return (variation + addons).toFixed(2)
  }

  function validateOrderItem() {
    const validatedAddons = selectedVariation.addons.map((addon) => {
      const selected = selectedAddons.find((ad) => ad._id === addon._id)

      if (!selected && addon.quantityMinimum === 0) {
        addon.error = false
      } else if (
        selected &&
        selected.options.length >= addon.quantityMinimum &&
        selected.options.length <= addon.quantityMaximum
      ) {
        addon.error = false
      } else addon.error = true
      return addon
    })
    setSelectedVariation({ ...selectedVariation, addons: validatedAddons })
    return validatedAddons.every((addon) => addon.error === false)
  }

  function renderOption(addon) {
    if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
      return (
        <View>
          <RadioComponent
            options={addon.options}
            onPress={onSelectOption.bind(this, addon)}
          />
          {addon.error && (
            <TextDefault small textColor={currentTheme.textErrorColor}>
              {t('selectOptionforAddon')}
            </TextDefault>
          )}
        </View>
      )
    } else {
      return (
        <View>
          <CheckComponent
            options={addon.options}
            onPress={onSelectOption.bind(this, addon)}
          />
          {addon.error && (
            <TextDefault small textColor={currentTheme.textErrorColor}>
              {t('selectOptionforAddon')}
            </TextDefault>
          )}
        </View>
      )
    }
  }
  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    }
  })
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    )
    return {
      height,
      opacity: interpolate(
        scrollY.value,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP
      )
    }
  })

  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_RANGE - 20, SCROLL_RANGE],
      [0, 1],
      Extrapolation.CLAMP
    )
    return {
      // opacity,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SCROLL_RANGE],
            [HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 0],
            Extrapolation.CLAMP
          )
        }
      ]
    }
  })

  return (
    <>
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <Animated.View
          style={[styles(currentTheme).headerContainer, animatedHeaderStyle]}
        >
          <ImageHeader image={imageUrl} />
          {/* <HeadingComponent title={food.title} price={calculatePrice()} /> */}
        </Animated.View>
        <Animated.ScrollView
          onScroll={scrollHandler} 
          style={[styles().scrollViewStyle, { backgroundColor: currentTheme.themeBackground }]}
          scrollEventThrottle={1}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT,
            paddingBottom: scale(height * 0.09),
            backgroundColor: currentTheme.themeBackground,
          }}
        >
          <View style={[styles().subContainer, { backgroundColor: currentTheme.themeBackground}]}>
            <View>
              {food?.variations?.length > 1 && (
                <View>
                  <TitleComponent
                    title={t('SelectVariation')}
                    subTitle={t('SelectOne')}
                    status={t('Required')}
                  />
                  <RadioComponent
                    options={food.variations}
                    selected={selectedVariation}
                    onPress={onSelectVariation}
                  />
                </View>
              )}
              {selectedVariation.addons.map((addon) => (
                <View key={addon._id}>
                  <TitleComponent
                    title={addon.title}
                    subTitle={addon.description}
                    error={addon.error}
                    status={
                      addon.quantityMinimum === 0
                        ? t('optional')
                        : `${addon.quantityMinimum} ${t('Required')}`
                    }
                  />
                  {renderOption(addon)}
                </View>
              ))}
            </View>

            <View style={styles(currentTheme).line}></View>
            <View style={styles(currentTheme).inputContainer}>
              <TitleComponent
                title={t('specialInstructions')}
                subTitle={t('anySpecificPreferences')}
                status={t('optional')}
              />
              <TextField
                style={styles(currentTheme).input}
                placeholder={t('noMayo')}
                textAlignVertical='center'
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                maxLength={144}
                textColor={currentTheme.fontMainColor}
                baseColor={currentTheme.lightHorizontalLine}
                errorColor={currentTheme.textErrorColor}
                tintColor={currentTheme.themeBackground}
                placeholderTextColor={currentTheme.fontGrayNew}
              />
            </View>
            {/** frequently bought together */}
            <FrequentlyBoughtTogether
              itemId={food._id}
              restaurantId={restaurant}
            />
          </View>
        </Animated.ScrollView>

        <Animated.View
          style={[styles(currentTheme).titleContainer, animatedTitleStyle]}
        >
          <HeadingComponent title={food.title} price={calculatePrice()} />
        </Animated.View>
        <View style={{ backgroundColor: currentTheme.themeBackground }}>
          <CartComponent
            onPress={onPressAddToCart}
            disabled={validateButton()}
          />
        </View>
        <View
          style={{
            paddingBottom: inset.bottom,
            backgroundColor: currentTheme.themeBackground
          }}
        />
      </View>
    </>
  )
}

export default ItemDetail