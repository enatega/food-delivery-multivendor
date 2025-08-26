import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const Triangle = props => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return <View style={[styles(currentTheme).triangle, props?.style]} />
}

export default Triangle
