import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: scale(12),
      marginBottom: scale(20),
      paddingBottom: scale(16),
      borderBottomWidth: 1,
      borderBottomColor: props !== null ? props?.gray200 : '#F3F4F6'
    },
    itemContainerLast: {
      borderBottomWidth: 0
    },
    imageContainer: {
      width: scale(80),
      height: scale(80),
      backgroundColor: '#F9F9F9',
      borderRadius: scale(12),
      overflow: 'hidden',
      flexShrink: 0
    },
    productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover'
    },
    mainContent: {
      flex: 1,
      minWidth: 0
    },
    descriptionRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginTop: scale(4),
      marginBottom: scale(8),
      gap: scale(6)
    },
    descriptionText: {
      flex: 1
    },
    bottomRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: scale(4)
    },
    quantityControls: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(12),
      flexShrink: 0
    },
    quantityButton: {
      width: scale(28),
      height: scale(28),
      alignItems: 'center',
      justifyContent: 'center'
    },
    quantityText: {
      minWidth: scale(20),
      textAlign: 'center'
    },
    itemsDropdown: {
      marginTop: scale(4),
      marginBottom: scale(8),
      paddingLeft: scale(12)
    }
  });

export default styles;
