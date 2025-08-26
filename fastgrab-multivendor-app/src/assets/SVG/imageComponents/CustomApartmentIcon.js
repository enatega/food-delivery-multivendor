import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { FontAwesome6 } from '@expo/vector-icons'

const CustomApartmentIcon = ({ iconColor }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  if (!iconColor) {
    iconColor = currentTheme.darkBgFont
  }
  return (
    <View style={styles.container}>
      <FontAwesome6 name='building' size={24} color={iconColor} />
    </View>
  )
}

export default CustomApartmentIcon

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
