import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'
import { Dimensions } from 'react-native'
const {height} = Dimensions.get('screen')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    formContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
    },
    containerInfo: {
      width: '100%',
      ...alignment.MTmedium
    },
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
    },
    subContainer: {
      ...alignment.MTmedium
    },
    //Modal
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    modalView: {
      width: '90%',
      alignItems: 'flex-start',
      gap: 24,
      margin: 20,
      backgroundColor: props !== null ? props.themeBackground : 'white',
      borderWidth: scale(1),
      borderColor: props !== null ? props.color10 : 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    btn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      height: scale(50),
      borderRadius: 40
    },
    btnCancel: {
      backgroundColor: props !== null ? props.white : 'white',
      borderWidth: 1,
      borderColor: props !== null ? props.black : 'black'
    },
    btnDelete: {
      backgroundColor: props !== null ? props.red600 : '#DC2626'
    },
    modalInput: {
      height: scale(40),
      borderWidth: 1,
      borderColor: props != null ? props.verticalLine : '#B8B8B8',
      padding: 5,
      borderRadius: 6,
      color: props !== null ? props.newFontcolor : '#f9f9f9'
    },
    modal: {
      backgroundColor: props != null ? props.themeBackground : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 16,
      paddingRight: 16
    },
    width85: {
      width: '70%',
      //backgroundColor: theme.Pink.deleteButton
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
      width: scale(40),
      alignItems: 'flex-start',
      marginLeft: scale(5)
    },
    mainContainerArea: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
    },
    languageContainer: {
      width: '100%',
      // backgroundColor: props !== null ? props.gray100 : '#FFF',
      // backgroundColor: 'red',
      // borderRadius: scale(10),
      // borderWidth: 1,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignSelf: 'center',
      // borderColor: props !== null ? props.gray200 : '#E5E7EB',
      // ...alignment.PRmedium,
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      borderBottomWidth: 0.2,
      borderBottomColor: props !== null ? props.color6 : '#9B9A9A'
      // ...alignment.PLmedium
    },
    changeLanguage: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      width: '100%',
      ...alignment.MBsmall
    },
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    notificationContainer: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      ...alignment.MTxSmall
    },
    notificationChekboxContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.MLxSmall,
      ...alignment.MRsmall,
    },

    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    deleteButton: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
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
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      borderRadius: verticalScale(4),
      ...alignment.Plarge,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      borderWidth:scale(1),
      borderRadius:scale(10)

    },
    radioContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    modalButtonsContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-end'
    },
    modalButtons: {
      ...alignment.Msmall,
      marginBottom: 0,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    checkboxSettings: {
      marginBottom: scale(10),
       alignItems: 'center'
    },
    legalView: {
      ...alignment.MTmedium,
    },
    containerButton: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      width: '90%',
      height: scale(40),
      bottom: verticalScale(0),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      ...alignment.MTmedium,
      ...alignment.PBlarge
    },
    addButton: {
      backgroundColor: props !== null ? props.color3 : 'transparent',
      borderWidth: 2,
      borderColor: props !== null ? props.red600 : '#DC2626',
      width: '100%',
      height: scale(40),
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    contentContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    line: {
      height: 0.5,
      backgroundColor: props !== null ? props.borderBottomColor : '#f9f9f9',
    },
    padding: {
      ...alignment.Pmedium
    },
    flexRow: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between'
    },
    linkContainer: {
      flex: 1,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...alignment.MTsmall
    },
    leftContainer: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(5),
    },
  })
export default styles
