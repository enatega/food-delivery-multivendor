import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      width: width * 0.85,
      alignItems: 'center',
      borderRadius: 20,
      padding: 20,
      paddingBottom: 0,
      shadowColor: props !== null ? props.fontSecondColor : 'black',

      shadowOffset: {
        width: 0,
        height: 5
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
      marginTop: -15,
      ...alignment.MBmedium
    },
    bgWhite: {
      backgroundColor: props !== null ? props.white : 'white'
    },
    bgPrimary: {
      backgroundColor: props !== null ? props.primary : '90EA93'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      ...alignment.MBsmall
    },
    rowItem1: {
      flex: 7
    },
    rowItem2: {
      flex: 5
    },
    horizontalLine: {
      width: width * 0.78,
      borderBottomColor: props !== null ? props.black : 'black',
      borderBottomWidth: 1
    },
    timeLeft: {
      marginTop: 25
    },
    time: {
      marginTop: -8,
      ...alignment.MLxSmall
    },
    btn: {
      backgroundColor: props !== null ? props.black : 'black',
      borderRadius: 10,
      marginTop: 10,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center'
    },
    pt5: {
      paddingTop: 5
    },
    pt15: {
      paddingTop: 16
    },

    badge: {
      display: 'flex',
      alignSelf: 'flex-end',
      width: 16,
      height: 16,
      borderRadius: 8,
      zIndex: 999,
      elevation: 999
    },
    bgRed: {
      backgroundColor: props !== null ? props.orderUncomplete : 'red'
    },
    bgBlack: {
      backgroundColor: props !== null ? props.black : 'black'
    }
  })
export default styles
