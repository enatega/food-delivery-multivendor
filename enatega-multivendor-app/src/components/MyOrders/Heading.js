import React, { useContext } from 'react'
import { View } from 'react-native'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import TextDefault from '../Text/TextDefault/TextDefault'
import styles from './styles'

const Heading = props => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles(currentTheme).headingContainer}>
      <View
        style={[styles(currentTheme).headingLine, { width: props.lineWidth }]}
      />
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={{ width: props.textWidth }}
        H5
        bolder
        B700
        uppercase>
        {props.headerName}
      </TextDefault>
      <View
        style={[styles(currentTheme).headingLine, { width: props.lineWidth }]}
      />
    </View>
  )
}

export default Heading
