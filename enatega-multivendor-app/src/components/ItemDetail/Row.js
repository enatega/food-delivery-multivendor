import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { scale } from '../../utils/scaling'
import TextDefault from '../Text/TextDefault/TextDefault'
import { AntDesign } from '@expo/vector-icons'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { styles as getStyles } from './styles'

export default function Row() {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const styles = getStyles(currentTheme)
  return (
    <View style={{ flexDirection: 'row', marginBottom: scale(10) }}>
      <View leftContainer >
        <Image style={styles.image} source={{ uri: 'https://res.cloudinary.com/do1ia4vzf/image/upload/v1684301051/food/neq1naiaawtemnnig4pb.jpg' }}/>
      </View>
      <View mainContainer style={{ flex: 3, alignSelf: 'center', alignContent: 'center', marginLeft: scale(5) }}>
        <TextDefault bolder small style={{ marginBottom: scale(10) }}>Sprite</TextDefault>
        <TextDefault bolder small>$3</TextDefault>
      </View>
      <View rightContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionContainerBtns}
          // onPress={props.addQuantity}
        >
          <AntDesign name="plus" size={scale(10)} color={currentTheme.white} />
        </TouchableOpacity>
      </View>

    </View>
  )
}
