import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { scale, verticalScale } from '../../../utils/scaling'

export const HomeBannerSkeleton = () => (
  <View style={styles.bannerContainer}>
    <LoadingSkeleton width='100%' height={verticalScale(140)} borderRadius={16} />
  </View>
)

export const HomeCategoriesSkeleton = () => (
  <ScrollView
    horizontal
    scrollEnabled={false}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoriesContainer}
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <View key={index} style={styles.categoryItem}>
        <LoadingSkeleton width={80} height={80} borderRadius={12} />
        <LoadingSkeleton width={64} height={14} borderRadius={5} style={styles.categoryLabel} />
      </View>
    ))}
  </ScrollView>
)

const styles = StyleSheet.create({
  bannerContainer: {
    marginBottom: scale(16),
    paddingHorizontal: scale(12)
  },
  categoriesContainer: {
    paddingLeft: scale(12),
    paddingRight: scale(4),
    paddingVertical: scale(20)
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: scale(16)
  },
  categoryLabel: {
    marginTop: scale(8)
  }
})
