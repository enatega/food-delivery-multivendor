import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.MTlarge,
      ...alignment.MBlarge
    },
    subContainer: {
      width: '85%',
      height: '100%'
    },
    marginTop10: {
      ...alignment.MTlarge
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    alignItemCenter: {
      alignItems: 'center'
    },
    twoContainers: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    width48: {
      width: '48%'
    },
    logoContainer: {
      width: 120,
      height: 130,
      alignSelf: 'center'
    },
    form: {
      width: '100%',
      ...alignment.MTlarge
    },
    textField: {
      borderColor: '#efefef',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: props !== null ? props.white : '#fff',
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
    passwordField: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    passwordInput: {
      width: '100%'
    },
    eyeBtn: {
      position: 'relative',
      display: 'flex',
      zIndex: 1,
      elevation: 999,
      marginTop: 20,
      marginLeft: -40
    },
    btn: {
      width: '70%',
      alignItems: 'center',
      backgroundColor: props !== null ? props.black : '#000',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 10
    },
    number: {
      display: 'flex',
      flexDirection: 'row'
    },
    countryCode: {
      flexDirection: 'row',
      width: '27%',
      marginRight: '3%'
    },
    phoneNumber: {
      width: '70%'
    },
    error: {
      marginTop: 3
    },
    errorInput: {
      backgroundColor: props !== null ? props.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props.errorInputBorder : '#DB4A39'
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })

export default styles
