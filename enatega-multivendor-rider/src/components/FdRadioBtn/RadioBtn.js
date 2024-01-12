import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import PropTypes from 'prop-types'
import CustomColors from '../../utilities/colors'
import styles from './styles'

const DEFAULT_SIZE_MULTIPLIER = 0.7

export default function RadioButton(props) {
  const { colors } = CustomColors()
  const { size, isSelected, onPress } = props
  const outerStyle = {
    borderColor: colors.radioOuterColor,
    width: size + size * DEFAULT_SIZE_MULTIPLIER,
    height: size + size * DEFAULT_SIZE_MULTIPLIER,
    borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
    borderWidth: isSelected ? size / 2 : 1
  }

  const innerStyle = {
    width: size / 2,
    height: size / 2,
    borderRadius: size / 2,
    backgroundColor: colors.radioColor
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
  isSelected: false,
  onPress: () => null
}
