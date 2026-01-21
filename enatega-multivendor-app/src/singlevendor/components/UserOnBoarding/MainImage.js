import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const MainImage = () => {
  return <Image source={require('../../assets/images/user-onboarding.png')} style={styles().image} />
}

const styles = () =>
  StyleSheet.create({
    image: {
      alignSelf: 'center',
      resizeMode: 'contain',
      height: scale(370),
      width: scale(370)
    }
  })

export default MainImage
