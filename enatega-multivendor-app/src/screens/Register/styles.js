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
      // width: 120,
      // height: 130,
      //alignSelf: 'center'
    },
    form: {
      width: '100%'
    },
    textField: {
      borderColor: props !== null ? props.verticalLine : '#000',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: props !== null ? props.white : '#fff',
      padding: 12,
      ...alignment.MBxSmall,
      ...alignment.MTxSmall
    },
    passwordField: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    passwordInput: {
      width: '100%',
      alignItems: 'center'
    },
    eyeBtn: {
      zIndex: 1,
      elevation: 999,
      marginLeft: -40
    },
    btn: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props.main : '#000',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 40
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
