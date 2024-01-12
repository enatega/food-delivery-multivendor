import { StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    bgColor: {
      backgroundColor: props !== null ? props.themeBackground : 'white'
    },
    container: {
      width: '100%',
      alignSelf: 'center',
      flex: 1
    },
    image: {
      alignSelf: 'center',
      height: 150,
      width: 250,
      ...alignment.MBlarge,
      ...alignment.MTmedium
    },
    walletImage: {
      alignSelf: 'center',
      height: 240,
      width: 250,
      ...alignment.MBlarge,
      ...alignment.MTmedium
    },
    innerContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      flex: 1,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      shadowColor: props !== null ? props.fontSecondColor : 'black',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      position: 'absolute',
      zIndex: 999,
      backgroundColor: props !== null ? props.black : 'black',
      borderRadius: 7,
      ...alignment.MLmedium
    }
  })
export default styles
