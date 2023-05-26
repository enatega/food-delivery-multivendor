import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const PaymentIcon = props => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0 12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7H0v5ZM14 2H2a2 2 0 0 0-2 2v2h16V4a2 2 0 0 0-2-2Z"
      fill="#90EA93"
    />
  </Svg>
)

export default PaymentIcon
