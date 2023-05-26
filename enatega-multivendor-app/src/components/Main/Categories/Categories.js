import React from 'react'
import { View, Image } from 'react-native'
import TextDefault from '../../Text/TextDefault/TextDefault'
import Burger from '../../../assets/images/burger.png'
import SeaFood from '../../../assets/images/seafood.png'
import Desert from '../../../assets/images/desert.png'
import Desi from '../../../assets/images/desi.png'

import styles from './styles'

export default function Categories() {
  return (
    <View style={styles().categoryContainer}>
      <View style={styles().header}>
        <TextDefault textColor="white" bolder H4>
          Categories
        </TextDefault>
        <TextDefault textColor="white" bold H6>
          See All
        </TextDefault>
      </View>
      <View style={styles().options}>
        <CategoryOption name={'fast food'} image={Burger} />
        <CategoryOption name={'sea food'} image={SeaFood} />
        <CategoryOption name={'desi food'} image={Desi} />
        <CategoryOption name={'dessert'} image={Desert} />
      </View>
    </View>
  )
}
function CategoryOption({ name, image }) {
  return (
    <View style={styles().boxContainer}>
      <View style={styles().box}>
        <Image source={image} />
      </View>
      <View style={styles().label}>
        <TextDefault textColor="white" bold H6>
          {name}
        </TextDefault>
      </View>
    </View>
  )
}
