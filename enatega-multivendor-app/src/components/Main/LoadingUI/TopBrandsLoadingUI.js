import React from 'react'
import { View } from 'react-native'
import styles from './styles'
import { SkeletonBlock, useMultivendorTheme } from '../../../ui/designSystem'
import { scale } from '../../../utils/scaling'

const TopBrandsLoadingUI = () => {
  const { tokens } = useMultivendorTheme()

  return (
    <View style={styles(tokens).brandSectionSkeleton}>
      <View style={styles(tokens).sectionHeaderSkeleton}>
        <SkeletonBlock width={scale(112)} height={scale(22)} borderRadius={scale(7)} />
        <SkeletonBlock width={scale(58)} height={scale(18)} borderRadius={scale(7)} />
      </View>
      <View style={styles(tokens).brandRowSkeleton}>
        {[0, 1, 2, 3].map((item) => (
          <View key={item} style={styles(tokens).brandItemSkeleton}>
            <SkeletonBlock width={scale(82)} height={scale(82)} borderRadius={scale(12)} />
            <SkeletonBlock width={scale(66)} height={scale(12)} borderRadius={scale(6)} />
          </View>
        ))}
      </View>
    </View>
  )
}

export default TopBrandsLoadingUI
