import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const ProductOtherDetails = ({ t, currentTheme, productOtherDetails, title }) => {
  return (
    <View style={{ gap: 5, paddingVertical: 4, paddingHorizontal: 15 }}>
        <TextDefault bolder={title === "Product details"} bold={title !== "Product details "} H4>
          {t(title)}
        </TextDefault>

      <View style={{ gap: 5, marginTop: 12 }}>
        <TextDefault H5 bold textColor={currentTheme.colorTextMuted}>
          {productOtherDetails}
        </TextDefault>
        <View style={{ borderWidth: 1, borderColor: currentTheme.borderColor, marginTop:16 }} />
      </View>
    </View>
  )
}

export default ProductOtherDetails
