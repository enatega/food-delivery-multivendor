import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const LanguageItem = ({ name, subtitle, isSelected, onPress, currentTheme }) => {
  return (
    <TouchableOpacity
      style={styles(currentTheme).container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).name}
        bolder
      >
        {name}
      </TextDefault>
      <TextDefault
        textColor={currentTheme.fontSecondColor}
        style={styles(currentTheme).subtitle}
        bold
      >
        {subtitle}
      </TextDefault>
    </TouchableOpacity>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingVertical: verticalScale(16),
      borderBottomWidth: 0
    },
    name: {
      fontSize: scale(16),
      marginBottom: verticalScale(2)
    },
    subtitle: {
      fontSize: scale(13)
    }
  })

export default LanguageItem
