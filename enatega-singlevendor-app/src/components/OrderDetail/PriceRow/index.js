import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'

export const PriceRow = ({ theme, title, currency, price }) => {
  return (
    <View style={styles.priceRow(theme)}>
      <TextDefault H4 textColor={theme.gray900} bolder isRTL>
        {title}
      </TextDefault>
      <TextDefault H4 textColor={theme.gray900} bolder isRTL>
        {currency} {price}
      </TextDefault>
    </View>
  )
}
