import { View } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'

export const PriceRow = ({ theme, title, currency, price }) => {
  return (
    <View style={styles.priceRow}>
      <TextDefault H4 textColor={theme.gray900} bolder>
        {title}
      </TextDefault>
      <TextDefault H4 textColor={theme.gray900} bolder>
        {currency} {price}
      </TextDefault>
    </View>
  )
}
