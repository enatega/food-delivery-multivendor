import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles.js'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext.js'
import { theme } from '../../../utils/themeColors.js'
import TextDefault from '../../Text/TextDefault/TextDefault.js'
import { EvilIcons, Ionicons, MaterialCommunityIcons, MaterialIcons  } from '@expo/vector-icons'
import { verticalScale } from '../../../utils/scaling.js'

const ButtonContainer = (props) => {
  // console.log('Props', props)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  // const IconComponent = props.iconType == 'Ionicons' ? Ionicons : EvilIcons
  const IconComponent =
  props.iconType === 'Ionicons' ? Ionicons :
  props.iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
  Ionicons;

  return (
   <>
    <View style={styles().flexRow}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles().linkContainer}
        onPress={props.onPress}
      >
        <View style={styles(currentTheme).mainLeftContainer}>
          <View style={styles(currentTheme).leftContainer}>
            <IconComponent
              name={props.icon}
              size={verticalScale(15)}
              color={currentTheme.darkBgFont}
            />
          </View>
          <TextDefault
            style={styles().drawerContainer}
            textColor={currentTheme.fontMainColor}
            small
            H4
            bolder
          >
            {props.title}
          </TextDefault>
        </View>

        <View style={styles(currentTheme).leftContainer}>
          <EvilIcons
            name='chevron-right'
            size={verticalScale(25)}
            color={currentTheme.darkBgFont}
          />
        </View>
      </TouchableOpacity>

    </View>
      <View style={styles().line} />
   </>
  )
}

export default ButtonContainer
