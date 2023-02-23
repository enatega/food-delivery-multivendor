import React from 'react'
import { View } from 'react-native'
import TextDefault from '../TextDefault/TextDefault'
import { colors } from '../../../utilities'
import PropTypes from 'prop-types'

function TextError(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.backColor
          ? props.backColor
          : colors.themeBackground
      }}>
      <TextDefault
        textColor={props.textColor ? props.textColor : colors.fontMainColor}
        bold
        H4
        center>
        {props.text}{' '}
      </TextDefault>
    </View>
  )
}
TextError.propTypes = {
  text: PropTypes.string,
  backColor: PropTypes.string,
  textColor: PropTypes.string
}
export default TextError
