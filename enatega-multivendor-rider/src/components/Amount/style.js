import { StyleSheet, Dimensions, Platform } from 'react-native'
import { alignment } from '../../utilities/alignment'

const { height, width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      height: height * 0.18,
      width: width * 0.8,
      alignSelf: 'center',
      alignItems: 'center',
      borderRadius: 20,
      padding: 30
    },
    bg: {
      backgroundColor: props !== null ? props.black : 'black'
    },
    shadow: {
      shadowColor: props !== null ? props.fontSecondColor : 'black',

      shadowOffset: {
        width: 0,
        height: 5
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10
    },
    amount: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: Platform.OS === 'android' ? null : 5,
      alignItems: 'center'
    },
    sign: {
      marginTop: 8,
      ...alignment.PRxSmall
    },
    icon: {
      marginTop: 5,
      ...alignment.PLsmall
    }
  })
export default styles
