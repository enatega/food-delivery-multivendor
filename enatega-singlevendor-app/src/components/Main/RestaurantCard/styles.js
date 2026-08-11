import { scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
const { width } = Dimensions.get('window')

export const RESTAURANT_CARD_WIDTH = Math.max(
  scale(196),
  Math.min(scale(224), width * 0.56)
)

const buildStyles = (props = null) => {
  const isDarkMode = props?.isDark
  const chipBackground = isDarkMode ? 'rgba(17, 24, 39, 0.82)' : 'rgba(255, 255, 255, 0.92)'
  const chipBorder = props?.colors?.borderSubtle ?? (isDarkMode ? 'rgba(161, 161, 170, 0.22)' : 'rgba(24, 24, 27, 0.10)')

  return StyleSheet.create({
    offerContainer: {
      borderRadius: props?.radii?.lg ?? 14,
      width: RESTAURANT_CARD_WIDTH,
      ...alignment.MRsmall,
      backgroundColor: 'transparent',
      marginTop: scale(2),
      marginBottom: scale(8),
      overflow: 'visible',
      // Match the restrained single-vendor card treatment. The outer wrapper
      // owns the shadow while cardSurface clips media and ripple content.
      shadowColor: props?.shadowColor ?? '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    compactOfferContainer: {
      width: Math.max(scale(180), Math.min(scale(204), width * 0.51))
    },
    cardSurface: {
      width: '100%',
      borderRadius: props?.radii?.lg ?? 14,
      overflow: 'hidden',
      backgroundColor: props?.colors?.surface ?? '#181818'
    },
    cardBody: {
      backgroundColor: props?.colors?.surface ?? '#181818'
    },
    overlayContainer: {
      position: 'absolute',
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: '100%',
      pointerEvents: 'box-none'
    },
    favouriteOverlay: {
      position: 'absolute',
      top: 10,
      ...props?.isRTL ? { left: 10 } : { right: 10 },
      width: scale(38),
      height: scale(28),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderRadius: scale(14),
      backgroundColor: chipBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: chipBorder
    },
    descriptionContainer: {
      paddingHorizontal: scale(11),
      paddingVertical: scale(10),
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: scale(6)
    },
    compactDescriptionContainer: {
      paddingHorizontal: scale(10),
      paddingVertical: scale(8),
      gap: scale(4)
    },
    titleRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: scale(8)
    },
    titleText: {
      flex: 1,
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    offerCategoty: {
      width: '100%',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    categoryText: {
      lineHeight: scale(18)
    },
    mainContainer: {
      paddingTop: scale(15),
      marginBottom: scale(6),
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      borderTopColor: '#ebebeb',
      borderTopWidth: scale(3)
    },
    restaurantImage: {
      width: '100%',
      height: '100%',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20)
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      width: '100%',
      aspectRatio: 1.48
    },
    compactImageContainer: {
      aspectRatio: 1.62
    },
    restaurantTotalRating: {
      paddingLeft: scale(5)
    },
    restaurantPriceContainer: {
      marginTop: scale(3),
      fontSize: 15
    },
    deliveryInfo: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(18)
    },
    metaRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: scale(4)
    },
    metaPill: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(3),
      paddingVertical: scale(3),
      paddingHorizontal: scale(2),
      borderRadius: scale(999)
    },
    border: {
      width: '100%',
      height: StyleSheet.hairlineWidth,
      backgroundColor: props?.colors?.borderSubtle ?? chipBorder
    },
    closedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(150, 150, 150, 0.7)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    badgeRow: {
      position: 'absolute',
      top: scale(10),
      ...(props?.isRTL ? { right: scale(10), left: scale(58) } : { left: scale(10), right: scale(58) }),
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    typeBadge: {
      paddingVertical: scale(5),
      paddingHorizontal: scale(10),
      borderRadius: scale(999),
      backgroundColor: chipBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: chipBorder
    },
    ratingBadge: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(4),
      paddingVertical: scale(5),
      paddingHorizontal: scale(9),
      borderRadius: scale(999),
      backgroundColor: chipBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: chipBorder
    }
  })
}

// NewRestaurantCard renders once per restaurant in every horizontal row on the
// Discovery page and calls styles(currentTheme) many times per render. Cache the
// built stylesheet per theme so it isn't rebuilt each time.
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
