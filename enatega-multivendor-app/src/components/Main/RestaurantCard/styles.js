import { scale } from '../../../utils/scaling'
import { Dimensions, Platform, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { subtleCardShadow } from '../../../utils/cardShadows'
const { width } = Dimensions.get('window')

const CARD_WIDTH = Math.max(scale(228), Math.min(scale(292), width * 0.74))
const CARD_IMAGE_HEIGHT = Math.max(scale(150), Math.min(scale(198), CARD_WIDTH * 0.62))
const CARD_DESCRIPTION_MIN_HEIGHT = Math.max(scale(92), Math.min(scale(118), CARD_WIDTH * 0.36))
const CARD_HEIGHT =
  CARD_IMAGE_HEIGHT +
  CARD_DESCRIPTION_MIN_HEIGHT +
  (Platform.OS === 'ios' ? scale(8) : scale(4))

const buildStyles = (props = null) => {
  const isDarkMode = props?.cardBackground === '#181818' || props?.themeBackground === '#000'
  const chipBackground = isDarkMode ? 'rgba(17, 24, 39, 0.82)' : 'rgba(255, 255, 255, 0.92)'
  const chipBorder = isDarkMode ? 'rgba(255, 255, 255, 0.14)' : '#E5E7EB'

  return StyleSheet.create({
    offerContainer: {
      borderRadius: 22,
      width: CARD_WIDTH,
      minHeight: CARD_HEIGHT,
      ...alignment.MRsmall,
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      ...subtleCardShadow
    },
    cardSurface: {
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      borderWidth: 1,
      borderColor: props != null ? (isDarkMode ? props?.lightHorizontalLine : props?.newBorderColor) : '#232323'
    },
    cardBody: {
      flex: 1,
      backgroundColor: props != null ? props?.cardBackground : '#181818'
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
      borderWidth: 1,
      borderColor: chipBorder
    },
    descriptionContainer: {
      paddingHorizontal: scale(12),
      paddingTop: scale(12),
      paddingBottom: Platform.OS === 'ios' ? scale(10) : scale(8),
      width: '100%',
      minHeight: CARD_DESCRIPTION_MIN_HEIGHT,
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: scale(6)
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
      height: CARD_IMAGE_HEIGHT
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
      gap: scale(8),
      flexWrap: 'wrap'
    },
    metaPill: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(4),
      paddingVertical: scale(6),
      paddingHorizontal: scale(9),
      borderRadius: scale(999),
      backgroundColor: chipBackground,
      borderWidth: 1,
      borderColor: chipBorder
    }, 
    border: {
      width: '100%',
      height: 1,
      borderWidth: 1,
      borderColor: props != null ? (isDarkMode ? props?.lightHorizontalLine : props?.iconBackground) : '#E5E7EB',
      borderStyle: 'solid',
      opacity: 0.8
    },
    closedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(150, 150, 150, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
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
      borderWidth: 1,
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
      borderWidth: 1,
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
