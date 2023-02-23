import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextDefault from '../Text/TextDefault/TextDefault'

export default function Button({
  text,
  textStyles,
  buttonStyles,
  buttonProps,
  textProps
}) {
  return (
    <TouchableOpacity {...buttonProps} style={buttonStyles}>
      <TextDefault {...textProps} style={textStyles} bolder>
        {text}
      </TextDefault>
    </TouchableOpacity>
  )
}
