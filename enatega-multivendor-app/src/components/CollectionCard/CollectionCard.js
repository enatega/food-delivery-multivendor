import React, { useContext, useMemo } from 'react'
import { View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import Ripple from 'react-native-material-ripple'
import { IMAGE_LINK } from '../../utils/constants'
import ShimmerImage from '../ShimmerImage/ShimmerImage'

const CollectionCard = ({ onPress, image, name }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const normalizedImage = useMemo(() => {
    const raw = image || IMAGE_LINK
    return raw?.split('#')[0] || IMAGE_LINK
  }, [image])

  return (
    <Ripple
      activeOpacity={0.8}
      onPress={onPress}
      style={styles(currentTheme).collectionCard}
      rippleColor={'#F5F5F5'}
      rippleContainerBorderRadius={8}
      rippleDuration={300}
    >
      <View style={styles().brandImgContainer}>
        <ShimmerImage
          imageUrl={normalizedImage}
          style={styles().collectionImage}
          resizeMode='cover'
          defaultSource={{ uri: IMAGE_LINK }}
        />
      </View>
      <TextDefault
        Normal
        bolder
        style={{ padding: 8 }}
        textColor={currentTheme.gray700}
        isRTL
      >
        {name}
      </TextDefault>
    </Ripple>
  )
}

export default React.memo(CollectionCard)
