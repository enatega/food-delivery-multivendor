import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const CashOnDeliveryCard = props => (
  <Svg
    width={31}
    height={21}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M0 20.188h31V.813H0v19.375Zm15.5-15.5a5.812 5.812 0 1 1 0 11.624 5.812 5.812 0 0 1 0-11.625Z"
      fill="#000"
    />
  </Svg>
)

export default CashOnDeliveryCard
