import React, { useContext } from 'react'
import Svg, { Path } from 'react-native-svg'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

function RandomShape(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <Svg viewBox="0 0 1440 320" {...props}>
      <Path
        fill={currentTheme.iconColorPink}
        translateY={-560}
        fillOpacity={0.4}
        d="M0 288l15-5.3C30 277 60 267 90 240c30-27 60-69 90-96s60-37 90-21.3c30 16.3 60 58.3 90 53.3s60-59 90-69.3C480 96 510 128 540 160c30 32 60 64 90 42.7C660 181 690 107 720 96s60 43 90 48 60-37 90-64 60-37 90-42.7c30-5.3 60-5.3 90 0 30 5.7 60 15.7 90 48 30 31.7 60 85.7 90 80 30-5.3 60-69.3 90-69.3s60 64 75 96l15 32V0H0z"
      />
    </Svg>
  )
}

export default RandomShape
