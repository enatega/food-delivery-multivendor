import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import TextDefault from '../components/Text/TextDefault/TextDefault'

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1}}>
        <TextDefault>Home Screen</TextDefault>
        <TouchableOpacity onPress={() => navigation.navigate('Shared')}>
        <TextDefault>Go to shared</TextDefault>
        </TouchableOpacity>
    </View>
  )
}

export default HomeScreen