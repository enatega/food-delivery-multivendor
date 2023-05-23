import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const EditPenIcon = props => (
  <Svg
    width={13}
    height={13}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M.125 10.219v2.656h2.656l7.838-7.838-2.656-2.656-7.838 7.838ZM12.666 2.99a.71.71 0 0 0 0-1.002L11.012.334a.71.71 0 0 0-1.002 0L8.714 1.63l2.656 2.656 1.296-1.296Z"
      fill="#000"
    />
  </Svg>
)

export default EditPenIcon
