import { View, Text, ImageBackground, StyleSheet, Pressable } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import ProductImageOverlay from './ProductImageOverlay'
import ConfigurationContext from '../../context/Configuration'
import { getDealLabel, getDealPricing } from '../utils/helper'
import CartQuantityController from './Cart/CartQuantityController'
import { normalizeSingleVendorMediaUrl } from '../../utils/mediaUrl'
import { getFirstAvailableVariation, isProductOutOfStock } from '../utils/stock'
import { useApolloClient } from '@apollo/client'
import { rememberCategoryProduct, setProductPreview } from '../utils/productPreviewCache'
import { GET_FOOD_DETAILS, GET_SIMILAR_FOODS } from '../apollo/queries'

const ProductCard = ({ product, onCardPress, containerStyles, layout = 'horizontal' }) => {
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const isRTL = i18n.dir() === 'rtl'
  const currentTheme = useMemo(() => ({ isRTL, ...theme[themeContext.ThemeValue] }), [isRTL, themeContext.ThemeValue])
  const s = useMemo(() => styles(currentTheme), [currentTheme])
  const configuration = useContext(ConfigurationContext)
  const client = useApolloClient()

  rememberCategoryProduct(product)

  // Start the details and similar-products requests before the screen transition,
  // with the same variables ProductDetails uses so Apollo dedupes and reuses them.
  const prefetchDetails = () => {
    const foodId = product?.id
    if (!foodId) return
    const ignore = () => {}
    client.query({ query: GET_FOOD_DETAILS, variables: product?.categoryId ? { foodId, categoryId: product.categoryId } : { foodId }, fetchPolicy: 'network-only' }).catch(ignore)
    client.query({ query: GET_SIMILAR_FOODS, variables: { foodId, skip: 0, limit: 10 }, fetchPolicy: 'network-only' }).catch(ignore)
  }

  const isGrid = layout === 'grid'
  const variation = getFirstAvailableVariation(product?.variations) || product?.variations?.[0]
  const isOutOfStock = isProductOutOfStock(product)
  const deal = variation?.deal

  const { finalPrice, discountAmount } = getDealPricing(variation?.price, deal)
  const dealLabel = getDealLabel(deal, configuration?.currencySymbol)
  const hasDeal = discountAmount > 0 && Boolean(dealLabel)

  const priceRow = (
    <View style={[s.priceContainer, isGrid && s.gridPriceContainer]}>
      <Text style={[s.finalPrice, isGrid && s.gridFinalPrice]} numberOfLines={1}>
        {hasDeal ? finalPrice : variation?.price} {configuration?.currencySymbol}
      </Text>
      {hasDeal && (
        <Text style={[s.originalPrice, isGrid && s.gridOriginalPrice]} numberOfLines={1}>
          {variation?.price} {configuration?.currencySymbol}
        </Text>
      )}
    </View>
  )

  const nameText = (
    <Text style={[s.productName, isGrid && s.gridProductName]} numberOfLines={isGrid ? 1 : 3} ellipsizeMode='tail'>
      {product?.title}
    </Text>
  )

  // Grid tiles always reserve the description line so prices align across a row.
  const descriptionText = (
    <Text style={s.gridDescription} numberOfLines={1} ellipsizeMode='tail'>
      {product?.description || ' '}
    </Text>
  )

  return (
    <Pressable
      onPress={() => {
        setProductPreview(product)
        prefetchDetails()
        onCardPress && onCardPress(product?.id, product?.categoryId)
      }}
      style={({ pressed }) => [s.card, isGrid && s.gridCard, containerStyles, isGrid && pressed && s.gridCardPressed]}
      accessibilityRole='button'
      accessibilityLabel={`${product?.title || t('product', { defaultValue: 'Product' })}${isOutOfStock ? `, ${t('out_of_stock_label', { defaultValue: 'Out of stock' })}` : ''}`}
    >
      <ImageBackground
        onError={() => {
          // console.log("Error loading images",err)
        }}
        source={{ uri: typeof product?.image === 'number' ? '' : normalizeSingleVendorMediaUrl(product?.image) }}
        style={[s.imageContainer, isGrid && s.gridImageContainer]}
        imageStyle={[s.productImage, isOutOfStock && s.outOfStockImage]}
      >
        {hasDeal && (
          <View style={[s.dealBadge, isGrid && s.gridDealBadge]}>
            <Text style={s.dealBadgeText}>{dealLabel}</Text>
          </View>
        )}
        {isOutOfStock && (
          <View style={[s.outOfStockBadge, isGrid && s.gridOutOfStockBadge]}>
            <Text style={s.outOfStockText}>{t('out_of_stock_label', { defaultValue: 'Out of stock' })}</Text>
          </View>
        )}
        <ProductImageOverlay hasDeal={hasDeal} product={product} dealText={product?.dealText || 'Deal'} control={<CartQuantityController foodId={product?.id} categoryId={product?.categoryId} variationId={variation?.id} addons={[]} defaultQuantity={0} collapsedWhenZero variant='overlay' isOutOfStock={isOutOfStock} product={product} />} />
      </ImageBackground>
      <View style={[s.contentContainer, isGrid && s.gridContentContainer]}>
        {/* Grid tiles lead with the name so prices line up along the bottom edge. */}
        {isGrid
          ? (
            <>
              <View>
                {nameText}
                {descriptionText}
              </View>
              {priceRow}
            </>
            )
          : (
            <>
              {priceRow}
              {nameText}
            </>
            )}
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
    // Grid tile: framed photo inside a soft card, name then price below.
    gridCard: {
      flex: 1,
      width: 'auto',
      marginHorizontal: 4,
      marginRight: 4,
      marginBottom: 8,
      padding: 5,
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: currentTheme.themeBackground === '#000' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(24, 24, 27, 0.08)',
      shadowColor: '#0F172A',
      shadowOpacity: currentTheme.themeBackground === '#000' ? 0 : 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: currentTheme.themeBackground === '#000' ? 0 : 2
    },
    gridCardPressed: {
      opacity: 0.94,
      transform: [{ scale: 0.98 }]
    },
    contentContainer: {
      padding: 12
    },
    gridContentContainer: {
      flexGrow: 1,
      paddingHorizontal: 5,
      paddingTop: 8,
      paddingBottom: 3,
      justifyContent: 'space-between'
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
      height: 140,
      marginBottom: 0,
      borderRadius: 12,
      backgroundColor: currentTheme.colorBgTertiary
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

    gridDealBadge: {
      borderRadius: 999,
      paddingHorizontal: 9
    },
    gridOutOfStockBadge: {
      borderRadius: 999
    },
    gridProductName: {
      fontSize: 14,
      lineHeight: 19,
      fontWeight: '700',
      letterSpacing: -0.1,
      marginBottom: 0
    },
    gridDescription: {
      fontSize: 12,
      lineHeight: 16,
      marginTop: 2,
      color: currentTheme.themeBackground === '#000' ? '#A1A1AA' : '#71717A'
    },
    gridPriceContainer: {
      marginTop: 6,
      marginBottom: 0,
      flexWrap: 'wrap'
    },
    gridFinalPrice: {
      fontSize: 15.5,
      fontWeight: '800',
      letterSpacing: -0.2
    },
    gridOriginalPrice: {
      fontSize: 12
    },
    dealBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: currentTheme.singleVendorOnBrand
    }
  })

export default ProductCard
