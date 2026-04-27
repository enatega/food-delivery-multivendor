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
      backgroundColor:
        props !== null ? props?.headerBackgroundTwo : 'transparent'
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      ...alignment.PTlarge
    },
    subContainer: {
      width: '85%',
      height: '100%'
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
    logoContainer: {
      width: scale(120),
      height: scale(130),
      alignSelf: 'center'
    },
    form: {
      width: '100%',
      ...alignment.MTlarge
    },
    textField: {
      borderColor: props !== null ? props?.borderColor : '#efefef',
      borderWidth: scale(1),
      borderRadius: scale(10),
      backgroundColor: props !== null ? props?.white : '#fff',
      padding: scale(14),
      shadowColor: props !== null ? props?.fontSecondColor : '#545454',
      shadowOffset: {
        width: scale(0),
        height: scale(2)
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      ...alignment.MTlarge
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
      flexDirection: 'row'
    },
    passwordInput: {
      width: '100%'
    },
    eyeBtn: {
      marginTop: scale(32),
      marginLeft: scale(-40),
      elevation: scale(999)
    },
    btn: {
      position: 'relative',
      // marginTop: '55%',
      width: '70%',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.black : '#000',
      alignSelf: 'center',
      padding: scale(15),
      borderRadius: scale(10)
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })
export default styles
