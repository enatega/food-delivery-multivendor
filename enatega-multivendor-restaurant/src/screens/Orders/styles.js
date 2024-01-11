import { Dimensions, Platform, StyleSheet } from 'react-native'

const { height } = Dimensions.get('window')

const Styles = (props = null) =>
  StyleSheet.create({
    topContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center'
    },
    lowerContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      shadowColor: props !== null ? props.fontSecondColor : 'white',

      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
      flex: 0.7,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30
    },
    scrollView: {
      backgroundColor: 'transparent',
      marginBottom: Platform === 'ios' ? height * 0.1 : height * 0.1
    }
  })

export default Styles
