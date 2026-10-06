import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import LoadingSkeleton from '../LoadingSkeleton'
import { scale } from '../../../utils/scaling'
import { discoverySpacing } from '../../../ui/designSystem/tokens'
import { TILE_GAP, TILE_HEIGHT, TILE_RADIUS, TILE_WIDTH } from '../../../components/Main/DiscoveryCategoryRail/DiscoveryCategoryRail'
import { DISCOVERY_GUTTER, getBannerLayout } from './discoveryLayout'
import { DEAL_CARD } from './DealCard'

export const HomeBannerSkeleton = () => {
  const { width } = useWindowDimensions()
  // Mirrors the single-banner layout so content swaps in without a jump.
  const { cardHeight } = getBannerLayout(width, 1)

  return (
    <View style={styles.bannerContainer}>
      <LoadingSkeleton width='100%' height={cardHeight} borderRadius={scale(20)} />
    </View>
  )
}

export const HomeCategoriesSkeleton = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.headerRow}>
      <LoadingSkeleton width={scale(110)} height={scale(18)} borderRadius={scale(6)} />
      <LoadingSkeleton width={scale(64)} height={scale(28)} borderRadius={scale(8)} />
    </View>
    <View style={[styles.cardsRow, { gap: TILE_GAP }]}>
      {Array.from({ length: 5 }).map((_, index) => (
        <LoadingSkeleton
          key={index}
          width={TILE_WIDTH}
          height={TILE_HEIGHT}
          borderRadius={TILE_RADIUS}
        />
      ))}
    </View>
  </View>
)

export const DealRailSkeleton = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.headerRow}>
      <View style={styles.dealHeaderLead}>
        <LoadingSkeleton width={DEAL_CARD.headerIcon} height={DEAL_CARD.headerIcon} borderRadius={scale(12)} />
        <View style={styles.dealHeaderCopy}>
          <LoadingSkeleton width={scale(120)} height={scale(16)} borderRadius={scale(6)} />
          <LoadingSkeleton width={scale(90)} height={scale(11)} borderRadius={scale(6)} />
        </View>
      </View>
    </View>
    <View style={[styles.cardsRow, { gap: DEAL_CARD.gap }]}>
      {Array.from({ length: 3 }).map((_, index) => (
        <LoadingSkeleton
          key={index}
          width={DEAL_CARD.width}
          height={DEAL_CARD.height}
          borderRadius={DEAL_CARD.radius}
        />
      ))}
    </View>
  </View>
)

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: DISCOVERY_GUTTER,
    marginBottom: scale(4)
  },
  sectionContainer: {
    marginTop: discoverySpacing.sectionTop,
    marginBottom: discoverySpacing.sectionBottom,
    overflow: 'hidden'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DISCOVERY_GUTTER,
    marginBottom: 15
  },
  dealHeaderLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10)
  },
  dealHeaderCopy: {
    gap: scale(5)
  },
  cardsRow: {
    flexDirection: 'row',
    paddingLeft: DISCOVERY_GUTTER
  }
})
