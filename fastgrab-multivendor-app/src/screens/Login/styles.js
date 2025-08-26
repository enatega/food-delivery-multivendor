import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      ...alignment.PTlarge
    },
    subContainer: {
      width: '90%',
      height: '100%',
      flex: 1,
      flexDirection: 'column'
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    marginTop10: {
      ...alignment.MTlarge
    },
    marginTop5: {
      ...alignment.MTmedium
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    loginBtn: {
      width: '40%',
      backgroundColor:
        props !== null ? props?.buttonBackgroundPink : 'transparent',
      justifyContent: 'center',
      alignItems: 'center'
    },
    appleBtn: {
      width: '100%'
    },

    form: {
      width: '100%',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between'
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
    errorInput: {
      backgroundColor: props !== null ? props?.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props?.errorInputBorder : '#DB4A39'
    },
    error: {
      ...alignment.MTxSmall
    },
    passwordField: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    passwordInput: {
      width: '100%'
    },
    eyeBtn: {
      elevation: scale(999),
      ...props?.isRTL ? {marginRight: -40} : {marginLeft: -40}
    },
    btn: {
      marginBottom: scale(20),
      position: 'relative',
      // marginTop: '55%',
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.main : '#000',
      alignSelf: 'center',
      padding: scale(15),
      borderRadius: scale(28),
      textAlign:'center'
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })
export default styles
