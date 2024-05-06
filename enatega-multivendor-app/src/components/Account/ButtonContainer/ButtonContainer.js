import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './styles.js'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext.js'
import { theme } from '../../../utils/themeColors.js'
import TextDefault from '../../Text/TextDefault/TextDefault.js'
import { EvilIcons } from '@expo/vector-icons'
import { verticalScale } from '../../../utils/scaling.js'

const ButtonContainer = (props) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const isDisabled = props.onPress === 'none'
  const isVerifyDisabled = props.status === 'none'

  return (
    <>
      <View style={styles().flexRow}>
        <TouchableOpacity
          activeOpacity={isDisabled ? 1 : 0.7}
          style={styles(currentTheme).linkContainer}
          onPress={isDisabled ? null : props.onPress}
        >
          <View style={styles(currentTheme).mainLeftContainer}>
            {/* <View style={styles(currentTheme).leftContainer}> */}
            <TextDefault
              style={styles().drawerContainer}
              textColor={currentTheme.fontMainColor}
              small
              H5
              Bold
            >
              {props.title}
            </TextDefault>
            {/* </View> */}
          </View>

          <View style={styles(currentTheme).leftContainer}>
            <TextDefault
              style={styles().drawerContainer}
              textColor={currentTheme.fontMainColor}
              small
              H5
              bolder
            >
              {props.detail}
            </TextDefault>
            {!isDisabled && (
              <EvilIcons
                name='chevron-right'
                size={verticalScale(25)}
                color={currentTheme.darkBgFont}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      {!isVerifyDisabled && (
        <View style={styles(currentTheme).verifyView}>
          <TextDefault
            style={styles().drawerContainer}
            textColor={currentTheme.fontMainColor}
            small
          >
            {props.status}
          </TextDefault>
        </View>
      )}
      <View style={styles().line} />
    </>
  )
}

export default ButtonContainer
