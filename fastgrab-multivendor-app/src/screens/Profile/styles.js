import { scale } from '../../utils/scaling'
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
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    containerInfo: {
      width: '100%',
      ...alignment.MTmedium
    },
    mainContainer: {
      flex: 1,
      // ...alignment.Pmedium,
    },
    formSubContainer: {
      borderRadius: scale(8),
      flexDirection: 'row',
      width: '92%',
      backgroundColor: props !== null ? props?.color5 : 'transparent',
      alignSelf: 'center',
      elevation: 1,
      borderWidth: props !== null && props?.gray200 !== '#E5E7EB' ? 0 : 1,
      borderColor: props !== null ? props?.gray200 : '#E5E7EB',
      ...alignment.MTsmall,
      ...alignment.Psmall
    },
    flexRow: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between'
    },
    containerHeading: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    headingTitle: {
      width: '50%'
    },

    headingLink: {
      flex: 1,
      ...alignment.MRxSmall,
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    headingButton: {
      marginLeft: scale(5),
      justifyContent: 'center',
      ...alignment.PLmedium
    },
    saveContainer: {
      backgroundColor: props !== null ? props?.main : '#90E36D',
      padding: scale(8),
      borderRadius: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(120)
    },
    bacKButton: {
      backgroundColor: 'white',
      borderRadius: scale(50),
      width: scale(40),
      alignItems: 'flex-start',
      marginLeft: scale(5)
    },
    verifiedButton: {
      padding: scale(8),
      borderRadius: scale(16),
      marginTop: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(120)
    },

    // Model for password changing
    modalContainer: {
      backgroundColor: props !== null ? props?.themeBackground : '#FFF',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 10,
      borderRadius: scale(20),
      shadowOpacity: 0,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 16,
      paddingRight: 16
    },
    modalContent: {
      width: '90%'
    },
    titleContainer: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: props !== null ? props?.radioOuterColor : 'white'
    },
    modalHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    btnContainer: {
      backgroundColor: props !== null ? props?.color3 : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: scale(40),
      borderRadius: 40,
      borderWidth: 1,
      borderColor: props !== null ? props?.borderColor : 'black'
    },
    titleContainer: {
      backgroundColor: props !== null ? props?.themeBackground : 'white',
      color: props !== null ? props?.darkBgFont : 'white',
      paddingTop: scale(8),
      fontSize: scale(20),
      fontWeight: '600'
    },
    phoneDetailsContainer: {
      display: 'flex',
      flexDirection: 'row'
    },
    //Modal
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      filter: 'blur(10)'
    },
    modalView: {
      width: '90%',
      alignItems: 'flex-start',
      gap: 24,
      margin: 20,
      backgroundColor: props !== null ? props?.themeBackground : 'white',
      borderWidth: scale(1),
      borderColor: props !== null ? props?.color10 : 'white',
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
      backgroundColor: props !== null ? props?.white : 'white',
      borderWidth: 1,
      borderColor: props !== null ? props?.black : 'black'
    },
    btnDelete: {
      backgroundColor: props !== null ? props?.red600 : '#DC2626'
    },
    modalInput: {
      height: scale(40),
      borderWidth: 1,
      borderColor: props != null ? props?.verticalLine : '#B8B8B8',
      padding: 5,
      borderRadius: 6,
      color: props !== null ? props?.newFontcolor : '#f9f9f9'
    },
    modal: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 16,
      paddingRight: 16
    },
    nameView:{
      ...alignment.MTlarge,
      ...alignment.MBlarge,
      alignItems: 'center'
    },
    line: {
      width: '100%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props?.color6 : '#9B9A9A',
      ...alignment.MTsmall
    },
    favView: {
      ...alignment.MTlarge,
    },
    orderAgainView: {
      ...alignment.MTlarge,
    },
    offerScroll: {
      height: height * 0.4,
      width: '100%'
    },
    linkContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...alignment.MLxSmall
    },
    mainLeftContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    leftContainer: {
      height: scale(35),
      width: scale(35),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.gray100 : 'transparent',
      borderRadius: 25
    },
    line: {
      height: 0.5,
      backgroundColor: props !== null ? props?.borderBottomColor : '#DAD6D6',
    },

    drawerContainer: {
      ...alignment.PLlarge
    },
    settingView: {
      ...alignment.MTlarge,
    },
    quickLinkView: {
      ...alignment.MTlarge,
    },
    seeAll: {
      backgroundColor: props !== null ? props?.newButtonBackground : '#F3FFEE',
      ...alignment.Psmall,
      borderRadius: scale(5),
    },
    padding: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
    }
  })
export default styles
