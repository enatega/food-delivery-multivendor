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
      height: '100%'
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
      backgroundColor: 'rgba(0,0,0,0.3)'
    },
    touchArea: {
      position: 'absolute',
      top: scale(20),
      left: scale(10),
      width: scale(30),
      height: scale(30),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props != null ? props : '#FFF',
      borderRadius: scale(15)
    }
  })
export default styles
