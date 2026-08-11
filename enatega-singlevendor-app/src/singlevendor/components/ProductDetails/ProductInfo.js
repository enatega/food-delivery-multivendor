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

const ProductInfo = ({ t, productInfoData, currentTheme, selectedVariationId, selectedAddons }) => {
  const config = useContext(ConfigurationContext)

  // Todo: temp states for handling fav and item count
  console.log('productInfoData', productInfoData)
  const items = useCartStore((state) => state.items)
  const { addItemToCart, updateUserCartLoading } = useAddToCart({ foodId: productInfoData?.id })

  const selectedVariation = selectedVariationId || productInfoData?.variations?.[0]?.id
  const isInCart = useMemo(() => {
    const foodId = productInfoData?.id
    if (!foodId || !selectedVariation || !Array.isArray(items)) return false
    const cartItem = items.find((item) => item?.foodId === foodId)
    if (!cartItem?.variations) return false
    return cartItem.variations.some((v) => v?.variationId === selectedVariation || v?._id === selectedVariation)
  }, [items, productInfoData?.id, selectedVariation])

  const actualPrice = productInfoData?.price
  const discountPrice = productInfoData?.variations?.[0].discountedUnitPrice

  console.log('actualUnitPrice', actualPrice)
  console.log('discountedUnitPrice', discountPrice)

  const hasDeal = discountPrice < actualPrice
  console.log('hasDeal', hasDeal)

  return (
    <>
      <View style={styles().imageContainer}>
        <Image source={{ uri: productInfoData?.image }} style={styles().image} />
      </View>

      <View style={[styles().containerPadding, { gap: 18 }]}>
        <View style={styles().titleContainer}>
          <TextDefault bolder H2 numberOfLines={3} style={{ flexShrink: 1, flex: 1, paddingRight: 8}}>
            {productInfoData?.title}
          </TextDefault>
          <ToggleFavorite id={productInfoData?.id} />
        </View>

        <View style={[styles().priceRow, { alignItems: 'center' }]}>
          <View style={styles().priceLeft}>
            <View style={[styles().flex, { alignItems: 'center', gap: 12 }]}>
              {hasDeal ? (
                <>
                  <TextDefault style={styles(currentTheme).finalPrice} H4 bolder textColor={currentTheme.singlevendorcolor}>
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
              ) : (
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
            {isInCart ? (
              <CartQuantityController
                foodId={productInfoData?.id}
                categoryId={productInfoData?.categoryId}
                variationId={selectedVariation}
                addons={selectedAddons || []}
                defaultQuantity={1}
                variant="details"
              />
            ) : (
              <View style={{ alignItems:'flex-end', minWidth: 130 }}>
                <ContinueWithPhoneButton
                containerStyles={{minWidth:130}}
                textStyle={{paddingHorizontal:8}}
                  isLoading={updateUserCartLoading }
                  isDisabled={updateUserCartLoading}
                  title='addToCart'
                  onPress={() => addItemToCart(productInfoData?.id, productInfoData?.categoryId, selectedVariation, selectedAddons || [], 1)}
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
      backgroundColor: props !== null ? props?.primaryBlue : '#0090CD',
      minWidth: 80,
      maxWidth: 120,
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 6
    },
    finalPrice: {
      color: props?.primaryBlue
    },

    originalPrice: {
      color: props?.fontSecondColor,
      textDecorationLine: 'line-through'
    }
  })
