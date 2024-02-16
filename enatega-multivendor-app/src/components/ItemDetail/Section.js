import { View } from 'react-native'
import React from 'react'
import TextDefault from '../Text/TextDefault/TextDefault'
import Row from './Row'
import { scale } from '../../utils/scaling'

const Section = () => {
  return (
    <View style={{ margin: 10 }}>
      <View style={{ marginBottom: scale(15) }}>
        <TextDefault H4 bolder>Frequently Bought Together</TextDefault>
      </View>

      <View >
        <Row/>
        <Row/>
        <Row/>
      </View>
    </View>
  )
}
export default Section
