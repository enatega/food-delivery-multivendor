import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import styles from './styles'
import { scale } from '../../../utils/scaling'
import { IMAGE_LINK } from '../../../utils/constants'
import { useCachedMediaUri } from '../../../utils/mediaCache'

function ImageHeader(props) {
  const imageUri = useCachedMediaUri(props?.image, 'image')

  return (
    <ImageBackground
      style={styles.backgroundImage}
      borderRadius={scale(12)}
      resizeMode="cover"
      source={{ uri: imageUri }}
      defaultSource={require('../../../assets/images/food_placeholder.png')}
    />
  )
}

export default ImageHeader
