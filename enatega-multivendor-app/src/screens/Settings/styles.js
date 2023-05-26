import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    width85: {
      width: '85%'
    },
    shadow: {
      shadowOffset: { width: 0, height: scale(0.5) },
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: scale(1),
      elevation: 3,
      borderWidth: 0.4,
      borderColor: props !== null ? props.secondaryBackground : '#FFF'
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    languageContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : '#FFF',
      ...alignment.PRmedium,
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLmedium,
      borderRadius: 10
    },
    changeLanguage: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      ...alignment.MBsmall
    },
    button: {
      width: '15%',
      alignItems: 'flex-end',
      backgroundColor: props !== null ? props.secondaryBackground : '#FFF',
      justifyContent: 'center',
      borderRadius: 5,
      ...alignment.PxSmall
    },
    notificationContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.secondaryBackground : '#FFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: scale(20),
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      ...alignment.MTsmall
    },
    notificationChekboxContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center'
    },
    versionContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      ...alignment.MTlarge
    },
    modalContainer: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: verticalScale(4),
      ...alignment.Plarge
    },
    radioContainer: {
      width: '100%',
      backgroundColor: '#FFF',
      flexDirection: 'row',
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    modalButtons: {
      ...alignment.Msmall,
      marginBottom: 0,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    topContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTmedium,
      ...alignment.PBmedium
    },
    lowerContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      shadowColor: props !== null ? props.fontSecondColor : 'grey',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
      flex: 0.7,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      ...alignment.Psmall
    }
  })

export default styles
