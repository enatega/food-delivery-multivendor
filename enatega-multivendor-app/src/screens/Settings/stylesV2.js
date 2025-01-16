import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

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
      shadowColor: theme.Pink.black,
      shadowOpacity: 0.3,
      shadowRadius: scale(1),
      elevation: 5,
      borderWidth: 0.4,
      borderColor: '#e1e1e1'
    },
    backButton: {
      backgroundColor: theme.Pink.white,
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    mainContainerArea: {
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      borderRadius: scale(30),
      shadowOffset: { width: 0 },
      shadowColor: theme.Pink.black,
      shadowOpacity: 0.1,
      marginTop: scale(20)
    },
    mainContainer: {
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      ...alignment.PxSmall
    },
    languageContainer: {
      width: '100%',
      backgroundColor: props !== null ? props?.cartContainer : '#FFF',
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
      alignItems: 'center',
      justifyContent: 'space-between'
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
      backgroundColor: theme.Pink.deleteButton
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
