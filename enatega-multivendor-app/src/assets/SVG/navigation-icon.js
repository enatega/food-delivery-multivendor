import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const NavigationIcon = props => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path d="M10 16 7 9 0 6l16-6-6 16Z" fill="#000" />
  </Svg>
)

export default NavigationIcon
