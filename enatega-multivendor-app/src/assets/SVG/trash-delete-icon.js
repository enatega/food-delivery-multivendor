import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const TrashIcon = props => (
  <Svg
    width={13}
    height={15}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M1.75 13.042c0 .874.709 1.583 1.583 1.583h6.334c.875 0 1.583-.709 1.583-1.583v-9.5h-9.5v9.5ZM12.042 1.167H9.27L8.479.375H4.521l-.792.792H.96V2.75h11.083V1.167Z"
      fill="#000"
    />
  </Svg>
)

export default TrashIcon
