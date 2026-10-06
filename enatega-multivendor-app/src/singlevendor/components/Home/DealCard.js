import React, { memo, useContext, useMemo } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useApolloClient } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import ConfigurationContext from '../../../context/Configuration'
import { normalizeSingleVendorMediaUrl } from '../../../utils/mediaUrl'
import { scale } from '../../../utils/scaling'
import CartQuantityController from '../Cart/CartQuantityController'
import { getDealLabel, getDealPricing } from '../../utils/helper'
import { getFirstAvailableVariation, isProductOutOfStock } from '../../utils/stock'
import { rememberCategoryProduct, setProductPreview } from '../../utils/productPreviewCache'
import { GET_FOOD_DETAILS, GET_SIMILAR_FOODS } from '../../apollo/queries'

const CARD_INSET = scale(5)
const IMAGE_HEIGHT = scale(108)
const TITLE_LINE_HEIGHT = scale(16)

// Shared with the rail skeleton so loading and content occupy the same box.
export const DEAL_CARD = Object.freeze({
  width: scale(150),
  height: CARD_INSET + IMAGE_HEIGHT + TITLE_LINE_HEIGHT * 2 + scale(44),
  radius: scale(18),
  gap: scale(12),
  headerIcon: scale(36)
})

// Product-card footprint in the framed-tile language of the category rail:
// a section-tinted frame, an inset photo and a solid discount tab bridging
// the photo and the details so the deal reads first.
const DealCard = memo(function DealCard({ product, tone, tokens, onPress }) {
  const { t } = useTranslation()
  const client = useApolloClient()
  const configuration = useContext(ConfigurationContext)
  const currencySymbol = configuration?.currencySymbol || ''
  const themed = useMemo(() => createThemedStyles(tokens, tone), [tokens, tone])

  rememberCategoryProduct(product)

  const variation = getFirstAvailableVariation(product?.variations) || product?.variations?.[0]
  const isOutOfStock = isProductOutOfStock(product)
  const { finalPrice, discountAmount } = getDealPricing(variation?.price, variation?.deal)
  const dealLabel = discountAmount > 0 ? getDealLabel(variation?.deal, currencySymbol) : null
  const uri = typeof product?.image === 'string' ? normalizeSingleVendorMediaUrl(product.image) : null

  // Same prefetch as ProductCard so ProductDetails opens from a warm cache.
  const handlePress = () => {
    const foodId = product?.id
    if (!foodId) return
    setProductPreview(product)
    const ignore = () => {}
    client.query({ query: GET_FOOD_DETAILS, variables: product?.categoryId ? { foodId, categoryId: product.categoryId } : { foodId }, fetchPolicy: 'network-only' }).catch(ignore)
    client.query({ query: GET_SIMILAR_FOODS, variables: { foodId, skip: 0, limit: 10 }, fetchPolicy: 'network-only' }).catch(ignore)
    onPress?.(foodId, product?.categoryId)
  }

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityLabel={[
        product?.title,
        dealLabel,
        isOutOfStock ? t('out_of_stock_label', { defaultValue: 'Out of stock' }) : null
      ].filter(Boolean).join(', ')}
      onPress={handlePress}
      style={({ pressed }) => [themed.card, pressed && styles.cardPressed]}
    >
      <View style={themed.imageWrap}>
        {uri
          ? <Image source={{ uri }} style={[styles.image, isOutOfStock && styles.imageMuted]} resizeMode='cover' fadeDuration={150} />
          : <Ionicons name='pricetag-outline' size={scale(28)} color={tone.foreground} />}

        {isOutOfStock && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText} numberOfLines={1}>{t('out_of_stock_label', { defaultValue: 'Out of stock' })}</Text>
          </View>
        )}

        <CartQuantityController
          foodId={product?.id}
          categoryId={product?.categoryId}
          variationId={variation?.id}
          addons={[]}
          defaultQuantity={0}
          collapsedWhenZero
          variant='overlay'
          isOutOfStock={isOutOfStock}
          product={product}
        />
      </View>

      {!!dealLabel && !isOutOfStock && (
        <View style={themed.dealTab}>
          <Ionicons name={tone.icon} size={scale(11)} color={tone.onAccent} />
          <Text style={themed.dealTabText} numberOfLines={1}>{dealLabel}</Text>
        </View>
      )}

      <View style={styles.body}>
        <Text style={themed.title} numberOfLines={2}>{product?.title}</Text>
        <View style={styles.priceRow}>
          <Text style={themed.finalPrice} numberOfLines={1}>
            {finalPrice} {currencySymbol}
          </Text>
          {discountAmount > 0 && (
            <Text style={themed.originalPrice} numberOfLines={1}>
              {variation?.price} {currencySymbol}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  )
})

const createThemedStyles = (tokens, tone) => {
  const { colors } = tokens

  return StyleSheet.create({
    card: {
      width: DEAL_CARD.width,
      height: DEAL_CARD.height,
      padding: CARD_INSET,
      borderRadius: DEAL_CARD.radius,
      backgroundColor: tone.frame || tone.subtle,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
      overflow: 'hidden'
    },
    imageWrap: {
      height: IMAGE_HEIGHT,
      borderRadius: DEAL_CARD.radius - CARD_INSET,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center'
    },
    // Sits on the photo's bottom edge, half over the image, half over the frame.
    dealTab: {
      position: 'absolute',
      top: CARD_INSET + IMAGE_HEIGHT - scale(12),
      left: scale(12),
      maxWidth: DEAL_CARD.width - scale(24),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4),
      height: scale(22),
      paddingHorizontal: scale(9),
      borderRadius: 999,
      backgroundColor: tone.accent,
      borderWidth: 2,
      borderColor: tone.frame || tone.subtle,
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2
    },
    dealTabText: {
      color: tone.onAccent,
      fontSize: scale(10.5),
      fontWeight: '800',
      letterSpacing: 0.3
    },
    title: {
      minHeight: TITLE_LINE_HEIGHT * 2,
      color: colors.textPrimary,
      fontSize: scale(12.5),
      lineHeight: TITLE_LINE_HEIGHT,
      fontWeight: '600',
      letterSpacing: -0.1
    },
    finalPrice: {
      color: tone.foreground,
      fontSize: scale(15),
      fontWeight: '800',
      fontVariant: ['tabular-nums']
    },
    originalPrice: {
      flexShrink: 1,
      color: colors.textMuted,
      fontSize: scale(11.5),
      textDecorationLine: 'line-through',
      fontVariant: ['tabular-nums']
    }
  })
}

const styles = StyleSheet.create({
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.94
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageMuted: {
    opacity: 0.5
  },
  soldOut: {
    position: 'absolute',
    left: scale(6),
    right: scale(6),
    bottom: scale(6),
    paddingVertical: scale(4),
    borderRadius: scale(8),
    alignItems: 'center',
    backgroundColor: 'rgba(21, 25, 20, 0.9)'
  },
  soldOutText: {
    color: '#FFFFFF',
    fontSize: scale(10.5),
    fontWeight: '700'
  },
  body: {
    flex: 1,
    paddingTop: scale(16),
    paddingHorizontal: scale(5),
    paddingBottom: scale(3),
    justifyContent: 'space-between'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: scale(6)
  }
})

export default DealCard
