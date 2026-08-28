import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) => {
  const subtleBorder = props?.themeBackground === '#000'
    ? 'rgba(255, 255, 255, 0.13)'
    : 'rgba(15, 23, 42, 0.10)'

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#fff'
    },
    scrollView: {
      flex: 1
    },
    contentContainer: {
      paddingBottom: scale(210)
    },
    stickyBottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingTop: scale(10),
      paddingHorizontal: scale(12),
      paddingBottom: scale(22),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: subtleBorder,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 8
    },
    placeOrderButton: {
      backgroundColor: props !== null ? props.singleVendorBrand : '#90E36D',
      minHeight: scale(50),
      paddingVertical: scale(13),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scale(10)
    },
    placeOrderButtonDisabled: {
      backgroundColor: props !== null ? props.gray200 : '#E5E7EB'
    }
    // Small order fee tip moved to a separate component
  })
}

export default styles
