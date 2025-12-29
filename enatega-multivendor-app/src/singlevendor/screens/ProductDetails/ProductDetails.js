import { View, Text, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
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

const ProductDetails = ({ route }) => {
  const { productId } = route?.params
  const { t, loading, currentTheme, productInfoData, productOtherDetails } = useProductDetails({ foodId: productId })
  const navigation = useNavigation()

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

  return (
    <ScrollView style={{ backgroundColor: currentTheme.themeBackground, minHeight: '100%'}} contentContainerStyle={{ paddingBottom: 20 }}>
      {loading ? (
        <ProductDetailsLoader />
      ) : (
        <View style={{ gap: 10 }}>
          <ProductInfo t={t} productInfoData={productInfoData} currentTheme={currentTheme} />
          <WrapperProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails} />
        </View>
      )}
      <SimilarProducts id={productId} />
    </ScrollView>
  )
}

export default ProductDetails
