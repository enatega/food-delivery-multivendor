import { TouchableOpacity } from 'react-native'
import React from 'react'
import TextDefault from '../Text/TextDefault/TextDefault'

export default function Button({
  text,
  textStyles,
  buttonStyles,
  buttonProps,
  textProps,
  disabled
}) {
  return (
    <TouchableOpacity {...buttonProps} style={[buttonStyles, { opacity: disabled ? 0.5 : 1 }]} disabled={disabled}>
      <TextDefault {...textProps} style={textStyles} bolder>
        {text}
      </TextDefault>
    </TouchableOpacity>
  )
}
