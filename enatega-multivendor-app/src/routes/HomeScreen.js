import React from 'react'
import { View } from 'react-native'
import TextDefault from '../components/Text/TextDefault/TextDefault'

function HomeScreen() {
  return (
    <View style={{backgroundColor: 'green', flex: 1}}>
        <TextDefault>Home Screen</TextDefault>
    </View>
  )
}

export default HomeScreen