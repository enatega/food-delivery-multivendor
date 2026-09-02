import React from 'react'
import { View } from 'react-native'
import styles from './styles'
import { SkeletonBlock, useMultivendorTheme } from '../../../ui/designSystem'
import { scale } from '../../../utils/scaling'

const MainLoadingUI = () => {
  const { tokens } = useMultivendorTheme()

  return (
    <View style={styles(tokens).sectionSkeleton}>
      <View style={styles(tokens).sectionHeaderSkeleton}>
        <SkeletonBlock width={scale(152)} height={scale(22)} borderRadius={scale(7)} />
        <SkeletonBlock width={scale(58)} height={scale(18)} borderRadius={scale(7)} />
      </View>
      <View style={styles(tokens).restaurantRowSkeleton}>
        {[0, 1].map((item) => (
          <View key={item} style={styles(tokens).restaurantCardSkeleton}>
            <SkeletonBlock height={scale(168)} borderRadius={scale(14)} />
            <View style={styles(tokens).cardCopySkeleton}>
              <View style={styles(tokens).cardTitleSkeleton}>
                <SkeletonBlock width='56%' height={scale(18)} borderRadius={scale(6)} />
                <SkeletonBlock width={scale(48)} height={scale(22)} borderRadius={scale(11)} />
              </View>
              <SkeletonBlock width='80%' height={scale(12)} borderRadius={scale(6)} />
              <View style={styles(tokens).metaSkeleton}>
                <SkeletonBlock width='25%' height={scale(12)} borderRadius={scale(6)} />
                <SkeletonBlock width='25%' height={scale(12)} borderRadius={scale(6)} />
                <SkeletonBlock width='18%' height={scale(12)} borderRadius={scale(6)} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default MainLoadingUI
