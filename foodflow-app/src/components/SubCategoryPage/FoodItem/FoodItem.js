import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'
import ShimmerImage from '../../ShimmerImage/ShimmerImage'
import { useTranslation } from 'react-i18next'
import { calculateDiscountedPrice } from '../../../utils/calculateDiscountedPrice'

const FoodItem = ({ item, currentTheme, configuration, onPress }) => {
  const variation = item.variations?.[0]
  const price = variation?.price || 0
  const discountedPrice = variation?.discounted
  const isOutOfStock = item.isOutOfStock === true
  const { t, i18n } = useTranslation()

  const withoutDiscountPrice = calculateDiscountedPrice(price, discountedPrice)


  return (
    <TouchableOpacity style={[styles(currentTheme).foodItemContainer, isOutOfStock && styles(currentTheme).disabledItem]} activeOpacity={0.8} disabled={isOutOfStock} onPress={onPress} >
      <View style={styles(currentTheme).imageContainer}>
        <ShimmerImage imageUrl={item.image} style={[styles(currentTheme).foodImage, isOutOfStock && styles(currentTheme).grayedImage]} resizeMode='cover' />
        {isOutOfStock && (
          <View style={styles(currentTheme).outOfStockRibbon}>
            <TextDefault style={styles(currentTheme).outOfStockText} small bold>
              {t('Out of Stock')}
            </TextDefault>
          </View>
        )}
        {!isOutOfStock && (
          <TouchableOpacity style={[styles(currentTheme).addButton, { backgroundColor: 'black' }]} onPress={onPress}>
            <Ionicons name='add' size={scale(20)} color={currentTheme.white} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles(currentTheme).detailsContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap:scale(5) }}>
          <TextDefault H5 bold textColor={currentTheme.fontMainColor} style={{ }}>
            {configuration.currencySymbol} {price}
          </TextDefault>
          {discountedPrice && discountedPrice > 0 && (
            <TextDefault small bold textColor={currentTheme.fontSecondColor} style={{textDecorationLine:  'line-through' }}>
              {configuration.currencySymbol} {withoutDiscountPrice}
            </TextDefault>
          )}
        </View>
        <TextDefault textColor={isOutOfStock ? currentTheme.fontSecondColor || '#8A8A8E' : currentTheme.fontMainColor}>{item.title}</TextDefault>
      </View>
    </TouchableOpacity>
  )
}

export default FoodItem
