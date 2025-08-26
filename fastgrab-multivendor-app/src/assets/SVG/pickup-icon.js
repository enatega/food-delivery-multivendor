import * as React from "react"
import Svg, { Path } from "react-native-svg"
const PickupIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <Path
      stroke="#111827"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M9.25 14.5v-5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5m-3 0H1.824m7.426 0h3m0 0h2.426m-.926 0V6.732m-11 7.768V6.733m0 0a2 2 0 0 0 2.5-.41c.367.415.903.677 1.5.677s1.134-.262 1.5-.677c.366.415.903.677 1.5.677s1.133-.262 1.5-.677a2 2 0 0 0 2.5.41m-11 0a2.003 2.003 0 0 1-.414-3.147l.793-.793a1 1 0 0 1 .707-.293h8.828a1 1 0 0 1 .707.293l.793.793a2 2 0 0 1-.414 3.146m-9 5.768h2.5a.5.5 0 0 0 .5-.5V9.5a.5.5 0 0 0-.5-.5h-2.5a.5.5 0 0 0-.5.5V12a.5.5 0 0 0 .5.5Z"
    />
  </Svg>
)
export default PickupIcon
