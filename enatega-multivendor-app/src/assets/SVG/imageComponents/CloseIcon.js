import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
function CloseIcon(props) {
  return (
    <Svg
      className="prefix__svg-stroke-container"
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill={props?.fill}
      {...props}>
      <Path
        fillRule="evenodd"
        d="M8 9.016l6.886 6.795a.658.658 0 00.923 0 .637.637 0 000-.91L9.01 8l6.799-6.902a.637.637 0 000-.91.659.659 0 00-.923 0L8 6.983 1.114.188a.659.659 0 00-.923 0 .637.637 0 000 .911L6.99 8l-6.8 6.9a.637.637 0 000 .911.658.658 0 00.923 0L8 9.016z"
      />
    </Svg>
  )
}
export default CloseIcon
