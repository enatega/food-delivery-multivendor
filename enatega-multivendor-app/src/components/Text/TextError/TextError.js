import React, { useContext } from 'react'
import { View } from 'react-native'
import TextDefault from '../TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
function TextError(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.backColor
          ? props.backColor
          : currentTheme.themeBackground
      }}>
      <TextDefault
        textColor={
          props.textColor ? props.textColor : currentTheme.fontMainColor
        }
        bold
        center>
        {props.text}{' '}
      </TextDefault>
    </View>
  )
}
export default TextError
