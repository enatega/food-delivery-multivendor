import React from 'react'
import { View } from 'react-native'
import ProductOtherDetails from './ProductOtherDetails'
import NutritionFacts from './NutritionFacts'

const hasValue = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim()))

const WrapperProductOtherDetails = ({ t, currentTheme, productOtherDetails }) => {
  return (
    <View style={{ gap: 8 }}>
      {hasValue(productOtherDetails?.description) && <ProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.description} title='Product details' icon='information-outline' />}
      {hasValue(productOtherDetails?.ingredients) && <ProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.ingredients} title='Ingredients' icon='leaf' variant='chips' />}
      {hasValue(productOtherDetails?.usage) && <ProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.usage} title='Usage' icon='silverware-fork-knife' />}
      {hasValue(productOtherDetails?.nutritionFacts) && <NutritionFacts t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.nutritionFacts} title='Nutrition facts' />}
    </View>
  )
}

export default WrapperProductOtherDetails
