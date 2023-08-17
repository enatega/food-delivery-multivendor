import React from 'react'
import { ImageBackground, Text } from 'react-native'
import styles from './styles'

function ImageHeader(props) {
  return (
    <ImageBackground
      style={styles.backgroundImage}
      borderBottomLeftRadius={25}
      borderBottomRightRadius={25}
      resizeMode="cover"
      source={{ uri: props.image }}
      
      defaultSource={require('../../../assets/images/food_placeholder.png')}>
      </ImageBackground>
  )
}

export default ImageHeader
