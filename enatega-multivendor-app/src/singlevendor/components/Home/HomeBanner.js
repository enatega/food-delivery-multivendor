import { View, Text, Image } from 'react-native'
import React from 'react'
import styles from './Styles'
import sliderImg1 from '../../assets/images/sliderImg1.png'
const HomeBanner = () => {
  return (
    <View style={styles.sliderContainer}>
      <Image source={sliderImg1} style={styles.image} />
    </View>
  )
}

export default HomeBanner
