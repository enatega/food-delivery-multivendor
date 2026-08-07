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
      paddingBottom: scale(104)
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
      paddingHorizontal: scale(18),
      paddingTop: scale(20),
      paddingBottom: scale(10)
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

    orderReceipt: theme => ({
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
    bottomContainer: (theme) => ({
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      // height: scale(80),
      backgroundColor: theme.colors?.surface || theme.themeBackground,
      justifyContent: 'center',
      paddingHorizontal: scale(14),
      paddingTop: scale(10),
      paddingBottom: scale(12),
      borderColor: theme.colors?.borderSubtle || theme.borderLight,
      borderTopWidth: StyleSheet.hairlineWidth
    }),
    cancelButtonContainer: theme => ({
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.red600,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: scale(12)
    }),
    cancelWrap: {
      marginTop: scale(10)
    },
    dismissButtonContainer: theme => ({
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.red600,
      borderWidth: 1,
      borderRadius: scale(25)
    })
  })
export default styles
