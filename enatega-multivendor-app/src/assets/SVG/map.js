import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function MapIcon(props) {
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
        d="M14 12.5V18m4-4v5.5m.335 2.332l3.25-1.625a.75.75 0 00.415-.67v-8.324a.75.75 0 00-1.085-.67l-2.58 1.29a.75.75 0 01-.67 0l-3.33-1.665a.75.75 0 00-.67 0l-3.25 1.625a.75.75 0 00-.415.67v8.323a.75.75 0 001.085.671l2.58-1.29a.75.75 0 01.67 0l3.33 1.665a.75.75 0 00.67 0z"
        stroke="#111827"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default MapIcon
