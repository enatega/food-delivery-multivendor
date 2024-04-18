import * as React from "react"
import Svg, { Path } from "react-native-svg"
const InstructionMessageIcon = ({stroke}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={26}
    fill="none"
  >
    <Path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 8h12M8 12h6M1 14.012c0 2.135 1.498 3.993 3.61 4.304 1.505.221 3.026.39 4.563.505.467.034.894.28 1.154.669L14 25l3.673-5.51a1.52 1.52 0 0 1 1.154-.67 64.193 64.193 0 0 0 4.563-.504c2.112-.31 3.61-2.169 3.61-4.303V5.987c0-2.134-1.498-3.993-3.61-4.303C20.325 1.234 17.19 1 14 1c-3.19 0-6.325.233-9.39.684C2.498 1.994 1 3.853 1 5.988v8.024Z"
    />
  </Svg>
)
export default InstructionMessageIcon
