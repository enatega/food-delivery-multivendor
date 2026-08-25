import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import useProductDetails from './useProductDetails'
import { useNavigation } from '@react-navigation/native'
import screenOptions from './screenOptions'
import ProductInfo from '../../components/ProductDetails/ProductInfo'
import SimilarProducts from '../../components/ProductDetails/SimilarProducts'
import ProductDetailsLoader from '../../components/ProductDetails/ProductDetailsLoader'
import WrapperProductOtherDetails from '../../components/ProductDetails/WrapperProductOtherDetails'
import Addons from './Addons'
import Variations from './Variations'
import useAddToCart from './useAddToCart'
import FloatingCartButton from '../../components/Cart/FloatingCartButton'
import { EDIT_SINGLE_VENDOR_CART_ITEM } from '../../apollo/mutations'
import useCartStore from '../../stores/useCartStore'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { getDealPricing } from '../../utils/helper'
import { getFirstAvailableVariation } from '../../utils/stock'

const ProductDetails = ({ route }) => {
  const { productId, categoryId, editCartItem } = route?.params
  const editVariation = editCartItem?.variations?.[0]
  const { loading, productInfoData, productOtherDetails } = useProductDetails({ foodId: productId, categoryId })
  const { t, currentTheme } = useAddToCart({ foodId: productId })
  const navigation = useNavigation()

  const variations = productInfoData?.variations || []
  const [selectedVariationId, setSelectedVariationId] = useState(
    // productInfoData?.selectedVariations?.length > 0 ? productInfoData?.selectedVariations :
    variations?.length ? [variations[0]?.id] : []
  )
  const [selectedAddonIds, setSelectedAddonIds] = useState([])
  const [totalPrice, setTotalPrice] = useState(variations?.[0]?.price || 0)
  const [originalTotalPrice, setOriginalTotalPrice] = useState(variations?.[0]?.price || 0)
  const [quantity, setQuantity] = useState(editVariation?.quantity || 1)
  const [specialInstructions, setSpecialInstructions] = useState(editVariation?.specialInstructions || '')
  const selectedAddonsRef = useRef([])
  const cartRevision = useCartStore((state) => state.cartRevision)
  const setCartFromServer = useCartStore((state) => state.setCartFromServer)
  const selectedVariation = variations?.find((v) => v.id === selectedVariationId[0])

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        currentTheme,
        navigation,
        headerRight: null
      })
    )
  }, [navigation])

  useEffect(() => {
    if (!variations?.length) return
    const availableVariation = getFirstAvailableVariation(variations)
    const variationId = editVariation?.variationId || availableVariation?.id || variations[0]?.id
    setSelectedVariationId([variationId])
    if (editVariation) {
      const addonGroups = (editVariation.addons || []).map((addon) => ({
        _id: addon.addonId,
        options: addon.optionId || []
      }))
      selectedAddonsRef.current = addonGroups
      setSelectedAddonIds(addonGroups.flatMap((addon) => addon.options))
    }
  }, [variations, editVariation?.variationId])

  const [editCartItemMutation, { loading: editingCart }] = useMutation(EDIT_SINGLE_VENDOR_CART_ITEM, {
    onCompleted: ({ editSingleVendorCartItem: response }) => {
      if (!response?.success) {
        Alert.alert(t('Error'), response?.message || t('cartUpdateFailed', { defaultValue: 'Unable to update this cart item.' }))
        return
      }
      setCartFromServer({
        cartId: response.cartId,
        cartRevision: response.cartRevision,
        foods: response.foods,
        grandTotal: response.discountedGrandTotal,
        maxOrderAmount: response.maxOrderAmount,
        minOrderAmount: response.minOrderAmount,
        isBelowMinimumOrder: response.isBelowMinimumOrder,
        lowOrderFees: response.lowOrderFees
      })
      navigation.goBack()
    },
    onError: (error) => Alert.alert(t('Error'), error.message)
  })

  const saveCartEdit = () =>
    editCartItemMutation({
      variables: {
        input: {
          cartItemId: editVariation?._id,
          foodId: productId,
          categoryId,
          variationId: selectedVariationId[0],
          addons: selectedAddonsRef.current,
          quantity,
          specialInstructions,
          expectedCartRevision: cartRevision
        }
      }
    })

  // useEffect(() => {
  //   console.log('selectedAddons::', selectedAddons)
  //   if (selectedAddons.length > 0) {
  //     const optionIds = []
  //     const optionIdsRef = []
  //     selectedAddons.map((addOn) => {
  //       optionIdsRef.push({
  //         _id: addOn._id,
  //         options: addOn.options
  //       })
  //       addOn.options.map((opt) => {
  //         optionIds.push(opt)
  //       })
  //     })

  //     // for (let i = 0; i < selectedAddons.length - 1; i++) {
  //     //   for (let j = 0; j < selectedAddons[i].options - 1; j++) {
  //     //     optionIds.push(selectedAddons[i].options[j])
  //     //   }
  //     // }
  //     selectedAddonsRef.current = optionIdsRef
  //     setSelectedAddonIds(optionIds)
  //     console.log('selected addon Ids:', optionIds, optionIdsRef)
  //   }

  //   return () => {}
  // }, [selectedAddons])

  useEffect(() => {
    if (!selectedVariation) return
    const { finalPrice } = getDealPricing(selectedVariation.price, selectedVariation.deal)
    let price = finalPrice
    let originalPrice = Number(selectedVariation.price) || 0
    selectedVariation?.addons?.forEach((addonGroup) => {
      addonGroup.options.forEach((option) => {
        if (selectedAddonIds.includes(option.id)) {
          price += option.price || 0
          originalPrice += option.price || 0
        }
      })
    })
    setTotalPrice(price)
    setOriginalTotalPrice(originalPrice)
  }, [selectedVariationId, selectedAddonIds])

  return (
    <>
      <ScrollView style={{ backgroundColor: currentTheme.themeBackground, minHeight: '100%' }} contentContainerStyle={{ paddingBottom: 20 }}>
        {loading && <ProductDetailsLoader />}
        {!loading && (
          <View style={{ gap: 10 }}>
            <ProductInfo
              t={t}
              productInfoData={{
                ...productInfoData,
                price: originalTotalPrice,
                originalPrice: originalTotalPrice,
                discountedPrice: totalPrice
              }}
              currentTheme={currentTheme}
              selectedVariationId={selectedVariationId[0]}
              selectedAddons={selectedAddonsRef?.current}
              editMode={!!editVariation}
              onSaveEdit={saveCartEdit}
              editingCart={editingCart}
            />
            <WrapperProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails} />
            <Variations
              t={t}
              variations={variations}
              selectedVariationId={selectedVariationId}
              setSelectedVariationId={(ids) => {
                setSelectedVariationId(ids)
                setSelectedAddonIds([])
              }}
              setSelectedAddonIds={setSelectedAddonIds}
            />
            <Addons
              selectedVariation={selectedVariation}
              selectedAddonIds={selectedAddonIds}
              setSelectedAddonIds={(value, optionId, addonId) => {
                setSelectedAddonIds(value)

                let updatedSelectedAddons = selectedAddonsRef.current.map((addon) => ({
                  _id: addon._id,
                  options: [...addon.options] // 👈 deep copy options
                }))

                if (value.includes(optionId)) {
                  const index = updatedSelectedAddons.findIndex((a) => a._id === addonId)

                  if (index !== -1) {
                    updatedSelectedAddons[index] = {
                      ...updatedSelectedAddons[index],
                      options: [...updatedSelectedAddons[index].options, optionId]
                    }
                  } else {
                    updatedSelectedAddons.push({
                      _id: addonId,
                      options: [optionId]
                    })
                  }
                } else {
                  updatedSelectedAddons = updatedSelectedAddons.map((addon) => (addon._id === addonId ? { ...addon, options: addon.options.filter((id) => id !== optionId) } : addon)).filter((addon) => addon.options.length > 0)
                }

                selectedAddonsRef.current = updatedSelectedAddons
              }}
            />
            {!!editVariation && (
              <View style={{ paddingHorizontal: 15, gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TextDefault bold>{t('Quantity')}</TextDefault>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity accessibilityLabel={t('Decrease quantity')} onPress={() => setQuantity((value) => Math.max(1, value - 1))}>
                      <TextDefault H3 textColor={currentTheme.singleVendorBrandForeground}>
                        −
                      </TextDefault>
                    </TouchableOpacity>
                    <TextDefault bold>{quantity}</TextDefault>
                    <TouchableOpacity accessibilityLabel={t('Increase quantity')} onPress={() => setQuantity((value) => value + 1)}>
                      <TextDefault H3 textColor={currentTheme.singleVendorBrandForeground}>
                        +
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput value={specialInstructions} onChangeText={setSpecialInstructions} maxLength={500} multiline placeholder={t('itemInstructions', { defaultValue: 'Instructions for this item' })} placeholderTextColor={currentTheme.fontSecondColor} style={{ minHeight: 72, borderWidth: 1, borderColor: currentTheme.singleVendorBorder, borderRadius: 8, padding: 12, color: currentTheme.fontMainColor, textAlignVertical: 'top' }} />
              </View>
            )}
            {/* <NutritionFactsSection
              t={t}
              currentTheme={currentTheme}
              nutritionDetail={productInfoData?.nutritionDetail}
              nutritions={productInfoData?.nutritions}
              usage={productInfoData?.usage}
              ingredients={productInfoData?.ingredients}
            /> */}
          </View>
        )}
        <SimilarProducts id={productId} />
      </ScrollView>
      <FloatingCartButton />
    </>
  )
}

export default ProductDetails
