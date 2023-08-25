import { Dimensions, StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')
const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      height: height * 0.25,
      width: '100%'
    },
    headerImage: {
      width: '100%',
      height: '100%',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20
    },
    headingTitle: {
      position: 'absolute',
      bottom: scale(10),
      left: scale(30)
    },
    overlayContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    touchArea: {
      position: 'absolute',
      top: scale(20),
      left: scale(10),
      width: scale(50),
      height: scale(30),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: scale(15)
    },
    deliveryBoxContainer: {
      backgroundColor:
        props != null ? props.customizeOpacityBtn : 'transparent',
      padding: scale(10),
      borderRadius: scale(10),
      borderColor: 'white',
      borderWidth: 1,
      width: '45%',
      alignItems: 'center',
      alignSelf: 'center'
    },
    deliveryBox: {
      color: 'white',
      backgroundColor: 'black',
      borderRadius: scale(5),
      padding: scale(5)
    },
    animatedIconStyle: {
      fontSize: scale(20)
    },
    deliveryBoxText: {
      paddingRight: scale(5),
      paddingLeft: scale(5)
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: scale(10),
      paddingBottom: scale(10)
    },
    backArrow: {
      color: props != null ? props.black : '#FFF',
      fontSize: scale(20),
      backgroundColor: 'white',
      paddingLeft: scale(15),
      paddingRight: scale(15),
      paddingBottom: scale(5),
      paddingTop: scale(5),
      borderRadius: scale(22)
    }
  })
export default styles
