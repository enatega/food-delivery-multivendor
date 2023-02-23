import React from 'react'
import { Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { textStyles, colors } from '../../../utilities'
import color from './styles'

function TextDefault(props) {
  const textColor = props.textColor ? props.textColor : colors.fontMainColor
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
  if (props.xSmall) customStyles.push(textStyles.xSmall)
  if (props.H5) customStyles.push(textStyles.H5)
  if (props.H4) customStyles.push(textStyles.H4)
  if (props.H3) customStyles.push(textStyles.H3)
  if (props.H2) customStyles.push(textStyles.H2)
  if (props.H1) customStyles.push(textStyles.H1)
  if (props.uppercase) customStyles.push(textStyles.UpperCase)
  if (props.lineOver) customStyles.push(textStyles.LineOver)

  customStyles = StyleSheet.flatten([customStyles, props.style])
  return (
    <Text
      numberOfLines={props.numberOfLines ? props.numberOfLines : 0}
      style={customStyles}>
      {props.children}
    </Text>
  )
}

TextDefault.propTypes = {
  textColor: PropTypes.string,
  bold: PropTypes.bool,
  bolder: PropTypes.bool,
  center: PropTypes.bool,
  right: PropTypes.bool,
  small: PropTypes.bool,
  xSmall: PropTypes.bool,
  H5: PropTypes.bool,
  H4: PropTypes.bool,
  H3: PropTypes.bool,
  H2: PropTypes.bool,
  H1: PropTypes.bool,
  uppercase: PropTypes.bool,
  lineOver: PropTypes.bool,
  numberOfLines: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}

export default TextDefault
