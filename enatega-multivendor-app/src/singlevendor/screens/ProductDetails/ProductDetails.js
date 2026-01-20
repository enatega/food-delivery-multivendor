import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './Styles'
import useProductDetails from './useProductDetails'
import useGetSimilarFoods from './useGetSimilarFoods'
import { useNavigation } from '@react-navigation/native'
import screenOptions from './screenOptions'
import ProductInfo from '../../components/ProductDetails/ProductInfo'
import SimilarProducts from '../../components/ProductDetails/SimilarProducts'
import ProductOtherDetails from '../../components/ProductDetails/ProductOtherDetails'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import ProductDetailsLoader from '../../components/ProductDetails/ProductDetailsLoader'
import WrapperProductOtherDetails from '../../components/ProductDetails/WrapperProductOtherDetails'
import Addons from './Addons'
import Variations from './Variations'
import OptionList from './OptionsList'
import useAddToCart from './useAddToCart'

const ProductDetails = ({ route }) => {
  const { productId } = route?.params
  const {  loading, productInfoData, productOtherDetails } = useProductDetails({ foodId: productId })
  const {t,currentTheme,addItemToCart,updateUserCartLoading} = useAddToCart({foodId: productId})
  const navigation = useNavigation()

  const variations = productInfoData.variations || []
  const selectedAddons = productInfoData.selectedAddons || []
  console.log('productInfoData', variations)
  const [selectedVariationId, setSelectedVariationId] = useState(
    // productInfoData?.selectedVariations?.length > 0 ? productInfoData?.selectedVariations : 
    variations?.length ? [variations[0].id] : [])
  const [selectedAddonIds, setSelectedAddonIds] = useState([])
  const [totalPrice, setTotalPrice] = useState(variations?.[0]?.price || 0)
  const selectedAddonsRef = useRef([])
  const selectedVariation = variations?.find((v) => v.id === selectedVariationId[0])
  console.log('totalPrice:', totalPrice)

  useLayoutEffect(() => {
    navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        currentTheme: currentTheme,
        navigation: navigation,
        headerRight: null
      })
    )
  }, [navigation])

  useEffect(() => {
    if (!variations?.length || selectedVariationId?.length) return
    setSelectedVariationId([variations[0]?.id])
  }, [variations])

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
    let price = selectedVariation.price || 0
    selectedVariation?.addons?.forEach((addonGroup) => {
      addonGroup.options.forEach((option) => {
        if (selectedAddonIds.includes(option.id)) {
          price += option.price || 0
        }
      })
    })
    setTotalPrice(price)
  }, [selectedVariationId, selectedAddonIds])

  const onAddToCart = (itemCount) => {
    addItemToCart(productInfoData?.id, productInfoData?.categoryId, selectedVariationId[0], selectedAddonsRef?.current, itemCount > 0 ? itemCount : null)
  }

  return (
    <ScrollView style={{ backgroundColor: currentTheme.themeBackground, minHeight: '100%' }} contentContainerStyle={{ paddingBottom: 20 }}>
      {loading ? (
        <ProductDetailsLoader />
      ) : (
        <View style={{ gap: 10 }}>
          <ProductInfo
            t={t}
            productInfoData={{
              ...productInfoData,
              price: totalPrice
            }}
            currentTheme={currentTheme}
            onAddToCart={(itemCount) => {
              onAddToCart(itemCount)
            }}
            isAddingToCart={updateUserCartLoading}
          />
          <WrapperProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails} />
          <Variations
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
        </View>
      )}
      <SimilarProducts id={productId} />
    </ScrollView>
  )
}

export default ProductDetails
