import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'

const buildStyles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      gap: 0
    },
    topbrandsSec: {
      marginTop: scale(20),
      marginBottom: scale(10)
    },
    sectionHeader: {
      paddingHorizontal: props?.spacing?.md ?? scale(12),
      marginBottom: scale(15)
    },
    brandImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 8
    },
    topbrandsContainer: {
      width: props?.sizes?.compactTile ?? scale(80),
      alignItems: 'center'
    },
    brandImgContainer: {
      position: 'relative',
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F3F4F6',
      borderRadius: props?.radii?.tile ?? 12,
      width: props?.sizes?.compactTile ?? scale(80),
      height: props?.sizes?.compactTile ?? scale(80),
      overflow: 'hidden'
    },
    deliveryBadge: {
      position: 'absolute',
      right: scale(5),
      bottom: scale(5),
      minHeight: scale(22),
      paddingHorizontal: scale(6),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(3),
      borderRadius: props?.radii?.round ?? scale(999),
      backgroundColor: props?.isDark ? 'rgba(24, 24, 27, 0.88)' : 'rgba(255, 255, 255, 0.90)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    deliveryBadgeText: {
      fontSize: scale(9),
      lineHeight: scale(12),
      fontWeight: '600'
    },
    brandTextContainer: {
      width: '100%',
      alignItems: 'center'
    },
    brandName: {
      marginTop: scale(6),
      marginBottom: scale(2),
      // Responsive but clamped so it's neither oversized nor overflowing.
      fontSize: Math.min(Math.max(scale(12), 11), 14),
      lineHeight: scale(16),
      textAlign: 'center',
      // Reserve two lines so every card's delivery-time row aligns.
      minHeight: scale(32)
    },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      paddingBottom: scale(16)
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props?.fontSecondColor : '#B8B8B8'
    },
    brandsPlaceHolderContainer: {
      backgroundColor: props != null ? props?.cartContainer : '#B8B8B8',
      borderRadius: scale(3),
      paddingHorizontal: scale(20)
    },
    height80: {
      height: scale(80)
    }
  })

// Cache the built stylesheet per theme so it isn't rebuilt on every render.
const NULL_KEY = { __nullTheme: true }
const stylesCache = new WeakMap()

const styles = (props = null) => {
  const key = props ?? NULL_KEY
  const cached = stylesCache.get(key)
  if (cached) return cached
  const created = buildStyles(props)
  stylesCache.set(key, created)
  return created
}

export default styles
