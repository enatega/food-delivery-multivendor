import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      height: '92%'
    },
    fakeMarkerContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      marginTop: -scale(40),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    marker: {
      height: scale(40),
      width: scale(40),
      marginTop: -scale(40)
    },
    button: {
      position: 'absolute',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      height: '8%',
      width: '100%',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent'
    }
  })
export default styles
