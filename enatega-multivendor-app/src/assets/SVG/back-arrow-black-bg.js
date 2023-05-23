import * as React from 'react'
import Svg, { Rect, Path } from 'react-native-svg'

const BackArrowBlackBg = props => (
  <Svg
    width={35}
    height={35}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={35} height={35} rx={15} fill="#000" />
    <Path
      d="M20.502 26.304a.689.689 0 0 1-.466-.182l-8.11-7.681a.607.607 0 0 1-.193-.44c0-.166.07-.325.193-.441l8.11-7.681a.66.66 0 0 1 .468-.19.69.69 0 0 1 .47.182.595.595 0 0 1-.008.889L13.322 18l7.646 7.24a.593.593 0 0 1 .143.68.633.633 0 0 1-.243.279.684.684 0 0 1-.366.105h0Z"
      fill="#90EA93"
      stroke="#90EA93"
      strokeLinecap="round"
    />
  </Svg>
)

export default BackArrowBlackBg
