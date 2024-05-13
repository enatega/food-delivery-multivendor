import React, { useContext } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'

const CollectionCard = ({ onPress, image, name }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles(currentTheme).collectionCard}
    >
      <View style={styles().brandImgContainer}>
        <Image
          source={{ uri: image }}
          style={styles().collectionImage}
          resizeMode='cover'
        />
      </View>
      <TextDefault
        Normal
        bolder
        style={{ padding: 8 }}
        textColor={currentTheme.gray700}
      >
        {name}
      </TextDefault>
    </TouchableOpacity>
  )
}

export default CollectionCard
