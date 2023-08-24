import { verticalScale, scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      height: height * 0.09,
      elevation: 1,
      borderTopRightRadius: scale(25),
      borderTopLeftRadius: scale(25),
      shadowColor: props !== null ? props.shadowColor : '#fefefe',
      shadowOffset: {
        width: 0,
        height: -verticalScale(2)
      },
      shadowOpacity: 0.8,
      shadowRadius: verticalScale(2),
      elevation: 10,
      backgroundColor: props !== null ? props.themeBackground : '#a92d2d',
      justifyContent: 'center',
      alignItems: 'center'
    },
    subContainer: {
      width: '90%',
      height: '70%',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row'
    },
    icon: {
      width: '8%',
      height: '55%',
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(15)
    },
    quantity: {
      borderWidth: 1,
      paddingLeft: scale(18),
      paddingRight: scale(18),
      paddingTop: scale(10),
      paddingBottom: scale(10),
      borderRadius: scale(10),
      borderColor: 'black'
    },
    btnContainer: {
      width: '60%',
      height: '90%',
      backgroundColor: props !== null ? props.main : 'black',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(10)
    }
  })
export default styles
