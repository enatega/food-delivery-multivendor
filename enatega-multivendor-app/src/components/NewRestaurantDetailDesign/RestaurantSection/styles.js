// styles.js
import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { Dimensions } from 'react-native'
import { subtleCardShadow, elevatedCardShadow } from '../../../utils/cardShadows'

const { width } = Dimensions.get('window')
const GRID_HORIZONTAL_PADDING = scale(15)
const CATEGORY_GAP = scale(12)
const CATEGORY_CARD_RADIUS = scale(16)
const CATEGORY_IMAGE_HEIGHT = scale(100)
const CATEGORY_TITLE_FONT_SIZE = Math.max(
  scale(12),
  Math.min(scale(15), Math.round((width - GRID_HORIZONTAL_PADDING * 2 - CATEGORY_GAP) / 2 * 0.095))
)
const CATEGORY_TITLE_LINE_HEIGHT = Math.round(CATEGORY_TITLE_FONT_SIZE * 1.2)
const CATEGORY_TITLE_HEIGHT = CATEGORY_TITLE_LINE_HEIGHT * 2 + scale(2)
const CATEGORY_CARD_HEIGHT =
  CATEGORY_IMAGE_HEIGHT + scale(12) + CATEGORY_TITLE_HEIGHT + scale(12)
const POPULAR_ITEM_WIDTH = width * 0.35

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: scale(8),
      paddingBottom: scale(10),
      backgroundColor: props?.themeBackground
    },
    section: {
      marginBottom: scale(15),
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
      backgroundColor: props?.popularitemcard,
      borderRadius: scale(16),
      overflow: 'hidden',
      height: '100px',
      position: 'relative',
      ...elevatedCardShadow
    },
    plusButton: {
      position: 'absolute',
      top: scale(8),
      right: scale(8),
      width: scale(24),
      height: scale(24),
      borderRadius: scale(12),
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
      height: scale(100),
      borderTopLeftRadius: scale(16),
      borderTopRightRadius: scale(16)
    },
    popularItemInfo: {
      padding: scale(10)
    },
    priceText: {
      fontSize: scale(16),
      fontWeight: 'bold',
      color: props?.plusIcon,
      marginBottom: scale(4)
    },
    itemTitle: {
      fontSize: scale(14),
      color: props?.fontMainColor
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
      backgroundColor: props?.popularitemcard,
      borderRadius: CATEGORY_CARD_RADIUS,
      overflow: 'hidden',
      height: CATEGORY_CARD_HEIGHT
    },
    categoryCardShadow: {
      ...subtleCardShadow,
      borderRadius: CATEGORY_CARD_RADIUS,
      backgroundColor: 'transparent'
    },
    categoryImage: {
      width: '100%',
      height: CATEGORY_IMAGE_HEIGHT
    },
    categoryTitleContainer: {
      minHeight: CATEGORY_TITLE_HEIGHT,
      paddingHorizontal: scale(10),
      paddingTop: scale(10),
      paddingBottom: scale(12),
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
