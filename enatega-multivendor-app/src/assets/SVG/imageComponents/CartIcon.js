import React, { useContext } from 'react'
import Svg, { Path } from 'react-native-svg'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import CustomTheme from '../../../utils/themeColors1'

function CartIcon(props) {
  const { theme } = CustomTheme()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <Svg width={149} height={207} viewBox="0 0 149 207" fill="none" {...props}>
      <Path
        stroke={currentTheme.iconColorPink}
        strokeWidth={10}
        d="M5 34h139v168H5zM6 150h138.014"
      />
      <Path
        d="M118 53V10a5 5 0 00-5-5H37a5 5 0 00-5 5v43"
        stroke={currentTheme.iconColorPink}
        strokeWidth={10}
      />
    </Svg>
  )
}

export default CartIcon
