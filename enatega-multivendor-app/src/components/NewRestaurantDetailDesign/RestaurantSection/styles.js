// styles.js
import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { Dimensions } from 'react-native'
import { subtleCardShadow, elevatedCardShadow } from '../../../utils/cardShadows'

const { width } = Dimensions.get('window')
const GRID_HORIZONTAL_PADDING = scale(15)
const CATEGORY_GAP = scale(12)
const CATEGORY_CARD_RADIUS = scale(16)
const CONTENT_WIDTH = width - GRID_HORIZONTAL_PADDING * 2
const CATEGORY_CARD_WIDTH = (CONTENT_WIDTH - CATEGORY_GAP) / 2
const CATEGORY_IMAGE_HEIGHT = Math.max(scale(94), Math.min(scale(116), CATEGORY_CARD_WIDTH * 0.58))
const CATEGORY_TITLE_FONT_SIZE = Math.max(
  scale(12),
  Math.min(scale(15), Math.round(CATEGORY_CARD_WIDTH * 0.095))
)
const CATEGORY_TITLE_LINE_HEIGHT = Math.round(CATEGORY_TITLE_FONT_SIZE * 1.2)
const CATEGORY_TITLE_HEIGHT = CATEGORY_TITLE_LINE_HEIGHT * 2 + scale(2)
const CATEGORY_CARD_HEIGHT =
  CATEGORY_IMAGE_HEIGHT + scale(12) + CATEGORY_TITLE_HEIGHT + scale(12)
const POPULAR_ITEM_WIDTH = Math.max(scale(138), Math.min(scale(176), width * 0.42))
const POPULAR_ITEM_IMAGE_HEIGHT = Math.max(scale(94), Math.min(scale(112), POPULAR_ITEM_WIDTH * 0.72))
const POPULAR_ITEM_CARD_HEIGHT = POPULAR_ITEM_IMAGE_HEIGHT + scale(86)

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: scale(2),
      paddingBottom: scale(10),
      backgroundColor: props?.themeBackground
    },
    section: {
      marginBottom: scale(12),
      marginHorizontal: scale(15)
    },
    sectionHeader: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(8)
    },
    changeText: {
      fontSize: scale(16),
      backgroundColor: props?.newButtonBackground,
      color: props?.newButtonText,
      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      borderRadius: scale(6)
    },
    popularList: {
      paddingRight: scale(10)
    },
    popularItemCard: {
      width: POPULAR_ITEM_WIDTH,
      marginRight: scale(10),
      backgroundColor: props?.cardBackground || props?.popularitemcard,
      borderRadius: scale(20),
      minHeight: POPULAR_ITEM_CARD_HEIGHT,
      position: 'relative',
      borderWidth: 1,
      borderColor: props?.newBorderColor || '#E5E7EB',
      ...elevatedCardShadow
    },
    popularItemImageWrap: {
      margin: scale(8),
      marginBottom: 0,
      borderRadius: scale(16),
      overflow: 'hidden',
      backgroundColor: props?.themeBackground || '#F8FAFC'
    },
    plusButton: {
      position: 'absolute',
      top: scale(12),
      right: scale(12),
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      backgroundColor: props?.plusIcon,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1
    },
    plusIcon: {
      color: props?.fontWhite,
      fontSize: scale(18),
      fontWeight: 'bold'
    },
    popularItemImage: {
      width: '100%',
      height: POPULAR_ITEM_IMAGE_HEIGHT,
      borderRadius: scale(16)
    },
    popularItemInfo: {
      paddingHorizontal: scale(12),
      paddingTop: scale(12),
      paddingBottom: scale(14),
      minHeight: scale(66),
      justifyContent: 'space-between'
    },
    priceText: {
      fontSize: scale(16),
      fontWeight: 'bold',
      color: props?.fontMainColor,
      marginBottom: scale(6)
    },
    itemTitle: {
      fontSize: scale(14),
      color: props?.fontMainColor,
      lineHeight: scale(18)
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 0
    },
    categoryWrapper: {
      width: '50%',
      paddingHorizontal: CATEGORY_GAP / 2,
      paddingBottom: CATEGORY_GAP / 2
    },
    categoryCard: {
      backgroundColor: props?.cardBackground || props?.popularitemcard,
      borderRadius: scale(20),
      minHeight: CATEGORY_CARD_HEIGHT,
      borderWidth: 1,
      borderColor: props?.newBorderColor || '#E5E7EB'
    },
    categoryCardShadow: {
      ...elevatedCardShadow,
      borderRadius: scale(20),
      backgroundColor: 'transparent'
    },
    categoryImageWrap: {
      margin: scale(8),
      marginBottom: 0,
      borderRadius: scale(16),
      overflow: 'hidden',
      backgroundColor: props?.themeBackground || '#F8FAFC'
    },
    categoryImage: {
      width: '100%',
      height: CATEGORY_IMAGE_HEIGHT,
      borderRadius: scale(16)
    },
    categoryTitleContainer: {
      minHeight: CATEGORY_TITLE_HEIGHT,
      paddingHorizontal: scale(12),
      paddingTop: scale(12),
      paddingBottom: scale(14),
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    categoryTitle: {
      textAlign: 'center',
      fontSize: CATEGORY_TITLE_FONT_SIZE,
      lineHeight: CATEGORY_TITLE_LINE_HEIGHT,
      color: props?.fontMainColor,
      includeFontPadding: false
    }
  })

export default styles
