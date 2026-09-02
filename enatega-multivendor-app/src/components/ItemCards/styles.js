import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../utils/scaling'
const windowWidth = Dimensions.get('window').width
const GRID_HORIZONTAL_PADDING = scale(34)
const GRID_GAP = scale(10)
const CARD_WIDTH = Math.max(
  scale(148),
  Math.min(scale(210), (windowWidth - GRID_HORIZONTAL_PADDING - GRID_GAP) / 2)
)
const CARD_IMAGE_WIDTH = Math.max(scale(106), Math.min(scale(138), CARD_WIDTH - scale(24)))
const CARD_IMAGE_HEIGHT = Math.round(CARD_IMAGE_WIDTH * 0.87)
const buildStyles = (props = null) =>
  StyleSheet.create({
    button: {
      borderRadius: props?.radii?.lg ?? scale(14),
      overflow: 'hidden'
    },
    popularItems: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    card: {
      width: CARD_WIDTH,
      minHeight: Math.max(scale(192), CARD_WIDTH * 1.18),
      borderRadius: props?.radii?.lg ?? scale(14),
      padding: scale(12),
      backgroundColor: props?.colors?.surface ?? '#FFFFFF',
      borderColor: props?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)',
      borderWidth: StyleSheet.hairlineWidth,
      flexGrow: 1
    },
    image: {
      width: CARD_IMAGE_WIDTH,
      height: CARD_IMAGE_HEIGHT,
      borderRadius: props?.radii?.md ?? scale(10)
    },
    popularMenuPrice: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: 'transparent',
      paddingTop: 5,
      paddingBottom: 5,
      width: '100%',
      marginTop: 5
    },
    priceText: {
      color: props?.colors?.textPrimary ?? '#18181B',
      fontSize: scale(12),
      fontWeight: '600'
    }
  })

// Cache the built stylesheet per theme so repeated calls across every rendered
// card don't rebuild the StyleSheet each time.
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
