import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: scale(16),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props !== null ? props.colorBorder : '#E5E7EB'
    },
    itemContainerLast: {
      borderBottomWidth: 0
    },
    imageContainer: {
      marginRight: scale(12)
    },
    productImage: {
      width: scale(60),
      height: scale(60),
      borderRadius: scale(8)
    },
    mainContent: {
      flex: 1
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: scale(8)
    },
    titleText: {
      flex: 1
    },
    descriptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: scale(4),
      marginBottom: scale(8)
    },
    descriptionText: {
      flex: 1,
      marginRight: scale(8)
    },
    itemsDropdown: {
      marginTop: scale(8),
      marginBottom: scale(8),
      paddingLeft: scale(8)
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: scale(8)
    },
    priceBlock: {
      alignItems: 'flex-end',
      gap: scale(2)
    },
    originalPrice: {
      textDecorationLine: 'line-through'
    },
    dealBadge: {
      alignSelf: 'flex-end',
      backgroundColor: props !== null ? props.singleVendorBrand : '#90E36D',
      borderRadius: scale(5),
      overflow: 'hidden',
      paddingHorizontal: scale(6),
      paddingVertical: scale(3)
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props !== null ? props.gray100 : '#F3F4F6',
      borderRadius: scale(8),
      paddingHorizontal: scale(4),
      paddingVertical: scale(4)
    },
    quantityButton: {
      width: scale(28),
      height: scale(28),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(6)
    },
    quantityText: {
      marginHorizontal: scale(12),
      minWidth: scale(20),
      textAlign: 'center'
    },
    addToCartButton: {
      width: scale(25),
      height: scale(25),
      borderRadius: scale(20),
      backgroundColor: props !== null ? props.singleVendorBrand : '#90E36D',
      borderWidth: 1,
      borderColor: props !== null ? props.singleVendorBrand : '#90E36D',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3
    },
    disabledAddToCartButton: {
      backgroundColor: props !== null ? props.colorBgTertiary : '#E5E7EB',
      borderColor: props !== null ? props.colorBorder : '#D1D5DB',
      elevation: 0,
      opacity: 0.6,
      shadowOpacity: 0
    },
    outOfStockLabel: {
      alignSelf: 'flex-start',
      marginTop: scale(4)
    },
    orderHistoryQuantity: {
      fontSize: scale(12),
      fontWeight: '400'
    }
  })

export default styles
