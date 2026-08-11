import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

const CustomHomeIcon = ({ iconColor }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  if (!iconColor) {
    iconColor = currentTheme.darkBgFont
  }
  return (
    <View style={styles.container}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none">
        <Path
          d="M9.33435 0.265555C9.51781 0.0944833 9.75465 0 10 0C10.2454 0 10.4822 0.0944833 10.6656 0.265555L19.688 8.68693C19.8766 8.87506 19.9881 9.13281 19.9991 9.40572C20.0101 9.67863 19.9196 9.94534 19.7468 10.1495C19.574 10.3537 19.3323 10.4793 19.0729 10.4998C18.8135 10.5204 18.5567 10.4342 18.3567 10.2596L18.0198 9.94698V17.8947C18.0198 18.453 17.8086 18.9885 17.4326 19.3834C17.0566 19.7782 16.5466 20 16.0149 20H3.98512C3.45338 20 2.94341 19.7782 2.5674 19.3834C2.1914 18.9885 1.98017 18.453 1.98017 17.8947V9.94698L1.64333 10.2596C1.4433 10.4342 1.18645 10.5204 0.927061 10.4998C0.667668 10.4793 0.426039 10.3537 0.253218 10.1495C0.0803968 9.94534 -0.0100825 9.67863 0.000893657 9.40572C0.0118698 9.13281 0.123442 8.87506 0.31204 8.68693L9.33435 0.265555ZM3.98512 8.07322V17.8947H6.99256V12.6313C6.99256 12.3521 7.09818 12.0844 7.28618 11.8869C7.47418 11.6895 7.72917 11.5786 7.99504 11.5786H12.005C12.2708 11.5786 12.5258 11.6895 12.7138 11.8869C12.9018 12.0844 13.0074 12.3521 13.0074 12.6313V17.8947H16.0149V8.07428L10 2.46038L3.98512 8.07322ZM11.0025 17.8947V13.684H8.99752V17.8947H11.0025Z"
          fill={iconColor}
        />
      </Svg>
    </View>
  )
}

export default CustomHomeIcon

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
