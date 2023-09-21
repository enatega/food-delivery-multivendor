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
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    subContainer: {
      width: '85%',
      height: '100%'
    },
    logoContainer: {
      width: scale(120),
      height: scale(130),
      alignSelf: 'center'
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop10: {
      ...alignment.MTlarge
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    actionBtn: {
      width: '50%',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textField: {
      borderColor: props !== null ? props.borderColor :'#efefef',
      borderWidth: scale(1),
      borderRadius: scale(10),
      backgroundColor: props !== null ? props.white : 'white',
      padding: scale(14),
      shadowColor: props !== null ? props.fontSecondColor : '#545454',
      shadowOffset: {
        width: scale(0),
        height: scale(2)
      },
      shadowOpacity: scale(0.25),
      shadowRadius: scale(3.84),
      elevation: scale(5),
      ...alignment.MTlarge
    },
    errorInput: {
      backgroundColor: props !== null ? props.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props.errorInputBorder : '#DB4A39'
    },
    error: {
      ...alignment.MTxSmall
    },
    btn: {
      width: '70%',
      alignItems: 'center',
      backgroundColor: props !== null ? props.black : '#000',
      alignSelf: 'center',
      padding: scale(15),
      borderRadius: scale(10),
      ...alignment.MTlarge
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
      marginLeft: scale(-40)
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })
export default styles
