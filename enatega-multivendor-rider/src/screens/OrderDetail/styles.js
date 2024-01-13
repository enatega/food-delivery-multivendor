import { Dimensions, StyleSheet } from 'react-native'
const { height, width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    map: {
      width: width,
      height: height * 0.4
    },
    iconView: {
      position: 'absolute'
    },
    icon: {
      position: 'absolute',
      backgroundColor: props != null ? props.black : '#000',
      borderRadius: 5,
      marginLeft: 15,
      marginTop: 10,
      overflow: 'hidden'
    },
    spinner: {
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center'
    },
    loading: {
      position: 'absolute',
      zIndex: 999,
      elevation: 999,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
export default styles
