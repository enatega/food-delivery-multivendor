import React from 'react'
import { Icons } from './icons'

const BottomTabIcon = ({ name, color, onPress, size }) => {
  const IconSVG = Icons[name]
  return (
    <IconSVG
      color={color}
      size={size}
      onPress={onPress}
    />
  )
}

export default BottomTabIcon
