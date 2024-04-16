import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ArrowForwardIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#0F172A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1.25 1.5 8.75 9l-7.5 7.5"
    />
  </Svg>
)
export default ArrowForwardIcon
