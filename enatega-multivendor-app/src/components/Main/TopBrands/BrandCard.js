import React, { useMemo } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useCachedMediaUri } from '../../../utils/mediaCache'
import { resolveLogoImage, resolveRestaurantImage } from '../../../utils/resolveImageUrl'
import { scale } from '../../../utils/scaling'

export const BRAND_CARD_WIDTH = scale(148)
const COVER_HEIGHT = scale(86)
const LOGO_SIZE = scale(50)
const LOGO_RING = scale(3)

// Soft backdrops for brands without a distinct cover photo. Picked from the
// brand name so a brand keeps the same colour every time it appears.
const BACKDROPS = {
  light: [
    ['#FFE8D6', '#FFD1B3'],
    ['#E3F2FD', '#C7E2FA'],
    ['#E8F5E1', '#CFEBC0'],
    ['#F3E8FF', '#E2CCFB'],
    ['#FFF4CC', '#FFE38A'],
    ['#FFE4EC', '#FFC6D6']
  ],
  dark: [
    ['#3A2618', '#4A2E1A'],
    ['#172A3A', '#1C3550'],
    ['#1B2E17', '#24401D'],
    ['#2A1D3A', '#36244D'],
    ['#33290F', '#463812'],
    ['#3A1A25', '#4D2131']
  ]
}

const hashString = (value = '') => {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0
  return Math.abs(hash)
}

const formatRating = (average, count) => {
  if (!count || !average) return null
  return Number(average).toFixed(1)
}

