import React from 'react'
import { View } from 'react-native'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import { scale, verticalScale } from '../../../utils/scaling'

const FreeDeliveriesSkeleton = ({ currentTheme, styles }) => {
  return (
    <View style={styles(currentTheme).balanceCard}>
      <LoadingSkeleton
        width="60%"
        height={verticalScale(20)}
        borderRadius={scale(4)}
        style={{ marginBottom: verticalScale(8) }}
      />
      <LoadingSkeleton
        width="10%"
        height={verticalScale(40)}
        borderRadius={scale(4)}
        style={{ marginBottom: verticalScale(20) }}
      />
      <View style={styles(currentTheme).buttonContainer}>
        <LoadingSkeleton
          width={scale(140)}
          height={verticalScale(42)}
          borderRadius={scale(8)}
        />
      </View>
    </View>
  )
}

export default FreeDeliveriesSkeleton
