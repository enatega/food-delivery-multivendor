import React from 'react'
import { Pressable } from 'react-native'
import styles from './styles'
import { Icon } from 'react-native-elements'

export default function BackButton({ navigation }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.goBack()
      }}>
      <Icon name="chevron-left" type="font-awesome" color="white" size={20} />
    </Pressable>
  )
}
