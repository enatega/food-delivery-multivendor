import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'
import ShimmerImage from '../../ShimmerImage/ShimmerImage'
import { useTranslation } from 'react-i18next'


const FoodItem = ({ item, currentTheme, configuration, onPress }) => {
  const variation = item.variations?.[0]
  const price = variation?.price || 0
  const discountedPrice = variation?.discounted
  const isOutOfStock = item.isOutOfStock === true
  const { t, i18n } = useTranslation()

  // Use discounted price only if it exists and is greater than 0, otherwise use base price
  const displayPrice =
    discountedPrice && discountedPrice > 0 ? discountedPrice : price

  return (
    <TouchableOpacity
      style={[
        styles(currentTheme).foodItemContainer,
        isOutOfStock && styles(currentTheme).disabledItem
      ]}
      activeOpacity={0.8}
      disabled={isOutOfStock}
    >
      <View style={styles(currentTheme).imageContainer}>
        <ShimmerImage
          imageUrl={item.image}
          style={[
            styles(currentTheme).foodImage,
            isOutOfStock && styles(currentTheme).grayedImage
          ]}
          resizeMode='cover'
        />
        {isOutOfStock && (
          <View style={styles(currentTheme).outOfStockRibbon}>
            <TextDefault
              style={styles(currentTheme).outOfStockText}
              small
              bold
            >
              {t('Out of Stock')}
            </TextDefault>
          </View>
        )}
        {!isOutOfStock && (
          <TouchableOpacity
            style={styles(currentTheme).addButton}
            onPress={onPress}
          >
            <Ionicons name='add' size={scale(20)} color={currentTheme.white} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles(currentTheme).detailsContainer}>
        <TextDefault H5 bold textColor={currentTheme.fontMainColor}>
          {configuration.currencySymbol} {displayPrice}
        </TextDefault>
        <TextDefault
          textColor={
            isOutOfStock
              ? currentTheme.fontSecondColor || '#8A8A8E'
              : currentTheme.fontMainColor
          }
        >
          {item.title}
        </TextDefault>
      </View>
    </TouchableOpacity>
  )
}

export default FoodItem