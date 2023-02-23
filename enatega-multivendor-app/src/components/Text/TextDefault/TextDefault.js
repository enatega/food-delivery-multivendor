import React from 'react'
import { Text, StyleSheet } from 'react-native'
import color from './styles'
import { textStyles } from '../../../utils/textStyles'

function TextDefault(props) {
  const textColor = props.textColor ? props.textColor : 'black'
  const defaultStyle = StyleSheet.flatten([
    color(textColor).color,
    textStyles.Regular,
    textStyles.Normal
  ])
  var customStyles = [defaultStyle]

  if (props.bold) customStyles.push(textStyles.Bold)
  if (props.bolder) customStyles.push(textStyles.Bolder)
  if (props.center) customStyles.push(textStyles.Center)
  if (props.right) customStyles.push(textStyles.Right)
  if (props.small) customStyles.push(textStyles.Small)
  if (props.smaller) customStyles.push(textStyles.Smaller)
  if (props.H5) customStyles.push(textStyles.H5)
  if (props.H4) customStyles.push(textStyles.H4)
  if (props.H3) customStyles.push(textStyles.H3)
  if (props.H2) customStyles.push(textStyles.H2)
  if (props.H1) customStyles.push(textStyles.H1)
  if (props.uppercase) customStyles.push(textStyles.UpperCase)
  if (props.lineOver) customStyles.push(textStyles.LineOver)
  if (props.B700) customStyles.push(textStyles.B700)

  customStyles = StyleSheet.flatten([customStyles, props.style])
  return (
    <Text
      numberOfLines={props.numberOfLines ? props.numberOfLines : 0}
      style={customStyles}>
      {props.children}
    </Text>
  )
}

export default TextDefault
