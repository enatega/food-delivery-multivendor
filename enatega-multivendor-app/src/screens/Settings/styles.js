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
      shadowOffset: { width: 0, height: scale(2) },
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: scale(1),
      elevation: 5,
      borderWidth: 0.4,
      borderColor: '#e1e1e1'
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.PxSmall
    },
    languageContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : '#FFF',
      borderRadius: scale(12),
      ...alignment.PRmedium,
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLmedium
    },
    changeLanguage: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      ...alignment.MBsmall
    },
    button: {
      width: '15%',
      alignItems: 'flex-end'
    },
    notificationContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      ...alignment.MTxSmall
    },
    notificationChekboxContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center'
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    deleteButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(10),
      borderRadius: scale(6),
      backgroundColor: '#fe0000'
    },
    deleteButtonText: {
      color: 'white',
      fontSize: scale(18),
      fontWeight: '600'
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
    }
  })

export default styles
