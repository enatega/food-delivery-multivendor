import React from 'react'
import { ImageBackground, Text } from 'react-native'
import styles from './styles'
import { scale } from '../../../utils/scaling'

function ImageHeader(props) {
  return (
    <ImageBackground
      style={styles.backgroundImage}
      borderBottomLeftRadius={scale(25)}
      borderBottomRightRadius={scale(25)}
      resizeMode="cover"
      source={{ uri: props.image }}
      defaultSource={require('../../../assets/images/food_placeholder.png')}></ImageBackground>
  )
}

export default ImageHeader
