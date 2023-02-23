import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import PropTypes from 'prop-types'
import colors from '../../utilities/colors'
import styles from './styles'

const DEFAULT_SIZE_MULTIPLIER = 0.7

export default function RadioButton(props) {
  const { size, innerColor, outerColor, isSelected, onPress } = props
  const outerStyle = {
    borderColor: outerColor,
    width: size + size * DEFAULT_SIZE_MULTIPLIER,
    height: size + size * DEFAULT_SIZE_MULTIPLIER,
    borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
    borderWidth: isSelected ? size / 2 : 1
  }

  const innerStyle = {
    width: size / 2,
    height: size / 2,
    borderRadius: size / 2,
    backgroundColor: innerColor
  }

  return (
    <TouchableOpacity style={[styles.radio, outerStyle]} onPress={onPress}>
      {isSelected ? (
        <View useNativeDriver={false} style={innerStyle} {...props} />
      ) : null}
    </TouchableOpacity>
  )
}

RadioButton.propTypes = {
  size: PropTypes.number,
  innerColor: PropTypes.string,
  outerColor: PropTypes.string,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func
}

RadioButton.defaultProps = {
  size: 16,
  innerColor: colors.radioColor,
  outerColor: colors.radioOuterColor,
  isSelected: false,
  onPress: () => null
}
