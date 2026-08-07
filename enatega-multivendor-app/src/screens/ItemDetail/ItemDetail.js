import { View, Alert, StatusBar, Platform, KeyboardAvoidingView } from 'react-native'
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import navigationService from '../../routes/navigationService'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import UserContext from '../../context/User'
import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import TextDefault from '../../components/Text/TextDefault/TextDefault'

// Hooks
import React, { useState, useContext, useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { useAnimatedRef } from 'react-native-reanimated'
import { scale } from '../../utils/scaling'
import { TextField } from 'react-native-material-textfield'
import useMultivendorTheme from '../../ui/designSystem/useMultivendorTheme'

// Utils
import { truncateText } from '../../utils/customFunctions'

const ERROR_SCROLL_OFFSET = scale(132)

function ItemDetail(props) {
  const { food, addons, options, restaurant, cartItem: editCartItem } = props?.route?.params

  const getVariationWithAddons = (variation) => ({
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

  const getSelectedAddons = () => {
    return editCartItem?.addons?.map((addon) => ({
      ...addon,
      options: addon?.options?.map((option) => options?.find((opt) => opt._id === option._id) || option)
    })) || []
  }

  // States
  const [specialInstructions, setSpecialInstructions] = useState(editCartItem?.specialInstructions || '')
  const [selectedVariation, setSelectedVariation] = useState(getVariationWithAddons(food?.variations?.find((variation) => variation._id === editCartItem?.variation?._id) || food?.variations[0]))
  const [selectedAddons, setSelectedAddons] = useState(getSelectedAddons)

  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const Analytics = analytics()
  const { restaurant: restaurantCart, setCartRestaurant, cart, updateCart, addQuantity, addCartItem } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const inset = useSafeAreaInsets()
  const { isConnected: connect } = useNetworkStatus()
  const scrollViewRef = useAnimatedRef()
  const addonRefs = useRef({})
  const { tokens } = useMultivendorTheme()
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar)
      }
      StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
    }, [currentTheme.menuBar, themeContext.ThemeValue])
  )

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
  }, [Analytics, food?._id, food?.restaurantName, food?.title, restaurant])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      title: truncateText(20, food?.restaurantName),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: currentTheme.colors.canvas
      },
      headerTitleStyle: {
        color: currentTheme.colors.textPrimary
      },
      headerShadowVisible: false,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={styles(currentTheme).backBtnContainer}>
              <MaterialIcons name='arrow-back' size={25} color={currentTheme.colors.textPrimary} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [currentTheme.colors.canvas, currentTheme.colors.textPrimary, food?.restaurantName, navigation])

  function scrollToError(addonId, totalAddons) {
    setTimeout(() => {
      if (addonRefs.current[addonId] && scrollViewRef.current && totalAddons > 0) {
        addonRefs.current[addonId].measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current.scrollTo({
            // Solution: Round the final value to an integer
            y: Math.round(Math.max(0, pageY - ERROR_SCROLL_OFFSET)),
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
              onPress: async() => {
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
  const addToCart = async(quantity, clearFlag) => {
    const addons = selectedAddons.map((addon) => ({
      ...addon,
      options: addon?.options?.map(({ _id }) => ({
        _id
      }))
    }))

    const isSameCartItem = (cartItem) => {
      if (cartItem?._id !== food?._id || cartItem?.variation?._id !== selectedVariation?._id) return false
      if (cartItem?.addons?.length !== addons?.length) return false
      return addons?.every((newAddon) => {
        const cartAddon = cartItem.addons?.find((ad) => ad._id === newAddon._id)
        if (!cartAddon || cartAddon?.options?.length !== newAddon?.options?.length) return false
        return newAddon?.options?.every((newOption) => {
          return cartAddon?.options?.some((op) => op._id === newOption._id)
        })
      })
    }

    if (editCartItem?.key) {
      const nextCart = clearFlag ? [] : cart.filter((cartItem) => cartItem.key !== editCartItem.key)
      const cartItem = {
        ...editCartItem,
        _id: food?._id,
        quantity,
        variation: {
          _id: selectedVariation?._id
        },
        addons,
        specialInstructions
      }
      const matchingIndex = nextCart.findIndex(isSameCartItem)

      if (matchingIndex > -1) {
        nextCart[matchingIndex] = {
          ...nextCart[matchingIndex],
          quantity: nextCart[matchingIndex].quantity + quantity
        }
      } else {
        nextCart.push(cartItem)
      }

      await setCartRestaurant(restaurant)
      await updateCart(nextCart)
      navigation.goBack()
      return
    }

    const cartItem = clearFlag
      ? null
      : cart.find(isSameCartItem)

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
        ...getVariationWithAddons(variation)
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
  }, [selectedVariation, addons, selectedAddons])

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
          style={styles(currentTheme).scrollViewStyle}
          contentContainerStyle={styles(currentTheme).scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles(currentTheme).productIntro}>
            {food?.image
              ? <ImageHeader image={food?.image} style={styles(currentTheme).productImage} />
              : (
                <View style={styles(currentTheme).imageFallback}>
                  <Ionicons name='restaurant-outline' size={scale(36)} color={currentTheme.colors.textMuted} />
                </View>
                )}
            <HeadingComponent title={food?.title} price={calculatePrice()} discountedPrice={calculateDiscountedPrice()} />
            {!!food?.description?.trim() && (
              <TextDefault style={styles(currentTheme).descriptionText}>
                {food.description}
              </TextDefault>
            )}
          </View>
          <View style={[styles(currentTheme).subContainer]}>
            <View>
              {food?.variations?.length > 1 && (
                <View key='variations' style={styles(currentTheme).optionSection}>
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
                return (<View key={addon?._id} style={styles(currentTheme).optionSection}>
                  <TitleComponent title={addon?.title} subTitle={addon?.description} error={addon.error} status={addon?.quantityMinimum === 0 ? t('optional') : `${addon?.quantityMinimum} ${t('Required')}`} />
                  <Options addon={addon} onSelectOption={onSelectOption} addonRefs={addonRefs} selectedAddons={selectedAddons} />
                </View>)
              })}
            </View>

            <View style={styles(currentTheme).inputContainer}>
              <TitleComponent title={t('specialInstructions')} subTitle={t('anySpecificPreferences')} status={t('optional')} />
              <TextField style={styles(currentTheme).input} placeholder={t('noMayo')} textAlignVertical='center' value={specialInstructions} onChangeText={setSpecialInstructions} maxLength={144} textColor={tokens.colors.textPrimary} baseColor={tokens.colors.borderSubtle} errorColor={tokens.colors.danger} tintColor={tokens.colors.accent} placeholderTextColor={tokens.colors.textMuted} />
            </View>
            {/** frequently bought together */}
            <FrequentlyBoughtTogether itemId={food?._id} restaurantId={restaurant} />
          </View>
        </Animated.ScrollView>

        <View style={styles(currentTheme).cartFooter}>
          <CartComponent onPress={onPressAddToCart} disabled={validateButton()} quantity={editCartItem?.quantity} />
          <View style={{ height: inset.bottom }} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ItemDetail
