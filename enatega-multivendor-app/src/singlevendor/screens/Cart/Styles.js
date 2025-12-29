import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/scaling';
import { alignment } from '../../../utils/alignment';

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
      paddingHorizontal: scale(16),
      paddingTop: scale(16)
      
    },
    recommendedSection: {
      paddingHorizontal: scale(16),
      paddingBottom: scale(20),
      // borderTopWidth: 1,
      // borderTopColor: props !== null ? props.gray200 : '#E5E7EB',
      paddingBottom: scale(100), // Add padding for sticky button
      overflow: 'visible'
    },
    stickyCheckoutContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
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
    checkoutButtonContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(20),
      paddingBottom: scale(40)
    },
    checkoutContainer: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
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
    totalContainer: {
      marginBottom: scale(12)
    },
    checkoutButton: {
      backgroundColor: props !== null ? props.primaryBlue : '#0EA5E9',
      paddingVertical: scale(12),
      paddingHorizontal: scale(20),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkoutButtonDisabled: {
      backgroundColor: '#F4F4F5'
    },
    checkoutButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(8)
    },
    cartBadge: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: scale(16),
      width: scale(18),
      height: scale(18),
      alignItems: 'center',
      justifyContent: 'center'
    },
    cartBadgeActive: {
      backgroundColor: '#fff'
    }
  });

export default styles;
