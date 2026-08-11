import React, { useContext } from 'react'
import Svg, { Path, Ellipse, Circle, Rect } from 'react-native-svg'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

function LoginHeader() {
  return (
    <Svg
      width='500'
      height='270'
      viewBox='0 0 393 244'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M0 -226H393V244C277.5 208.5 143.5 197 0 244V-226Z'
        fill='#90E36D'
      />
    </Svg>
  )
}

export default LoginHeader
