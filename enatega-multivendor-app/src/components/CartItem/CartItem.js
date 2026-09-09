import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { AntDesign, Feather, EvilIcons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { IMAGE_LINK } from '../../utils/constants'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import CachedImage from '../CachedImage'
import { useMultivendorTheme } from '../../ui/designSystem'

const CartItem = (props) => {
  const { t, i18n } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const navigation = useNavigation()

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue],
    ...tokens
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const imageUrl =
    props?.itemImage && props?.itemImage.trim() !== ''
      ? props?.itemImage
      : IMAGE_LINK

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const navigateToItemDetail = () => {
    const restaurant = props?.restaurantData
    if (!restaurant || !props?.food) return

    navigation.navigate('ItemDetail', {
      food: {
        ...props.food,
        restaurant: restaurant._id,
        restaurantName: restaurant.name
      },
      addons: restaurant.addons || [],
      options: restaurant.options || [],
      restaurant: restaurant._id,
      cartItem: props.cartItem
    })
  }

  const animatedQuantity = useSharedValue(1)

  const animateQuantityChange = () => {
    animatedQuantity.value = withSpring(1.9, {
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
  }, [props?.quantity])

  return (
    <View style={styles(currentTheme).itemContainer}>
      <View style={styles(currentTheme).itemDetails}>
        <View style={styles(currentTheme).suggestItemImgContainer}>
          <CachedImage
            source={{ uri: imageUrl }}
            style={styles(currentTheme).suggestItemImg}
            resizeMode='contain'
          />
        </View>
        <View style={styles(currentTheme).itemCopy}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.colors.textPrimary}
            bolder
            H5
            isRTL
          >
            {props?.dealName?.length > 20
              ? props?.dealName.substring(0, 17) + '...'
              : props?.dealName}
          </TextDefault>

          {props?.optionsTitle?.length > 0 && (
            <View style={styles(currentTheme).additionalItem}>
              <View>
                <TouchableOpacity
                  onPress={toggleDropdown}
                  activeOpacity={1}
                  style={styles(currentTheme).addonToggle}
                >
                  <TextDefault
                    style={{ marginRight: scale(5) }}
                    textColor={currentTheme.colors.textSecondary}
                    Normal
                    isRTL
                  >
                    {props?.optionsTitle?.length}{' '}
                    {t('additionalItems')}
                  </TextDefault>
                  <Feather
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={currentTheme.colors.iconMuted}
                  />
                </TouchableOpacity>
                {isDropdownOpen && (
                  <View style={styles(currentTheme).itemsDropdown}>
                    {props?.optionsTitle?.map((item, index) => (
                      <TextDefault
                        key={index}
                        textColor={currentTheme.colors.textSecondary}
                        Normal
                        isRTL
                      >
                        {item}
                      </TextDefault>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles(currentTheme).priceRow}>
            <TextDefault
              numberOfLines={1}
              textColor={currentTheme.colors.textPrimary}
              bolder
              Normal
              isRTL
            >
              {configuration.currencySymbol}
              {parseFloat(props?.dealPrice).toFixed(2)}
            </TextDefault>
            <View style={styles(currentTheme).divider} />
            <TouchableOpacity onPress={navigateToItemDetail}>
              <TextDefault
                textColor={currentTheme.colors.accent}
                bolder
                Normal
                isRTL
              >
                {t('edit')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles(currentTheme).actionContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).actionContainerBtns,
            styles(currentTheme).minusBtn
          ]}
          onPress={props?.removeQuantity}
        >
          {props?.quantity < 2 ? (
            <EvilIcons
              name='trash'
              size={scale(25)}
              color={currentTheme.colors.textPrimary}
            />
          ) : (
            <AntDesign
              name='minus'
              size={scale(18)}
              color={currentTheme.colors.textPrimary}
            />
          )}
        </TouchableOpacity>

        <Animated.View
          style={[styles(currentTheme).actionContainerView, animatedStyle]}
        >
          <TextDefault H5 bold textColor={currentTheme.colors.textPrimary} isRTL>
            {props?.quantity}
          </TextDefault>
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).actionContainerBtns,
            styles(currentTheme).plusBtn
          ]}
          onPress={props?.addQuantity}
        >
          <AntDesign name='plus' size={scale(18)} color={currentTheme.colors.textOnAccent} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CartItem
