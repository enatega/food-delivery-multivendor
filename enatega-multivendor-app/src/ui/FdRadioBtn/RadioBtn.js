import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import ThemeContext from '../ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const DEFAULT_SIZE_MULTIPLIER = 0.7

function RadioButton(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const {
    size = 16,
    innerColor = currentTheme.radioColor,
    outerColor = currentTheme.radioOuterColor,
    isSelected = false,
    onPress = () => null
  } = props

  const outerStyle = {
    borderColor: isSelected ? innerColor : outerColor,
    width: size + size * DEFAULT_SIZE_MULTIPLIER,
    height: size + size * DEFAULT_SIZE_MULTIPLIER,
    borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
    borderWidth: 1
  }

  const innerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: innerColor
  }

  return (
    <TouchableOpacity style={[styles.radio, outerStyle]} onPress={onPress}>
      {isSelected ? <View style={innerStyle} {...props} /> : null}
    </TouchableOpacity>
  )
}

RadioButton.prototype = {
  size: PropTypes.number,
  innerColor: PropTypes.string,
  outerColor: PropTypes.string,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func
}

export default RadioButton
