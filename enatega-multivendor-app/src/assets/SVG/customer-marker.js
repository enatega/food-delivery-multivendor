import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const CustomerMarker = props => (
  <Svg {...props} xmlns="http://www.w3.org/2000/svg" width={25} height={27}>
    <Path
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#000',
        fillOpacity: 1
      }}
      d="M12.477 0c6.398-.004 11.765 4.754 12.418 11.02.652 6.261-3.618 11.992-9.883 13.265-.82.168-1.094.477-2.535 2.645-1.32-1.985-1.704-2.477-2.52-2.64-6.273-1.267-10.55-7-9.902-13.267C.703 4.758 6.07-.004 12.477 0Zm0 0"
    />
    <Path
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#6fcf97',
        fillOpacity: 1
      }}
      d="m19.36 10.602-6.157-4.598a1.35 1.35 0 0 0-1.476 0l-6.094 4.598a.525.525 0 0 0-.219.628.55.55 0 0 0 .57.36h.594v3.55c.031 1.262 1.082 2.274 2.367 2.27h1.184a.58.58 0 0 0 .43-.16.539.539 0 0 0 .16-.422v-2.851c0-.657.52-1.196 1.183-1.223h1.184a1.224 1.224 0 0 1 1.184 1.223v2.851c0 .32.265.582.593.582h1.184c1.285.004 2.336-1.008 2.367-2.27v-3.55h.59a.551.551 0 0 0 .355-.988Zm0 0"
    />
  </Svg>
)

export default CustomerMarker
