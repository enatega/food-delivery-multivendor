import React from 'react'
import { ImageBackground } from 'react-native'
import styles from './styles'
import { scale } from '../../../utils/scaling'
import { useCachedMediaUri } from '../../../utils/mediaCache'

function ImageHeader(props) {
  const imageUri = useCachedMediaUri(props?.image, 'image')

  return (
    <ImageBackground
      style={[styles.backgroundImage, props?.style]}
      borderRadius={scale(12)}
      resizeMode="cover"
      source={{ uri: imageUri }}
      defaultSource={require('../../../assets/images/food_placeholder.png')}
    />
  )
}

export default ImageHeader
