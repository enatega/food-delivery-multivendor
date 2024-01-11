import React, { useContext } from 'react'
import { ActivityIndicator } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import CustomTheme from '../../utils/themeColors1'

function Spinner(props) {
  const { theme } = CustomTheme()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <ActivityIndicator
      animating={true}
      style={{
        flex: 1,
        backgroundColor: props.backColor
          ? props.backColor
          : currentTheme.headerColor
      }}
      size={props.size || 'large'}
      color={props.spinnerColor ? props.spinnerColor : currentTheme.white}
    />
  )
}
export default Spinner
