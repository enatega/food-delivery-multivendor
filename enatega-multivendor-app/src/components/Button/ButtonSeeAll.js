import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextDefault from '../Text/TextDefault/TextDefault'
import styles from './styles'

export default function ButtonSeeAll({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.seeAllButton}>
      <TextDefault style={styles.seeAllText} bolder>
        See All
      </TextDefault>
    </TouchableOpacity>
  )
}