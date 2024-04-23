import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles.js'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext.js'
import { theme } from '../../../utils/themeColors.js'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { SimpleLineIcons } from '@expo/vector-icons'
import { verticalScale } from '../../../utils/scaling.js'

function DrawerItems(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles().flex}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles().container}
        onPress={props.onPress}>
        <View style={styles(currentTheme).leftContainer}>
          <SimpleLineIcons
            name={props.icon}
            size={verticalScale(15)}
            color={currentTheme.darkBgFont}
          />
        </View>
        <View style={styles().rightContainer}>
          <TextDefault
            style={styles().drawerContainer}
            textColor={currentTheme.fontMainColor}
            small
            bold>
            {props.title}
          </TextDefault>
        </View>
      </TouchableOpacity>
    </View>
  )
}
export default DrawerItems
