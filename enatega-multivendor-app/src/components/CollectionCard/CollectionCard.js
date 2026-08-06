import React, { useMemo } from 'react'
import { View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import useMultivendorTheme from '../../ui/designSystem/useMultivendorTheme'
import styles from './styles'
import Ripple from 'react-native-material-ripple'
import { IMAGE_LINK } from '../../utils/constants'
import ShimmerImage from '../ShimmerImage/ShimmerImage'

const CollectionCard = ({ onPress, image, name, selected = false }) => {
  const { tokens } = useMultivendorTheme()
  const normalizedImage = useMemo(() => {
    const raw = image || IMAGE_LINK
    return raw?.split('#')[0] || IMAGE_LINK
  }, [image])

  return (
    <Ripple
      activeOpacity={0.8}
      onPress={onPress}
      style={styles(tokens).collectionCard}
      rippleColor={'#F5F5F5'}
      rippleContainerBorderRadius={tokens.radii.tile}
      rippleDuration={300}
    >
      <View style={[
        styles(tokens).brandImgContainer,
        selected && styles(tokens).selectedImageContainer
      ]}>
        <ShimmerImage
          imageUrl={normalizedImage}
          style={styles(tokens).collectionImage}
          resizeMode='cover'
          defaultSource={{ uri: IMAGE_LINK }}
        />
      </View>
      <TextDefault
        style={styles(tokens).label}
        textColor={selected ? tokens.colors.accent : tokens.colors.textPrimary}
        isRTL
        numberOfLines={2}
        ellipsizeMode='tail'
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {name}
      </TextDefault>
    </Ripple>
  )
}

export default React.memo(CollectionCard)
