import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    paymentMethod: {
      // backgroundColor: theme.Pink.lightHorizontalLine,
      borderRadius: scale(20),
      paddingVertical: scale(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContentL: 'center',
      gap: scale(7)
    },
    mainContainer: {
      backgroundColor: props != null ? props.themeBackground : 'white',
      ...alignment.PLmedium,
      ...alignment.PRmedium,
    },
    radioContainer: {
      width: '10%',
      alignItems: 'center',
      justifyContent: 'center',

    },
    horizontalLine: {
      borderWidth: 0.5,
      borderColor: props !== null ? props.iconBackground : 'white'
    },
    radioGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: scale(10),
    },
    iconContainer: {
      width: scale(25),
      flexDirection: 'row',
      alignItems: 'center'
    },
    iconStyle: {
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center',
    }
  })
export default styles
