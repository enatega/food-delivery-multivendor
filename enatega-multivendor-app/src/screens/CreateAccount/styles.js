import { scale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonText : 'transparent'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f0eb'
    },
    image: {
      height: height * 0.5,
      width: '100%',
      marginBottom: scale(-20),

      flex: 1,
      backgroundColor: '#f3f0eb',
      shadowColor: '#f3f0eb',
      shadowOffset: { width: 16, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 19
    },
    image1: {
      height: '100%',
      width: '100%',
      // marginBottom: scale(-10),
      overflow: 'hidden'
    },
    subContainer: {
      alignSelf: 'center',
      width: '100%',
      flex: 1,
      borderTopLeftRadius: scale(30),
      borderTopRightRadius: scale(30),
      backgroundColor: props != null ? props.themeBackground : '#FFF',
      borderWidth: scale(1),
      borderColor: props != null ? props.borderBottomColor : '#DAD6D6'
    },
    signupContainer: {
      paddingVertical: scale(20),
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      flex: 1,
      justifyContent: 'space-between'
    },
    whiteColor: {
      backgroundColor: props !== null ? props.buttonText : 'transparent'
    },
    crossIcon: {
      width: scale(14),
      height: scale(14),
      ...alignment.MTlarge,
      ...alignment.MLlarge
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop10: {
      ...alignment.MTmedium
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    buttonBackground: {
      width: '100%',
      backgroundColor: props !== null ? props.newFontcolor : '#000',
      alignItems: 'center'
    },
    appleBtn: {
      width: '90%',
      alignSelf: 'center',
      height: height * 0.08
    },
    orText: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props.color6 : '#9B9A9A'
    },
    guestButton: {
      width: '90%',

      alignSelf: 'center',
      height: height * 0.08,
      flexDirection: 'row',
      alignItems: 'center',
      ...alignment.PRlarge,
      backgroundColor: 'transparent',
      justifyContent: 'space-evenly',
      borderRadius: scale(28),
      borderWidth: scale(1),
      borderColor: props !== null ? props.newIconColor : '#9B9A9A'
    }
  })
export default styles
