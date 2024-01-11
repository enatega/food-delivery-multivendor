import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../ThemeContext/ThemeContext'
import CustomTheme from '../../utils/themeColors1'

const Triangle = props => {
  const { theme } = CustomTheme()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return <View style={[styles(currentTheme).triangle, props.style]} />
}

export default Triangle
