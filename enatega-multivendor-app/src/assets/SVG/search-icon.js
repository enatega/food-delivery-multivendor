import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SearchIcon = props => (
  <Svg
    width={23}
    height={23}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M10.063 16.531a6.469 6.469 0 1 0 0-12.937 6.469 6.469 0 0 0 0 12.937ZM19.406 19.406l-4.768-4.768"
      stroke="#000"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default SearchIcon
