import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'

const buildStyles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      gap: 16
    },
    topbrandsSec: {
      gap: scale(8),
      marginBottom: scale(15)
    },
    sectionHeader: {
      marginBottom: 0
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
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F3F4F6',
      borderRadius: props?.radii?.tile ?? 12,
      width: props?.sizes?.compactTile ?? scale(80),
      height: props?.sizes?.compactTile ?? scale(80),
      overflow: 'hidden'
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
    brandMeta: {
      width: '100%',
      textAlign: 'center'
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
    },
    seeAllBtn: {
      minHeight: props?.sizes?.iconButton ?? scale(36),
      justifyContent: 'center',
      paddingHorizontal: props?.spacing?.xs ?? scale(4)
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
