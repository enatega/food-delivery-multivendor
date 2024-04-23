import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PopularIcon(props) {
  return (
    <Svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20.483 6.951A11.002 11.002 0 0127 17c0 6.075-4.925 11-11 11S5 23.075 5 17c0-2.95 1.16-5.628 3.05-7.603a11.05 11.05 0 003.952 3.404c.06-3.701 1.795-6.995 4.48-9.155a10.946 10.946 0 004 3.305z"
        stroke={props.color ?? "#0F172A"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 24a5 5 0 00.66-9.957 7.986 7.986 0 00-2.566 4.729 7.965 7.965 0 01-2.845-1.335A5 5 0 0016 24z"
        stroke={props.color ?? "#0F172A"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default PopularIcon
