import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const LocationMarker = props => (
  <Svg
    width={22}
    height={22}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M11 1.833A6.418 6.418 0 0 0 4.583 8.25C4.583 13.063 11 20.167 11 20.167s6.417-7.105 6.417-11.917A6.418 6.418 0 0 0 11 1.833Zm0 8.709a2.292 2.292 0 1 1 .002-4.585A2.292 2.292 0 0 1 11 10.542Z"
      fill="#90EA93"
    />
  </Svg>
)

export default LocationMarker
