import React from 'react'
import { ImageBackground } from 'react-native'
import styles from './styles'
import { scale } from '../../../utils/scaling'

function ImageHeader(props) {
  return (
    <ImageBackground
      style={styles.backgroundImage}
      borderRadius={scale(12)}
      resizeMode="cover"
      source={{ uri: props.image }}
      defaultSource={require('../../../assets/images/food_placeholder.png')}
    />
  )
}

export default ImageHeader
