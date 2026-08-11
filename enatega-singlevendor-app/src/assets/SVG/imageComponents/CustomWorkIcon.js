import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const CustomWorkIcon = ({ iconColor }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  if (!iconColor) {
    iconColor = currentTheme.darkBgFont
  }
  return (
    <View style={styles.container}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none">
        <Path
          d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9Z"
          stroke={iconColor}
          strokeWidth={2}
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M16 7V4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4V7"
          stroke={iconColor}
          strokeWidth={2}
          // stroke-width="2.09127"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M22 12H2"
          stroke={iconColor}
          strokeWidth={2}
          // stroke-width="2.09127"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M7 12V14"
          stroke={iconColor}
          strokeWidth={2}
          // stroke-width="2.09127"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M17 12V14"
          stroke={iconColor}
          strokeWidth={2}
          // stroke-width="2.09127"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  )
}

export default CustomWorkIcon

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
