import React from 'react'
import { View } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './styles'

const FreeDeliveriesCountSkeleton = ({ currentTheme, style }) => {
  return (
    <View style={[styles(currentTheme).card, styles(currentTheme).freeDeliveriesCard, style]}>
      <LoadingSkeleton
        width="60%"
        height={verticalScale(20)}
        borderRadius={scale(4)}
        style={{ marginBottom: verticalScale(8) }}
      />
      <LoadingSkeleton
        width="20%"
        height={verticalScale(30)}
        borderRadius={scale(4)}
      />
    </View>
  )
}

export default FreeDeliveriesCountSkeleton
