import React, { useContext } from 'react'
import Svg, { Path } from 'react-native-svg'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

function CustomMarker(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <Svg viewBox="0 0 512 512" {...props}>
      <Path
        fill={currentTheme.iconColorPink}
        d="M256 103.278c-39.429 0-71.505 32.077-71.505 71.505 0 39.429 32.077 71.505 71.505 71.505s71.505-32.077 71.505-71.505-32.076-71.505-71.505-71.505z"
      />
      <Path
        fill={currentTheme.iconColorPink}
        d="M256 0C158.107 0 78.465 79.642 78.465 177.535c0 40.042 28.089 106.034 83.486 196.143 40.502 65.88 81.577 121.48 81.987 122.033L256 512l12.062-16.289c.41-.553 41.485-56.153 81.987-122.033 55.397-90.109 83.486-156.101 83.486-196.143C433.535 79.642 353.893 0 256 0zm0 276.306c-55.98 0-101.522-45.543-101.522-101.522 0-55.98 45.543-101.522 101.522-101.522s101.522 45.543 101.522 101.522c0 55.979-45.542 101.522-101.522 101.522z"
      />
    </Svg>
  )
}

export default CustomMarker
