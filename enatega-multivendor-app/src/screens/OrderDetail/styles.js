import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { verticalScale } from '../../utils/scaling'

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
      borderBottomColor: props !== null ? props.horizontalLine : 'pink',
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
    }
  })
export default styles
