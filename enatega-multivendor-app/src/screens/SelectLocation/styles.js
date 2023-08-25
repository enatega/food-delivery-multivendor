import { scale } from '../../utils/scaling'

const { StyleSheet } = require('react-native')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    button: {
      width: '100%',
      height: '8%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props != null ? props.buttonBackground : 'red'
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)'
    },
    mainContainer: {
      width: scale(50),
            height: scale(50),
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
