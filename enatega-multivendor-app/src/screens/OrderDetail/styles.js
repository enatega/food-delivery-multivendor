import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale, verticalScale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
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
      backgroundColor: theme.themeBackground,
      justifyContent: 'center',
      ...alignment.Pmedium,
      borderColor: theme.borderLight,
      borderTopWidth: StyleSheet.hairlineWidth
    }),
    cancelButtonContainer: theme => ({
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.red600,
      borderWidth: 1,
      borderRadius: scale(25)
    }),
    dismissButtonContainer: theme => ({
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.red600,
      borderWidth: 1,
      borderRadius: scale(25)
    })
  })
export default styles
