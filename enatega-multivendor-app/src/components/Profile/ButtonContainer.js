import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles.js'
import ThemeContext from '../../ui/ThemeContext/ThemeContext.js'
import { theme } from '../../utils/themeColors.js'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { EvilIcons } from '@expo/vector-icons'
import { verticalScale } from '../../utils/scaling.js'

const ButtonContainer = (props) => {
  console.log('Props', props)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles().container}
        onPress={props.onPress}
      >
        {/* <View style={styles(currentTheme).leftContainer}>
          <props.iconType
            name={props.icon}
            size={verticalScale(15)}
            color={currentTheme.darkBgFont}
          />
        </View> */}
        <View style={styles().rightContainer}>
          <TextDefault
            style={styles().drawerContainer}
            textColor={currentTheme.fontMainColor}
            small
            bold
          >
            {props.title}
          </TextDefault>
        </View>
        {/* <View style={styles(currentTheme).leftContainer}>
          <EvilIcons
            name='chevron-right'
            size={verticalScale(15)}
            color={currentTheme.darkBgFont}
          />
        </View> */}
      </TouchableOpacity>
    </View>
  )
}

export default ButtonContainer
