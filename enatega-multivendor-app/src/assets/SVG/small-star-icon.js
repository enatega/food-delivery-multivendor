import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SmallStarIcon = ({ isFilled = false }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill={isFilled ? '#FFA921' : 'none'}
  >
    <Path
      stroke="#FFA921"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.067 1.916a.469.469 0 0 1 .866 0l1.771 4.26c.068.162.22.272.396.286l4.598.37a.469.469 0 0 1 .268.822l-3.504 3.002a.469.469 0 0 0-.15.464l1.07 4.488a.469.469 0 0 1-.7.508l-3.938-2.404a.469.469 0 0 0-.488 0l-3.937 2.404a.469.469 0 0 1-.7-.508l1.07-4.488a.469.469 0 0 0-.151-.464L1.034 7.654a.469.469 0 0 1 .268-.823L5.9 6.462a.469.469 0 0 0 .396-.287l1.771-4.26Z"
    />
  </Svg>
)
export default SmallStarIcon
