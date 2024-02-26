import React from 'react'
import { TouchableOpacity } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import styles from './styles'

export const CancelButton = ({ onPress, theme }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cancelButtonContainer(theme)}>
      <TextDefault style={{ ...alignment.Pmedium }} textColor={theme.red600} bold>Cancel Order</TextDefault>
    </TouchableOpacity>
  )
}
