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
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.white : 'white'
    },
    topContainer: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center'
    },
    image: {
      width: 150,
      height: 140
    },
    languageContainer: {
      backgroundColor: props !== null ? props.green : 'green',
      flex: 7,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingTop: 20
    },
    headingText: {
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 20
    },
    languageButton: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: props !== null ? props.white : 'white',
      borderRadius: 8,
      alignItems: 'center',
      width: '80%'
    },
    languageText: {
      fontSize: 16,
      backgroundColor: props !== null ? props.white : 'white',
      color: props !== null ? props.black : 'black'
    },
    goBackContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props !== null ? props.white : 'white',
      width: '40%',
      borderRadius: 5,
      marginTop: -50
    },
    innerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
export default styles
