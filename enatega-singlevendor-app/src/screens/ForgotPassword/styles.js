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
      ...alignment.MTlarge,
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      flexDirection: 'column',
      justifyContent: 'space-between'
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
      backgroundColor: props !== null ? props?.buttonBackground : 'transparent',
      justifyContent: 'center',
      alignItems: 'center'
    },
    emailHeading: {
      paddingBottom: scale(15)
    },
    textField: {
      borderColor: props !== null ? props?.borderColor : '#efefef',
      borderWidth: scale(1),
      borderRadius: scale(6),
      backgroundColor: props !== null ? props?.themeBackground : 'white',
      padding: scale(12),
      color: props !==null ? props?.newFontcolor : 'red',
      shadowColor: props !== null ? props?.fontSecondColor : '#545454',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    errorInput: {
      backgroundColor: props !== null ? props?.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props?.errorInputBorder : '#DB4A39'
    },
    error: {
      ...alignment.MTxSmall
    },
    btn: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.main : '#F7E7E5',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 40,
      ...alignment.MTlarge
    },
    passwordField: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    enterPass: {
      paddingBottom: scale(15)
    },
    confirmField: {
      marginTop: scale(15)
    },
    passwordInput: {
      width: '100%'
    },
    eyeBtn: {
      marginLeft: scale(-40),
      elevation: scale(999)
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })
export default styles
