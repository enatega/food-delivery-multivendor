import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

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
      width: 120,
      height: 130,
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
      borderColor: '#efefef',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: '#fff',
      padding: 14,
      shadowColor: props !== null ? props.fontSecondColor : '#545454',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
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
      padding: 15,
      borderRadius: 10,
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
      marginTop: 32,
      marginLeft: -40
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })
export default styles
