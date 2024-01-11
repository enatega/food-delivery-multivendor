import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    scrollContainer: {
      justifyContent: 'center'
    },
    topContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center'
    },
    bgColor: {
      backgroundColor: props !== null ? props.white : 'white'
    },
    lowerContainer: {
      backgroundColor: props !== null ? props.green : 'green',
      flex: 7,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      justifyContent: 'space-around'
    },
    headingText: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputStyle: {
      borderBottomWidth: 0,
      borderRadius: 8,
      height: 50,
      width: '90%',
      backgroundColor: props !== null ? props.white : 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3
    }
  })
export default styles
