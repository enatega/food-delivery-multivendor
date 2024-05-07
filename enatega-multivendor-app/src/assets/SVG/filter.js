import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function FiltersIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={32} height={32} rx={16} fill="#E5E7EB" />
      <Path
        d="M12 17v-6.5m0 6.5a1 1 0 110 2m0-2a1 1 0 100 2m0 2.5V19m8-2v-6.5m0 6.5a1 1 0 110 2m0-2a1 1 0 100 2m0 2.5V19m-4-6v-2.5m0 2.5a1 1 0 110 2m0-2a1 1 0 100 2m0 6.5V15"
        stroke="#0F172A"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default FiltersIcon