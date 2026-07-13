import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const MainImage = () => {
  return (
    <View style={styles().imageContainer}>
      <Image source={require('../../assets/images/user-onboarding.png')} style={styles().image} />
    </View>
  )
}

const styles = () =>
  StyleSheet.create({
    imageContainer: {      
      height: scale(320),
      width: scale(320)
    },
    image: {
      alignSelf: 'center',
      resizeMode: 'contain',
      height: '100%',
      width: '100%'
    }
  })

export default MainImage
