// styles.js
import { Dimensions, StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const { width } = Dimensions.get('window')
const GRID_HORIZONTAL_PADDING = scale(12)
const CATEGORY_GAP = scale(10)
const CONTENT_WIDTH = width - GRID_HORIZONTAL_PADDING * 2
const CATEGORY_CARD_WIDTH = (CONTENT_WIDTH - CATEGORY_GAP) / 2
const CATEGORY_IMAGE_HEIGHT = Math.max(scale(94), Math.min(scale(116), CATEGORY_CARD_WIDTH * 0.58))
const CATEGORY_TITLE_FONT_SIZE = Math.max(
  scale(12),
  Math.min(scale(15), Math.round(CATEGORY_CARD_WIDTH * 0.095))
)
const CATEGORY_TITLE_LINE_HEIGHT = Math.round(CATEGORY_TITLE_FONT_SIZE * 1.2)
const CATEGORY_TITLE_HEIGHT = CATEGORY_TITLE_LINE_HEIGHT * 2 + scale(2)
const CATEGORY_CARD_HEIGHT = CATEGORY_IMAGE_HEIGHT + CATEGORY_TITLE_HEIGHT + scale(20)
const POPULAR_ITEM_WIDTH = Math.max(scale(136), Math.min(scale(164), width * 0.4))
const POPULAR_ITEM_IMAGE_HEIGHT = Math.max(scale(94), Math.min(scale(108), POPULAR_ITEM_WIDTH * 0.68))
const POPULAR_ITEM_CARD_HEIGHT = POPULAR_ITEM_IMAGE_HEIGHT + scale(72)

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: scale(2),
      paddingBottom: scale(10),
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground
    },
    section: {
      marginBottom: scale(20),
      marginHorizontal: scale(12)
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
      paddingRight: scale(4)
    },
    popularItemCard: {
      width: POPULAR_ITEM_WIDTH,
      backgroundColor: props?.colors?.surface ?? props?.cardBackground ?? '#18181B',
      borderRadius: props?.radii?.lg ?? scale(14),
      minHeight: POPULAR_ITEM_CARD_HEIGHT,
      position: 'relative',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)',
      overflow: 'hidden'
    },
    popularItemImageWrap: {
      borderTopLeftRadius: props?.radii?.lg ?? scale(14),
      borderTopRightRadius: props?.radii?.lg ?? scale(14),
      overflow: 'hidden',
      backgroundColor: props?.colors?.surfaceSubtle ?? props?.themeBackground ?? '#F8FAFC'
    },
    plusButton: {
      position: 'absolute',
      top: scale(8),
      right: scale(8),
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      backgroundColor: props?.colors?.surfaceElevated ?? props?.plusIcon,
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
      borderTopLeftRadius: props?.radii?.lg ?? scale(14),
      borderTopRightRadius: props?.radii?.lg ?? scale(14)
    },
    popularItemInfo: {
      paddingHorizontal: scale(10),
      paddingTop: scale(9),
      paddingBottom: scale(10),
      minHeight: scale(62),
      justifyContent: 'space-between'
    },
    priceText: {
      ...props?.typeScale?.bodyStrong,
      color: props?.colors?.textPrimary ?? props?.fontMainColor,
      marginBottom: scale(3)
    },
    itemTitle: {
      ...props?.typeScale?.body,
      color: props?.colors?.textSecondary ?? props?.fontMainColor
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
      backgroundColor: props?.colors?.surface ?? props?.cardBackground ?? '#18181B',
      borderRadius: props?.radii?.lg ?? scale(14),
      minHeight: CATEGORY_CARD_HEIGHT,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)',
      overflow: 'hidden'
    },
    categoryCardShadow: {
      borderRadius: props?.radii?.lg ?? scale(14),
      backgroundColor: 'transparent'
    },
    categoryImageWrap: {
      borderTopLeftRadius: props?.radii?.lg ?? scale(14),
      borderTopRightRadius: props?.radii?.lg ?? scale(14),
      overflow: 'hidden',
      backgroundColor: props?.colors?.surfaceSubtle ?? props?.themeBackground ?? '#F8FAFC'
    },
    categoryImage: {
      width: '100%',
      height: CATEGORY_IMAGE_HEIGHT,
      borderTopLeftRadius: props?.radii?.lg ?? scale(14),
      borderTopRightRadius: props?.radii?.lg ?? scale(14)
    },
    categoryTitleContainer: {
      minHeight: CATEGORY_TITLE_HEIGHT,
      paddingHorizontal: scale(10),
      paddingTop: scale(9),
      paddingBottom: scale(10),
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    categoryTitle: {
      textAlign: 'center',
      fontSize: CATEGORY_TITLE_FONT_SIZE,
      lineHeight: CATEGORY_TITLE_LINE_HEIGHT,
      color: props?.colors?.textSecondary ?? props?.fontMainColor,
      includeFontPadding: false
    }
  })

export default styles
