import { View, Text, ImageBackground, StyleSheet, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import ProductImageOverlay from './ProductImageOverlay'
import ConfigurationContext from '../../context/Configuration'
import { getDealLabel, getDealPricing } from '../utils/helper'
import CartQuantityController from './Cart/CartQuantityController'
import { normalizeSingleVendorMediaUrl } from '../../utils/mediaUrl'
import { getFirstAvailableVariation, isProductOutOfStock } from '../utils/stock'

const ProductCard = ({ product, onCardPress, containerStyles, layout = 'horizontal' }) => {
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const configuration = useContext(ConfigurationContext)

  const isGrid = layout === 'grid'
  const variation = getFirstAvailableVariation(product?.variations) || product?.variations?.[0]
  const isOutOfStock = isProductOutOfStock(product)
  const deal = variation?.deal

  const { finalPrice, discountAmount } = getDealPricing(variation?.price, deal)
  const dealLabel = getDealLabel(deal, configuration?.currencySymbol)
  const hasDeal = discountAmount > 0 && Boolean(dealLabel)

  return (
    <Pressable
      onPress={() => {
        onCardPress && onCardPress(product?.id, product?.categoryId)
      }}
      style={[styles(currentTheme).card, isGrid && styles(currentTheme).gridCard, containerStyles]}
      accessibilityRole='button'
      accessibilityLabel={`${product?.title || t('product', { defaultValue: 'Product' })}${isOutOfStock ? `, ${t('out_of_stock_label', { defaultValue: 'Out of stock' })}` : ''}`}
    >
      <ImageBackground
        onError={() => {
          // console.log("Error loading images",err)
        }}
        source={{ uri: typeof product?.image === 'number' ? '' : normalizeSingleVendorMediaUrl(product?.image) }}
        style={[styles(currentTheme).imageContainer, isGrid && styles(currentTheme).gridImageContainer]}
        imageStyle={[styles(currentTheme).productImage, isOutOfStock && styles(currentTheme).outOfStockImage]}
      >
        {hasDeal && (
          <View style={styles(currentTheme).dealBadge}>
            <Text style={styles(currentTheme).dealBadgeText}>{dealLabel}</Text>
          </View>
        )}
        {isOutOfStock && (
          <View style={styles(currentTheme).outOfStockBadge}>
            <Text style={styles(currentTheme).outOfStockText}>{t('out_of_stock_label', { defaultValue: 'Out of stock' })}</Text>
          </View>
        )}
        <ProductImageOverlay hasDeal={hasDeal} product={product} dealText={product?.dealText || 'Deal'} control={<CartQuantityController foodId={product?.id} categoryId={product?.categoryId} variationId={variation?.id} addons={[]} defaultQuantity={0} collapsedWhenZero variant='overlay' isOutOfStock={isOutOfStock} />} />
      </ImageBackground>
      <View style={[styles(currentTheme).contentContainer, isGrid && styles(currentTheme).gridContentContainer]}>
        <View style={styles(currentTheme).priceContainer}>
          {hasDeal
            ? (
            <>
              <Text style={styles(currentTheme).finalPrice}>
                {finalPrice} {configuration?.currencySymbol}
              </Text>

              <Text style={styles(currentTheme).originalPrice}>
                {variation?.price} {configuration?.currencySymbol}
              </Text>
            </>
              )
            : (
            <Text style={styles(currentTheme).finalPrice}>
              {variation?.price} {configuration?.currencySymbol}
            </Text>
              )}
        </View>
        <Text style={styles(currentTheme).productName} numberOfLines={isGrid ? 2 : 3} ellipsizeMode='tail'>
          {product?.title}
        </Text>
        {/* Todo: can show variations specific price and product size. */}
        {/* <View style={styles(currentTheme).volumeContainer}>
                <Text style={styles(currentTheme).volume}>{product?.volume}</Text>
                <Text style={styles(currentTheme).pricePerLiter}>€ {product?.pricePerLiter?.toFixed(1)}/l</Text>
            </View> */}
      </View>
    </Pressable>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    card: {
      width: 150,
      backgroundColor: currentTheme.cardBackground,
      borderRadius: 12,
      marginRight: 12,
      position: 'relative',
      shadowColor: currentTheme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    gridCard: {
      flex: 1,
      width: 'auto',
      minHeight: 224,
      marginHorizontal: 6,
      marginRight: 6,
      marginBottom: 12,
      overflow: 'hidden'
    },
    contentContainer: {
      padding: 12
    },
    gridContentContainer: {
      flexGrow: 1,
      minHeight: 88,
      justifyContent: 'flex-start'
    },
    imageContainer: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      marginBottom: 8,
      overflow: 'hidden',
      position: 'relative'
    },
    gridImageContainer: {
      height: 136,
      marginBottom: 0,
      borderRadius: 0,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12
    },
    productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover'
    },
    outOfStockImage: {
      opacity: 0.55
    },
    outOfStockBadge: {
      position: 'absolute',
      left: 8,
      right: 8,
      bottom: 8,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
      alignItems: 'center',
      backgroundColor: 'rgba(21, 25, 20, 0.9)',
      zIndex: 2
    },
    outOfStockText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700'
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: currentTheme.singleVendorBrandForeground,
      marginBottom: 4
    },
    productName: {
      fontSize: 14,
      fontWeight: '500',
      color: currentTheme.fontMainColor,
      marginBottom: 6
    },
    volumeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    volume: {
      fontSize: 12,
      color: currentTheme.fontSecondColor
    },
    pricePerLiter: {
      fontSize: 12,
      color: currentTheme.fontSecondColor
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4
    },

    finalPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: currentTheme.singleVendorBrandForeground,
      marginRight: 6
    },

    originalPrice: {
      fontSize: 13,
      color: currentTheme.fontSecondColor,
      textDecorationLine: 'line-through'
    },

    dealBadge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: currentTheme.singleVendorBrand,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },

    dealBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: currentTheme.singleVendorOnBrand
    }
  })

export default ProductCard
