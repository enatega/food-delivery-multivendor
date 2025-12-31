import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
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

const ProductDetails = ({ route }) => {
  const { productId } = route?.params
  const { t, loading, currentTheme, productInfoData, productOtherDetails } = useProductDetails({ foodId: productId })
  const navigation = useNavigation()

  const variations = productInfoData.variations || []
  console.log('productInfoData', variations)
  const [selectedVariationId, setSelectedVariationId] = useState(variations?.length ? [variations[0].id] : [])
  const [selectedAddonIds, setSelectedAddonIds] = useState([])
  const [totalPrice, setTotalPrice] = useState(variations?.[0]?.price || 0)
  const selectedVariation = variations?.find((v) => v.id === selectedVariationId[0])
  console.log("totalPrice:",totalPrice)

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
          <Addons selectedVariation={selectedVariation} selectedAddonIds={selectedAddonIds} setSelectedAddonIds={setSelectedAddonIds} />
        </View>
      )}
      <SimilarProducts id={productId} />
    </ScrollView>
  )
}

export default ProductDetails
