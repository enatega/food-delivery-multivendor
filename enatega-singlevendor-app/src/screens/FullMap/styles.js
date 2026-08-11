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
      top: scale(0),
      bottom: scale(0),
      left:scale(0),
      right: scale(0),
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
      bottom: scale(0),
      height: '8%',
      width: '100%',
      backgroundColor: props !== null ? props?.buttonBackground : 'transparent'
    },
    customMarkerContainer: {
      width: scale(50),
      height:scale(50),
      position: 'absolute',
      top: '46%',
      left: '50%',
      zIndex: 1,
      translateX: scale(-25),
      translateY: scale(-25),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: scale(-25) }, { translateY: scale(-25) }]
    }
  })
export default styles
