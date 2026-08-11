import React from 'react'
import { Icons } from './icons'

const BottomTabIcon = ({ name, color, onPress, size }) => {
  const IconSVG = Icons[name] || Icons.discovery
  return (
    <IconSVG
      color={color}
      size={size}
      onPress={onPress}
    />
  )
}

export default BottomTabIcon
