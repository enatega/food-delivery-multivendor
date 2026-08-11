import React from 'react'
import ProductOtherDetails from './ProductOtherDetails'
import NutritionFacts from './NutritionFacts'

const WrapperProductOtherDetails = ({ t, currentTheme, productOtherDetails, title }) => {
  return (
    <>
      {productOtherDetails?.description && <ProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.description} title='Product details' />}
      {productOtherDetails?.ingredients && <ProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.ingredients} title='Ingredients' />}
      {productOtherDetails?.usage && <ProductOtherDetails t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.usage} title='Usage' />}
      {productOtherDetails?.nutritionFacts && <NutritionFacts t={t} currentTheme={currentTheme} productOtherDetails={productOtherDetails?.nutritionFacts} title='Nutrition facts' />}
    </>
  )
}

export default WrapperProductOtherDetails
