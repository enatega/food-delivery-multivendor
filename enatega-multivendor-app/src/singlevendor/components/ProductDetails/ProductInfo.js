import { Image, StyleSheet, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { scale } from '../../../utils/scaling'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ConfigurationContext from '../../../context/Configuration'
import ToggleFavorite from '../ToggleFavorite'
import CartQuantityController from '../Cart/CartQuantityController'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import useAddToCart from '../../screens/ProductDetails/useAddToCart'
import useCartStore from '../../stores/useCartStore'
import { normalizeSingleVendorMediaUrl } from '../../../utils/mediaUrl'
import { getDealLabel } from '../../utils/helper'
import { getFirstAvailableVariation, isProductOutOfStock, isVariationOutOfStock } from '../../utils/stock'

const ProductInfo = ({ t, productInfoData, currentTheme, selectedVariationId, selectedAddons, editMode = false, onSaveEdit, editingCart = false }) => {
  const config = useContext(ConfigurationContext)

  // Todo: temp states for handling fav and item count
  console.log('productInfoData', productInfoData)
  const items = useCartStore((state) => state.items)
  const { addItemToCart, updateUserCartLoading } = useAddToCart({ foodId: productInfoData?.id })

  const firstAvailableVariation = getFirstAvailableVariation(productInfoData?.variations)
  const selectedVariation = selectedVariationId || firstAvailableVariation?.id || productInfoData?.variations?.[0]?.id
  const isInCart = useMemo(() => {
    const foodId = productInfoData?.id
    if (!foodId || !selectedVariation || !Array.isArray(items)) return false
    const cartItem = items.find((item) => item?.foodId === foodId)
    if (!cartItem?.variations) return false
    return cartItem.variations.some((v) => v?.variationId === selectedVariation || v?._id === selectedVariation)
  }, [items, productInfoData?.id, selectedVariation])

  const selectedVariationData = productInfoData?.variations?.find((variation) => variation?.id === selectedVariation) || productInfoData?.variations?.[0]
  const actualPrice = Number(productInfoData?.originalPrice ?? productInfoData?.price ?? 0)
  const discountPrice = Number(productInfoData?.discountedPrice ?? selectedVariationData?.discountedUnitPrice ?? actualPrice)
  const dealLabel = getDealLabel(selectedVariationData?.deal, config?.currencySymbol)
  const hasDeal = discountPrice < actualPrice
  const isOutOfStock = isProductOutOfStock(productInfoData) || isVariationOutOfStock(selectedVariationData)

  return (
    <>
      <View style={styles().imageContainer}>
        <Image source={{ uri: normalizeSingleVendorMediaUrl(productInfoData?.image) }} style={styles().image} />
        {hasDeal && dealLabel && (
          <View style={styles(currentTheme).dealBadge}>
            <TextDefault bold textColor={currentTheme.singleVendorOnBrand}>
              {dealLabel}
            </TextDefault>
          </View>
        )}
        {isOutOfStock && (
          <View style={styles(currentTheme).outOfStockBadge}>
            <TextDefault bold textColor='#FFFFFF'>
              {t('out_of_stock_label', { defaultValue: 'Out of stock' })}
            </TextDefault>
          </View>
        )}
      </View>

      <View style={[styles().containerPadding, { gap: 18 }]}>
        <View style={styles().titleContainer}>
          <TextDefault bolder H2 numberOfLines={3} style={{ flexShrink: 1, flex: 1, paddingRight: 8 }}>
            {productInfoData?.title}
          </TextDefault>
          <ToggleFavorite id={productInfoData?.id} />
        </View>

        <View style={[styles().priceRow, { alignItems: 'center' }]}>
          <View style={styles().priceLeft}>
            <View style={[styles().flex, { alignItems: 'center', gap: 12 }]}>
              {hasDeal
                ? (
                <>
                  <TextDefault style={styles(currentTheme).finalPrice} H4 bolder textColor={currentTheme.singleVendorBrandForeground}>
                    {config?.currencySymbol}
                    {'\u00A0'}
                    {discountPrice}
                  </TextDefault>
                  <TextDefault style={styles(currentTheme).originalPrice} H4 bolder textColor={currentTheme.fontSecondColor}>
                    {config?.currencySymbol}
                    {'\u00A0'}
                    {actualPrice}
                  </TextDefault>
                </>
                  )
                : (
                <TextDefault H4 bolder textColor={currentTheme.fontSecondColor}>
                  {config?.currencySymbol}
                  {'\u00A0'}
                  {productInfoData?.price}
                </TextDefault>
                  )}
            </View>
            {productInfoData?.isPopular && (
              <View style={[styles(currentTheme).popular, styles().flexCenter]}>
                <MaterialCommunityIcons name='fire' size={18} color={currentTheme.white} />
                <TextDefault H5 bold textColor={currentTheme.white}>
                  {t('Popular')}
                </TextDefault>
              </View>
            )}
          </View>

          <View style={styles().priceRight}>
            {editMode
              ? (
              <View style={{ alignItems: 'flex-end', minWidth: 130 }}>
                <ContinueWithPhoneButton containerStyles={{ minWidth: 130 }} textStyle={{ paddingHorizontal: 8 }} isLoading={editingCart} isDisabled={editingCart || isOutOfStock} title='Save changes' onPress={onSaveEdit} />
              </View>
                )
              : isInCart
                ? (
              <CartQuantityController foodId={productInfoData?.id} categoryId={productInfoData?.categoryId} variationId={selectedVariation} addons={selectedAddons || []} defaultQuantity={1} variant='details' isOutOfStock={isOutOfStock} />
                  )
                : (
              <View style={{ alignItems: 'flex-end', minWidth: 130 }}>
                <ContinueWithPhoneButton
                  containerStyles={{ minWidth: 130 }}
                  textStyle={{ paddingHorizontal: 8 }}
                  isLoading={updateUserCartLoading}
                  isDisabled={updateUserCartLoading || isOutOfStock}
                  title={isOutOfStock ? 'out_of_stock_label' : 'addToCart'}
                  onPress={() => {
                    if (!isOutOfStock) addItemToCart(productInfoData?.id, productInfoData?.categoryId, selectedVariation, selectedAddons || [], 1)
                  }}
                />
              </View>
                  )}
          </View>
        </View>
      </View>
    </>
  )
}

export default ProductInfo

const styles = (props = null) =>
  StyleSheet.create({
    containerPadding: {
      paddingHorizontal: 15
    },
    flex: {
      display: 'flex',
      flexDirection: 'row'
    },
    flexCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    priceRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    priceLeft: {
      flex: 1,
      gap: 10
    },
    priceRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginLeft: 12
    },
    imageContainer: {
      height: 300,
      width: '100%',
      borderTopLeftRadius: scale(10),
      borderTopRightRadius: scale(10),
      overflow: 'hidden'
    },
    image: {
      height: '100%',
      width: '100%'
    },
    titleContainer: {
      width: '100%',
      paddingTop: 12,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    popular: {
      backgroundColor: props !== null ? props?.singleVendorBrand : '#90E36D',
      minWidth: 80,
      maxWidth: 120,
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 6
    },
    finalPrice: {
      color: props?.singleVendorBrandForeground
    },

    originalPrice: {
      color: props?.fontSecondColor,
      textDecorationLine: 'line-through'
    },
    dealBadge: {
      position: 'absolute',
      top: scale(12),
      left: scale(12),
      backgroundColor: props?.singleVendorBrand,
      borderRadius: scale(6),
      paddingHorizontal: scale(10),
      paddingVertical: scale(6)
    },
    outOfStockBadge: {
      position: 'absolute',
      left: scale(12),
      right: scale(12),
      bottom: scale(12),
      borderRadius: scale(6),
      paddingHorizontal: scale(10),
      paddingVertical: scale(8),
      alignItems: 'center',
      backgroundColor: 'rgba(21, 25, 20, 0.9)'
    }
  })
