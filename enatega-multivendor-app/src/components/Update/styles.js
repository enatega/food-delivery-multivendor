import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: props !== null ? props.themeBackground : 'white',
      borderRadius: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    message: {
      marginBottom: 20,
    },
  })

export default styles
