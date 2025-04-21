import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width / 2 // Account for padding and gap

const styles = (props = null) =>
  StyleSheet.create({
    foodItemContainer: {
      backgroundColor: props?.cardBackground,
      width: width * 0.45,
      borderRadius: scale(20),
      padding: scale(10),
      marginBottom: scale(8),
      // marginRight: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      // minHeight: 290,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: scale(150),
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
      gap: scale(4)
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
      alignItems: 'center',
      justifyContent: 'center',
      right: scale(-35),
      top: scale(20),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
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
