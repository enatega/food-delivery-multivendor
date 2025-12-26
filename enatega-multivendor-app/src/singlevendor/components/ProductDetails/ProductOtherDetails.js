import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const ProductOtherDetails = ({t, currentTheme, productOtherDetails}) => {
  return (
    <View style={{ gap: 5, paddingVertical: 12, paddingHorizontal: 15 }}>
      <TextDefault bolder H4>
        {t("Product details")}
      </TextDefault>
      <View style={{ gap: 5 }}>
        <TextDefault H5 bold textColor={currentTheme.colorRextMuted}>
          {productOtherDetails?.description}
        </TextDefault>
        <View style={{ borderWidth: 0.6, borderColor: currentTheme.borderColor }} />
      </View>
    </View>
  )
}

export default ProductOtherDetails
