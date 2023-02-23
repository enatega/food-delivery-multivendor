import { verticalScale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      height: height * 0.07,
      elevation: 1,
      shadowColor: props !== null ? props.shadowColor : '#fefefe',
      shadowOffset: {
        width: 0,
        height: -verticalScale(2)
      },
      shadowOpacity: 0.8,
      shadowRadius: verticalScale(2),
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
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
      width: '10%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnContainer: {
      width: '60%',
      height: '80%',
      backgroundColor: props !== null ? props.horizontalLine : 'black',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
