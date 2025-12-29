import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: props !== null ? props.gray200 : '#E5E7EB'
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
    }
  });

export default styles;