function BrandCard({ item, tokens, minsLabel, newLabel, closedLabel, isOpen, onPress }) {
  const themedStyles = styles(tokens)
  const logoUri = useCachedMediaUri(resolveLogoImage(item), 'image')
  const rawCover = resolveRestaurantImage(item)
  const rawLogo = resolveLogoImage(item)
  // A cover identical to the logo looks like a stretched logo; use a backdrop instead.
  const hasDistinctCover = Boolean(rawCover) && rawCover !== rawLogo
  const coverUri = useCachedMediaUri(hasDistinctCover ? rawCover : null, 'image')

  const backdrop = useMemo(() => {
    const palette = tokens.isDark ? BACKDROPS.dark : BACKDROPS.light
    return palette[hashString(item?.name) % palette.length]
  }, [item?.name, tokens.isDark])

  const rating = formatRating(item?.reviewAverage, item?.reviewCount)
  const tag = Array.isArray(item?.tags) ? item.tags.find(Boolean) : null
  const initial = (item?.name || '?').trim().charAt(0).toUpperCase()

  const accessibilityLabel = [
    item?.name,
    rating ? `${rating} ★` : newLabel,
    item?.deliveryTime ? `${item.deliveryTime} ${minsLabel}` : null,
    !isOpen ? closedLabel : null
  ].filter(Boolean).join(', ')

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [themedStyles.card, pressed && themedStyles.cardPressed]}
    >
      <View style={themedStyles.cover}>
        {hasDistinctCover && coverUri
          ? <Image source={{ uri: coverUri }} style={[StyleSheet.absoluteFill, !isOpen && themedStyles.dimmed]} resizeMode='cover' />
          : (
            <LinearGradient colors={backdrop} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill}>
              <TextDefault style={themedStyles.watermark} textColor={tokens.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} bolder>
                {initial}
              </TextDefault>
            </LinearGradient>
            )}

        <LinearGradient
          colors={['rgba(0,0,0,0)', tokens.isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.28)']}
          style={themedStyles.coverShade}
          pointerEvents='none'
        />

        {!!item?.deliveryTime && (
          <View style={themedStyles.timePill}>
            <MaterialIcons name='schedule' size={scale(11)} color={tokens.colors.textPrimary} />
            <TextDefault style={themedStyles.pillText} textColor={tokens.colors.textPrimary} numberOfLines={1}>
              {item.deliveryTime} {minsLabel}
            </TextDefault>
          </View>
        )}

        {!isOpen && (
          <View style={themedStyles.closedPill}>
            <TextDefault style={themedStyles.pillText} textColor='#FFFFFF' numberOfLines={1}>
              {closedLabel}
            </TextDefault>
          </View>
        )}
      </View>

      <View style={themedStyles.logoRing}>
        {logoUri
          ? <Image source={{ uri: logoUri }} style={themedStyles.logo} resizeMode='cover' />
          : (
            <View style={[themedStyles.logo, themedStyles.logoFallback, { backgroundColor: backdrop[1] }]}>
              <TextDefault style={themedStyles.logoInitial} textColor={tokens.colors.textPrimary} bolder>{initial}</TextDefault>
            </View>
            )}
      </View>

      <View style={themedStyles.body}>
        <TextDefault style={themedStyles.name} textColor={tokens.colors.textPrimary} numberOfLines={1} bolder>
          {item?.name}
        </TextDefault>
        <View style={themedStyles.metaRow}>
          {rating
            ? (
              <>
                <MaterialIcons name='star' size={scale(13)} color='#F5A524' />
                <TextDefault style={themedStyles.ratingText} textColor={tokens.colors.textPrimary} numberOfLines={1}>
                  {rating}
                </TextDefault>
                <TextDefault style={themedStyles.metaText} textColor={tokens.colors.textMuted} numberOfLines={1}>
                  ({item.reviewCount > 999 ? '999+' : item.reviewCount})
                </TextDefault>
              </>
              )
            : (
              <View style={themedStyles.newBadge}>
                <TextDefault style={themedStyles.newBadgeText} textColor={tokens.colors.accentForeground} numberOfLines={1}>
                  {newLabel}
                </TextDefault>
              </View>
              )}
          {!!tag && (
            <TextDefault style={[themedStyles.metaText, themedStyles.tagText]} textColor={tokens.colors.textMuted} numberOfLines={1}>
              {' · '}{tag}
            </TextDefault>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export default React.memo(BrandCard)

const buildStyles = (tokens) => StyleSheet.create({
  card: {
    width: BRAND_CARD_WIDTH,
    borderRadius: tokens.radii.lg,
    backgroundColor: tokens.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.borderSubtle,
    overflow: 'hidden'
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.97 }]
  },
  cover: {
    height: COVER_HEIGHT,
    backgroundColor: tokens.colors.surfaceSubtle,
    overflow: 'hidden'
  },
  dimmed: {
    opacity: 0.45
  },
  watermark: {
    position: 'absolute',
    end: -scale(6),
    bottom: -scale(26),
    fontSize: scale(96),
    lineHeight: scale(110)
  },
  coverShade: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    height: COVER_HEIGHT * 0.55
  },
  timePill: {
    position: 'absolute',
    top: tokens.spacing.sm,
    end: tokens.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
    paddingHorizontal: scale(7),
    paddingVertical: scale(3),
    borderRadius: tokens.radii.round,
    backgroundColor: tokens.isDark ? 'rgba(24, 24, 27, 0.86)' : 'rgba(255, 255, 255, 0.92)'
  },
  closedPill: {
    position: 'absolute',
    top: tokens.spacing.sm,
    start: tokens.spacing.sm,
    paddingHorizontal: scale(7),
    paddingVertical: scale(3),
    borderRadius: tokens.radii.round,
    backgroundColor: 'rgba(24, 24, 27, 0.82)'
  },
  pillText: {
    fontSize: scale(10),
    lineHeight: scale(13),
    fontWeight: '600'
  },
  logoRing: {
    position: 'absolute',
    top: COVER_HEIGHT - LOGO_SIZE / 2 - LOGO_RING,
    start: tokens.spacing.md - LOGO_RING,
    width: LOGO_SIZE + LOGO_RING * 2,
    height: LOGO_SIZE + LOGO_RING * 2,
    borderRadius: (LOGO_SIZE + LOGO_RING * 2) / 2,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: tokens.isDark ? 0.4 : 0.14,
    shadowRadius: scale(6),
    shadowOffset: { width: 0, height: scale(2) },
    elevation: 3
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: tokens.colors.surfaceSubtle
  },
  logoFallback: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoInitial: {
    fontSize: scale(20),
    lineHeight: scale(24)
  },
  body: {
    paddingTop: LOGO_SIZE / 2 + scale(8),
    paddingHorizontal: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    gap: scale(4)
  },
  name: {
    fontSize: scale(14),
    lineHeight: scale(19)
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(3),
    minHeight: scale(18)
  },
  ratingText: {
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '700'
  },
  metaText: {
    fontSize: scale(12),
    lineHeight: scale(16)
  },
  tagText: {
    flexShrink: 1
  },
  newBadge: {
    paddingHorizontal: scale(6),
    paddingVertical: scale(1),
    borderRadius: tokens.radii.round,
    backgroundColor: tokens.colors.accentSubtle
  },
  newBadgeText: {
    fontSize: scale(10),
    lineHeight: scale(14),
    fontWeight: '700'
  }
})

// Cache per token object so the stylesheet isn't rebuilt on every render.
const stylesCache = new WeakMap()
const styles = (tokens) => {
  const cached = stylesCache.get(tokens)
  if (cached) return cached
  const created = buildStyles(tokens)
  stylesCache.set(tokens, created)
  return created
}
