import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'
import { subtleCardShadow } from '../../../utils/cardShadows'

const { width } = Dimensions.get('window')
const LIST_HORIZONTAL_PADDING = scale(42)
const LIST_GAP = scale(10)
const ITEM_CARD_WIDTH = Math.max(
  scale(148),
  Math.min(scale(210), (width - LIST_HORIZONTAL_PADDING - LIST_GAP) / 2)
)
const ITEM_IMAGE_HEIGHT = Math.max(scale(118), Math.min(scale(154), ITEM_CARD_WIDTH * 0.82))

const styles = (props = null) =>
  StyleSheet.create({
    foodItemContainer: {
      backgroundColor: props?.cardBackground,
      width: ITEM_CARD_WIDTH,
      borderRadius: scale(20),
      padding: scale(10),
      marginBottom: scale(8),
      ...subtleCardShadow
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: ITEM_IMAGE_HEIGHT,
      borderRadius: scale(15),
      overflow: 'hidden'
    },
    foodImage: {
      width: '100%',
      height: '100%'
    },
    addButton: {
      position: 'absolute',
      top: scale(10),
      right: scale(10),
      backgroundColor: props?.plusIcon,
      width: scale(24),
      height: scale(24),
      borderRadius: scale(15),
      justifyContent: 'center',
      alignItems: 'center'
    },
    detailsContainer: {
      marginTop: scale(10),
      gap: scale(4),
      minHeight: scale(44)
    },
    // Improved styles for out of stock items
    disabledItem: {
      opacity: 0.95
    },
    grayedImage: {
      opacity: 0.6
    },
    outOfStockRibbon: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'rgba(220, 53, 69, 0.9)',
      paddingVertical: scale(5),
      paddingHorizontal: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: '45deg' }],
      width: scale(150),
      right: scale(-35),
      top: scale(20),
      ...subtleCardShadow
    },
    outOfStockText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontSize: scale(10)
    },
    quantityContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scale(4)
    }
  })

export default styles
