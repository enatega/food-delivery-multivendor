import React, { useContext } from 'react'
import { View, Image, TouchableOpacity, Pressable } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import styles from './styles'
import CartItemDescription from './CartItemDescription'
import CartItemController from './CartItemController'
import { normalizeSingleVendorMediaUrl } from '../../../utils/mediaUrl'
import { getDealLabel, getDealPricing } from '../../utils/helper'
import { isProductOutOfStock } from '../../utils/stock'

const CartItem = ({ item, onAddQuantity, onRemoveQuantity, currencySymbol = '€', onEdit, isLastItem = false, isFavourite = false, onAddToCart, isOrderHistory = false }) => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const variation = item.variations[0] || {}
  const previewPricing = getDealPricing(variation.price, variation.deal)
  const unitPrice = variation.discountedUnitPrice ?? (previewPricing.discountAmount > 0 ? previewPricing.finalPrice : variation.price) ?? 0
  const actualUnitPrice = variation.actualUnitPrice ?? variation.unitPrice ?? variation.price ?? unitPrice
  const quantity = variation.quantity ?? 1
  const discountedItemTotal = Number(variation.discountedItemTotal ?? variation.itemTotal ?? parseFloat(unitPrice) * quantity)
  const actualItemTotal = Number(variation.actualItemTotal ?? parseFloat(actualUnitPrice) * quantity)
  const hasDeal = actualItemTotal > discountedItemTotal
  const dealLabel = getDealLabel(variation.dealInfo ?? variation.deal, currencySymbol)
  const isOutOfStock = isProductOutOfStock(item)

  console.log('CartItem Rendered:', item.variations[0])
  const handlePress = () => {
    const productId = item?.foodId || item?._id || item?.id
    const categoryId = item?.categoryId
    if (!productId) return
    navigation.navigate('ProductDetails', {
      productId,
      categoryId
    })
  }

  const handleEdit = (event) => {
    event?.stopPropagation?.()
    if (onEdit) return onEdit(item)
    navigation.navigate('ProductDetails', {
      productId: item?.foodId,
      categoryId: item?.categoryId,
      editCartItem: item
    })
  }

  return (
    <Pressable onPress={handlePress} style={[styles(currentTheme).itemContainer, isLastItem && styles().itemContainerLast]}>
      {/* Left side: Image */}

      <View style={styles().imageContainer}>
        <Image source={typeof item?.foodImage === 'number' ? item.foodImage : typeof item?.image === 'number' ? item.image : { uri: normalizeSingleVendorMediaUrl(item?.foodImage || item?.image || '') }} style={styles().productImage} />
      </View>

      {/* Middle and Right: Content */}
      <View style={styles().mainContent}>
        {/* Top Row: Title only */}
        <View style={styles().titleRow}>
          <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} bolder H5 isRTL style={styles().titleText}>
            {item?.foodTitle}
          </TextDefault>
          {!isFavourite && !isOrderHistory && (
            <TouchableOpacity accessibilityRole='button' onPress={handleEdit} hitSlop={8}>
              <TextDefault bold textColor={currentTheme.singleVendorBrandForeground}>
                {t('Edit')}
              </TextDefault>
            </TouchableOpacity>
          )}
        </View>

        {isFavourite && isOutOfStock && (
          <TextDefault style={styles(currentTheme).outOfStockLabel} textColor={currentTheme.errorColor || '#DC2626'} bold small>
            {t('out_of_stock_label', { defaultValue: 'Out of stock' })}
          </TextDefault>
        )}

        {/* Middle Row: Description with Dropdown - single line */}
        {!isFavourite ? <CartItemDescription variations={item?.variations}></CartItemDescription> : null}

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
          {isOrderHistory
            ? (
            <TextDefault textColor={currentTheme.fontSecondColor} style={styles().orderHistoryQuantity}>
              Qty {item?.quantity || item?.variations?.[0]?.quantity || 1}
            </TextDefault>
              )
            : isFavourite
              ? (
            <TouchableOpacity
              style={[styles(currentTheme).addToCartButton, isOutOfStock && styles(currentTheme).disabledAddToCartButton]}
              disabled={isOutOfStock}
              accessibilityState={{ disabled: isOutOfStock }}
              accessibilityLabel={isOutOfStock ? t('out_of_stock_label', { defaultValue: 'Out of stock' }) : t('addToCart')}
              onPress={() => {
                if (isOutOfStock) return
                if (onAddToCart) {
                  onAddToCart(item)
                } else {
                  console.log('Add to cart:', item)
                }
              }}
            >
              <AntDesign name='plus' size={scale(12)} color={currentTheme.singleVendorOnBrand} />
            </TouchableOpacity>
                )
              : (
            <CartItemController item={item} />
                )}

          <View style={styles().priceBlock}>
            {hasDeal && dealLabel && (
              <TextDefault style={styles(currentTheme).dealBadge} textColor={currentTheme.singleVendorOnBrand} bold>
                {dealLabel}
              </TextDefault>
            )}
            <TextDefault textColor={hasDeal ? currentTheme.singleVendorBrandForeground : currentTheme.gray} bold isRTL>
              {discountedItemTotal.toFixed(2)}&nbsp;{currencySymbol}
            </TextDefault>
            {hasDeal && (
              <TextDefault style={styles().originalPrice} textColor={currentTheme.fontSecondColor} small isRTL>
                {actualItemTotal.toFixed(2)}&nbsp;{currencySymbol}
              </TextDefault>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default CartItem
