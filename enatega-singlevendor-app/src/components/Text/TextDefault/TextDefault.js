import React, { forwardRef, useContext } from 'react'
import { Text, StyleSheet } from 'react-native'
import color from './styles'
import { textStyles } from '../../../utils/textStyles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import { theme } from '../../../utils/themeColors'


function TextDefault(props, ref) {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === "rtl", ...theme[themeContext.ThemeValue] }
  const textColor = props.textColor ? props.textColor : themeContext.ThemeValue === 'Dark' ? 'white' : 'black'
  const defaultStyle = StyleSheet.flatten([
    color(textColor).color,
    textStyles.Regular,
    textStyles.Normal
  ])
  var customStyles = [defaultStyle]

  const {
    children,
    style,
    numberOfLines,
    bold,
    bolder,
    center,
    right,
    small,
    smaller,
    H5,
    H4,
    H3,
    H2,
    H1,
    uppercase,
    lineOver,
    B700,
    textItalic,
    left,
    isRTL,
    ellipsizeMode,
    adjustsFontSizeToFit,
    minimumFontScale,
    textBreakStrategy,
    android_hyphenationFrequency,
    ...textProps
  } = props

  if (bold) customStyles.push(textStyles.Bold)
  if (bolder) customStyles.push(textStyles.Bolder)
  if (center) customStyles.push(textStyles.Center)
  if (right) customStyles.push(textStyles.Right)
  if (small) customStyles.push(textStyles.Small)
  if (smaller) customStyles.push(textStyles.Smaller)
  if (H5) customStyles.push(textStyles.H5)
  if (H4) customStyles.push(textStyles.H4)
  if (H3) customStyles.push(textStyles.H3)
  if (H2) customStyles.push(textStyles.H2)
  if (H1) customStyles.push(textStyles.H1)
  if (uppercase) customStyles.push(textStyles.UpperCase)
  if (lineOver) customStyles.push(textStyles.LineOver)
  if (B700) customStyles.push(textStyles.B700)
  if (textItalic) customStyles.push(textStyles.TextItalic)
  if (left) customStyles.push(textStyles.Left)
  if (isRTL) customStyles.push(currentTheme?.isRTL ? textStyles.Right : textStyles.Left)

  customStyles = StyleSheet.flatten([customStyles, style])

  return (
    <Text
      numberOfLines={numberOfLines ? numberOfLines : 0}
      ellipsizeMode={ellipsizeMode}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      textBreakStrategy={textBreakStrategy}
      android_hyphenationFrequency={android_hyphenationFrequency}
      style={customStyles}
      ref={ref}
      {...textProps}
      >
      {children}
    </Text>
  )
}

export default React.forwardRef(TextDefault)
