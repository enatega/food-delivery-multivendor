import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'

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
      paddingBottom: scale(220)
    },
    orderIdRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      alignSelf: props?.isRTL ? 'flex-end' : 'flex-start',
      gap: scale(4),
      marginTop: scale(10),
      marginHorizontal: scale(16),
      marginBottom: scale(4)
    },
    orderIdText: {
      fontSize: scale(12),
      lineHeight: scale(18)
    },
    stickyBottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      paddingTop: scale(10),
      paddingHorizontal: scale(16),
      paddingBottom: scale(30),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: props !== null ? props.colorBorder : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3
    },
    backButton: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: props !== null ? props.colorBgTertiary : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.colorBorder : '#E5E7EB'
    },
    helpButton: {
      ...alignment.PRsmall,
      padding: scale(8)
    },
    orderAgainButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      height: scale(50),
      backgroundColor: props !== null ? props.singleVendorBrand : '#003B6F',
      borderRadius: scale(8),
      marginTop: scale(12)
    },
    orderAgainButtonDisabled: {
      opacity: 0.6
    }
  })

export default styles
