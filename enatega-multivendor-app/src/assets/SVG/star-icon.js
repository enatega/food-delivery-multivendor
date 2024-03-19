import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const StarIcon = ({ isFilled = false }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={37}
    fill={isFilled ? '#FFA921' : 'none'}
    // {...props}
  >
    <Path
      stroke="#FFA921"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.961 1.998c.385-.924 1.693-.924 2.078 0L25.29 12.22c.162.39.528.655.948.689l11.037.885c.997.08 1.402 1.325.642 1.976l-8.409 7.202c-.32.275-.46.706-.362 1.116l2.569 10.77c.232.973-.827 1.742-1.68 1.22l-9.45-5.77c-.36-.22-.812-.22-1.172 0l-9.45 5.77c-.853.522-1.912-.247-1.68-1.22l2.569-10.77c.098-.41-.042-.841-.362-1.116l-8.409-7.202c-.76-.652-.356-1.896.642-1.976l11.036-.885c.421-.034.787-.3.95-.69L18.96 1.999Z"
    />
  </Svg>
)
export default StarIcon
