import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale, verticalScale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    screen: {
      flex: 1,
      backgroundColor: props?.colors?.canvas
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: scale(28)
    },
    mapCard: {
      height: scale(238),
      marginHorizontal: scale(12),
      marginTop: scale(10),
      borderRadius: scale(16),
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle
    },
    map: {
      flex: 1
    },
    statusSection: {
      paddingHorizontal: scale(12),
      paddingTop: scale(16),
      paddingBottom: scale(6)
    },
    statusHeading: {
      marginBottom: scale(12),
      lineHeight: scale(25)
    },
    estimateRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: scale(8),
      marginBottom: scale(14)
    },
    contentInset: {
      paddingHorizontal: scale(12)
    },
    container: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PTlarge,
      ...alignment.PBlarge
    },
    marginBottom20: {
      ...alignment.MBlarge
    },
    marginBottom10: {
      ...alignment.MBsmall
    },

    orderReceipt: (theme) => ({
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: -verticalScale(2)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(2),
      borderRadius: 20,
      backgroundColor: theme.white
    }),

    horizontalLine: {
      borderBottomColor: props !== null ? props?.horizontalLine : 'pink',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    review: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    floatView: {
      flexDirection: 'row',
      padding: 7,
      width: '60%',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: 'black',
      margin: 15
    },
    paymentCard: {
      backgroundColor: props?.colors?.surface,
      borderColor: props?.colors?.borderSubtle,
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      marginHorizontal: scale(12),
      marginTop: scale(12),
      padding: scale(14)
    },
    paymentHeader: {
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between'
    },
    paymentBreakdown: {
      borderTopColor: props?.colors?.borderSubtle,
      borderTopWidth: StyleSheet.hairlineWidth,
      marginTop: scale(12),
      paddingTop: scale(12)
    },
    cancelButtonContainer: (theme) => ({
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.red600,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: scale(12)
    }),
    cancelWrap: {
      marginHorizontal: scale(12),
      marginTop: scale(12)
    },
    dismissButtonContainer: (theme) => ({
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.red600,
      borderWidth: 1,
      borderRadius: scale(25)
    })
  })
export default styles
