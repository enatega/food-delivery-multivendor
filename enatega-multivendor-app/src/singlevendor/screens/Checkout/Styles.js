import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    scrollView: {
      flex: 1
    },
    contentContainer: {
      paddingBottom: scale(20)
    },
    stickyBottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingTop: scale(12),
      paddingHorizontal: scale(16),
      paddingBottom: scale(30),
      borderTopWidth: 1,
      borderTopColor: props !== null ? props.gray200 : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5
    },
    placeOrderButton: {
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9',
      paddingVertical: scale(14),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scale(12)
    },
    placeOrderButtonDisabled: {
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB'
    }
  });

export default styles;
