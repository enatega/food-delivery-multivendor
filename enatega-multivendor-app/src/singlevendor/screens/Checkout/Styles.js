import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

// `props` is the checkout palette from useCheckoutPalette.
const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.canvas : '#F4F5F7'
    },
    scrollView: {
      flex: 1
    },
    contentContainer: {
      paddingHorizontal: 2,
      paddingTop: scale(4),
      paddingBottom: scale(220)
    },
    stickyBottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.surface : '#fff',
      borderTopLeftRadius: scale(24),
      borderTopRightRadius: scale(24),
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: 0,
      borderColor: props !== null ? props.borderStrong : 'rgba(24, 24, 27, 0.16)',
      paddingTop: scale(10),
      paddingHorizontal: scale(12),
      paddingBottom: scale(22),
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: props !== null && props.shadowOpacity ? 0.08 : 0,
      shadowRadius: 16,
      elevation: 12
    },
    placeOrderButton: {
      flexDirection: 'row',
      backgroundColor: props !== null ? props.brand : '#90E36D',
      minHeight: scale(50),
      paddingHorizontal: scale(8),
      borderRadius: scale(16),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scale(10)
    },
    placeOrderButtonDisabled: {
      backgroundColor: props !== null ? props.disabledBackground : '#E4E4E7'
    },
    placeOrderLock: {
      marginRight: scale(8)
    },
    placeOrderArrow: {
      position: 'absolute',
      right: scale(8),
      width: scale(34),
      height: scale(34),
      borderRadius: scale(12),
      backgroundColor: 'rgba(16, 32, 10, 0.10)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    placeOrderArrowDisabled: {
      backgroundColor: 'transparent'
    }
  })

export default styles
