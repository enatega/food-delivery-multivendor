import { EvilIcons } from '@expo/vector-icons'
import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import styles from './styles'

export default function AddressText({ onPress = () => {} }) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <TouchableOpacity
      style={[styles().textBtn, styles().flex]}
      onPress={onPress}>
      <EvilIcons
        name="pencil"
        size={scale(30)}
        color={currentTheme.iconColorPink}
      />
    </TouchableOpacity>
  )
}
