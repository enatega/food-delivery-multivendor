import { StyleSheet } from 'react-native'
import { scale } from '../../../../../utils/scaling'
import { alignment } from '../../../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      paddingHorizontal: scale(15)
    },
    mainContainer: {
      flex: 1,
      // alignItems: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      ...alignment.PTlarge
    },
    form: {
      width: '100%',
      flex: 1,
      flexDirection: 'column'
    },
    textField: {
      borderColor: props !== null ? props?.borderColor : '#efefef',
      borderWidth: scale(1),
      borderRadius: scale(6),
      backgroundColor: props !== null ? props?.themeBackground : 'white',
      padding: scale(12),
      color: props !== null ? props?.newFontcolor : 'red',
      ...alignment.MBxSmall,
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    countryCode: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      width: '27%',
      marginRight: '3%'
    },
    phoneNumber: {
      width: '70%'
    },
    phoneFieldInner: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    errorInput: {
      borderColor: props !== null ? props?.errorInputBorder : '#DB4A39'
    },
    error: {
      fontSize: scale(14)
    },
    headerLeftIcon: {
      ...alignment.MLsmall,
      ...alignment.Psmall,
      backgroundColor: props !== null ? props?.colorBgTertiary : '#F4F4F5',
      borderRadius: scale(50)
    },
    number: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    btnContainer: {
      width: '100%',
      marginTop: scale(5)
    },
    btn: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.primaryBlue : '#000',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 40
    },

    numberContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      height: scale(50)
    },
    countryCodeContainer: {
      paddingHorizontal: scale(12),
      height: '100%',
      justifyContent: 'center',
      width: '20%'
    },
    countryCodeInner: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    countryCodeText: {
      marginHorizontal: scale(4)
    },
    divider: {
      width: 1,
      height: '60%'
    },
    phoneInputContainer: {
      flex: 1,
      height: '100%',
      justifyContent: 'center'
    },
    otpInput: {
      height: 70,
      color: '#000'
    },
    otpBox: {
      backgroundColor: props !== null ? props?.themeBackground : '#F7E7E5',
      color: props !== null ? props?.newFontcolor : '#F7E7E5',
      borderRadius: scale(6)
    },
    phoneField: {
      width: '80%',
      color: props !== null ? props?.newFontcolor : '#F7E7E5',
      fontSize: scale(14),
    }
  })
export default styles
