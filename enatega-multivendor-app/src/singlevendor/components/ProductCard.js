import { View, Text, ImageBackground, StyleSheet, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import ProductImageOverlay from './ProductImageOverlay'
import ConfigurationContext from '../../context/Configuration'
import { getDealPricing } from '../utils/helper'

const ProductCard = ({ product, onAddToCart, onCardPress, containerStyles }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const configuration = useContext(ConfigurationContext)
  console.log('product:::::', product.variations[0])

  const variation = product?.variations?.[0]
  const deal = variation?.deal

  const { finalPrice, discountAmount } = getDealPricing(variation?.price, deal)

  const hasDeal = Boolean(deal)

  return (
    <Pressable
      onPress={() => {
        onCardPress && onCardPress(product?.id)
      }}
      style={[styles(currentTheme).card, containerStyles]}
    >
      <ImageBackground
        onError={(err) => {
          // console.log("Error loading images",err)
        }}
        source={{ uri: typeof product?.image == 'number' ? '' : product?.image }}
        style={styles(currentTheme).imageContainer}
        imageStyle={styles(currentTheme).productImage}
      >
        {hasDeal && (
          <View style={styles(currentTheme).dealBadge}>
            <Text style={styles(currentTheme).dealBadgeText}>{deal.discountType === 'PERCENTAGE' ? `${deal.discountValue}% OFF` : `${configuration?.currencySymbol}${deal.discountValue} OFF`}</Text>
          </View>
        )}
        <ProductImageOverlay hasDeal={product.variations[0].deal ? true : false} onAddToCart={onAddToCart ? onAddToCart : () => {}} product={product} dealText={product?.dealText || 'Deal'} />
      </ImageBackground>
      <View style={styles(currentTheme).contentContainer}>
        <View style={styles(currentTheme).priceContainer}>
          {hasDeal ? (
            <>
              <Text style={styles(currentTheme).finalPrice}>
                {configuration?.currencySymbol} {finalPrice}
              </Text>

              <Text style={styles(currentTheme).originalPrice}>
                {configuration?.currencySymbol} {variation?.price}
              </Text>
            </>
          ) : (
            <Text style={styles(currentTheme).finalPrice}>
              {configuration?.currencySymbol} {variation?.price}
            </Text>
          )}
        </View>
        <Text style={styles(currentTheme).productName} numberOfLines={5} ellipsizeMode='tail'>
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
    contentContainer: {
      padding: 12
    },
    imageContainer: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      marginBottom: 8,
      overflow: 'hidden',
      position: 'relative'
    },
    productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover'
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: currentTheme.primaryBlue,
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
      color: currentTheme.primaryBlue,
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
      backgroundColor: currentTheme.primaryBlue,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },

    dealBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#fff'
    }
  })

export default ProductCard
