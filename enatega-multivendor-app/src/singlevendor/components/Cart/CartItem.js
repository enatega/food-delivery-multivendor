import React, { useContext, useState } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import styles from './styles'
import CartItemDescription from './CartItemDescription'
import CartItemController from './CartItemController'

const CartItem = ({ item, onAddQuantity, onRemoveQuantity, currencySymbol = '€', onEdit, isLastItem = false, isFavourite = false, onAddToCart, isOrderHistory = false }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Handle both cart items (discountedUnitPrice) and favorite items (price)
  const unitPrice = item.variations[0]?.discountedUnitPrice ?? item.variations[0]?.price ?? 0
  const quantity = item.variations[0]?.quantity ?? 1
  const itemTotal = (parseFloat(unitPrice) * quantity).toFixed(2)

  console.log('CartItem Rendered:', item.variations[0])
  return (
    <View style={[styles(currentTheme).itemContainer, isLastItem && styles().itemContainerLast]}>
      {/* Left side: Image */}

      <View style={styles().imageContainer}>
        <Image 
          source={
            typeof item?.foodImage === 'number' 
              ? item.foodImage 
              : typeof item?.image === 'number'
              ? item.image
              : { uri: item?.foodImage || item?.image || '' }
          } 
          style={styles().productImage} 
        />
      </View>

      {/* Middle and Right: Content */}
      <View style={styles().mainContent}>
        {/* Top Row: Title only */}
        <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} bolder H5 isRTL>
          {item?.foodTitle}
        </TextDefault>

        {/* Middle Row: Description with Dropdown - single line */}
         {
          !isFavourite ? (
             <CartItemDescription variations={item?.variations}></CartItemDescription>
          ) : null
         }
       
        {/* Expanded Addons */}
        {/* {isDropdownOpen && item?.addons && item.addons.length > 0 && (
          <View style={styles().itemsDropdown}>
            {item.addons.map((addon, index) => (
              <TextDefault
                key={index}
                textColor={currentTheme.fontSecondColor}
                small
                isRTL
              >
                • {addon}
              </TextDefault>
            ))}
          </View>
        )} */}

        {/* Bottom Row: Quantity Controls (left) and Price (right) */}
        <View style={styles().bottomRow}>
          {isOrderHistory ? (
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles().orderHistoryQuantity}>
              Qty {item?.quantity || item?.variations?.[0]?.quantity || 1}
            </TextDefault>
          ) : isFavourite ? (
            <TouchableOpacity
              style={styles(currentTheme).addToCartButton}
              onPress={() => {
                if (onAddToCart) {
                  onAddToCart(item)
                } else {
                  console.log('Add to cart:', item)
                }
              }}
            >
              <AntDesign name='plus' size={scale(12)} color={currentTheme.fontMainColor} />
            </TouchableOpacity>
          ) : (
            <CartItemController item={item} />
          )}

          <TextDefault textColor={currentTheme.gray} bold isRTL>
            {currencySymbol} {itemTotal}
          </TextDefault>
        </View>
      </View>
    </View>
  )
}

export default CartItem
