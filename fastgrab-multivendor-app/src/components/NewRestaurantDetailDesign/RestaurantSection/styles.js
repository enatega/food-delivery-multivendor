// styles.js
import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width * 0.35

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: scale(15),
      backgroundColor: props?.themeBackground
    },
    section: {
      marginBottom: scale(25)
    },
    sectionHeader: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(15)
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
      paddingRight: scale(15)
    },
    popularItemCard: {
      width: ITEM_WIDTH,
      marginRight: scale(15),
      backgroundColor: props?.popularitemcard,
      borderRadius: scale(16),
      overflow: 'hidden',
      height: '100px',
      position: 'relative',
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 4 }, // Shadow offset for iOS
      shadowOpacity: 0.25, // Shadow opacity for iOS
      shadowRadius: 4, // Shadow radius for iOS
      elevation: 5 // Shadow for Android
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
      marginHorizontal: -scale(5)
    },
    categoryWrapper: {
      width: '50%',
      padding: scale(5)
    },
    categoryCard: {
      backgroundColor: props?.popularitemcard,
      borderRadius: scale(16),
      overflow: 'hidden'
    },
    categoryImage: {
      width: '100%',
      height: scale(100)
    },
    categoryTitle: {
      padding: scale(12),
      textAlign: 'center',
      fontSize: scale(16),
      color: props?.fontMainColor
    }
  })

export default styles
