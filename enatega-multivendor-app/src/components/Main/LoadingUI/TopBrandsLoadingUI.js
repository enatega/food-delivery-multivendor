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
        {[0, 1, 2].map((item) => (
          <View key={item} style={[styles(tokens).brandItemSkeleton, { borderRadius: tokens.radii.lg, borderColor: tokens.colors.borderSubtle }]}>
            <SkeletonBlock width='100%' height={scale(86)} borderRadius={0} />
            <View style={[styles(tokens).brandLogoSkeleton, { backgroundColor: tokens.colors.canvas }]}>
              <SkeletonBlock width={scale(50)} height={scale(50)} borderRadius={scale(25)} />
            </View>
            <View style={styles(tokens).brandTextSkeleton}>
              <SkeletonBlock width='78%' height={scale(13)} borderRadius={scale(6)} />
              <SkeletonBlock width='52%' height={scale(11)} borderRadius={scale(6)} />
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default TopBrandsLoadingUI
