import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const ArrowsLoading = props => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} {...props}>
    <Path
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#6fcf97',
        fillOpacity: 1
      }}
      d="M38.441 41.594c-8.03 6.476-19.523 6.351-27.414-.293h5.442v-3.375H5.504V48.89h3.375v-5.02a24.644 24.644 0 0 0 13.746 5.738c.773.082 1.547.125 2.32.125a24.936 24.936 0 0 0 23.656-32.516l-3.203 1.012a21.49 21.49 0 0 1-6.957 23.364ZM41.348 6.215A24.882 24.882 0 0 0 11.332 4.03C1.969 10.121-2.188 21.703 1.16 32.36l3.207-1.011a21.515 21.515 0 0 1 8.88-24.512A21.52 21.52 0 0 1 39.241 8.87h-5.484v3.375h10.965V1.277h-3.375Zm0 0"
    />
  </Svg>
)

export default ArrowsLoading
