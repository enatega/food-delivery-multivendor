import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const VoucherCard = props => (
  <Svg
    width={20}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M11.833.75v16.5H1.75a.917.917 0 0 1-.917-.917v-5.041a2.292 2.292 0 0 0 0-4.584V1.667A.917.917 0 0 1 1.75.75h10.083Zm1.834 0h4.583a.917.917 0 0 1 .917.917v5.041a2.292 2.292 0 0 0 0 4.584v5.041a.917.917 0 0 1-.917.917h-4.583V.75Z"
      fill="#90EA93"
    />
  </Svg>
)

export default VoucherCard
