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
    }
  })
export default styles
