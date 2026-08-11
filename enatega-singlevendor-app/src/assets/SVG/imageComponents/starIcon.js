import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import { View, TouchableOpacity } from 'react-native'
const StarIcon = ({ isFilled = false, onPress, height, width, disabled }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress}>
    <View>
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill={isFilled ? '#FFA921' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        stroke="#FFA921"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
    </View>
  </TouchableOpacity>
)
export default StarIcon
