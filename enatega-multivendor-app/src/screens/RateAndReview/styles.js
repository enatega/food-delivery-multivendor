import { scale, verticalScale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { textStyles } from '../../utils/textStyles'
const { height } = Dimensions.get('window')
import { theme } from '../../utils/themeColors'
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    reviewTextContainer: {
      width: '100%',
      height: height * 0.1,
      alignItems: 'flex-end'
    },
    reviewTextSubContainer: {
      width: '100%',
      height: '100%',
      flexDirection: 'row'
    },
    reviewTextContainerText: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    reviewText: {
      padding: scale(10),
      marginTop: scale(20)
    },
    reviewTextContainerImage: {
      width: '50%',
      height: '100%',
      justifyContent: 'center'
    },
    ratingContainer: {
      width: '100%',
      height: height * 0.15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    ratingSubContainer: {
      paddingTop: scale(10),
      width: '55%',
      height: '60%'
    },
    inputContainer: {
      width: '90%',
      height: height * 0.15,
      backgroundColor: '#f0f0f0',
      alignSelf: 'center',
      borderRadius: scale(20)
    },
    inputSubContainer: {
      width: '100%',
      borderBottomColor: props !== null ? 'transparent' : 'grey',
      borderBottomWidth: verticalScale(1)
    },
    mainView: {
      backgroundColor: 'rgba(0, 0, 0, 0.74)',
      padding: scale(10),
      borderRadius: scale(10),
      borderColor: theme.Pink.white,
      borderWidth: 1,
      width: '45%',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: scale(80),
      marginTop: scale(-140)
    },
    line: {
      backgroundColor: theme.Pink.black,
      height: 0.5,
      width: '90%',
      alignSelf: 'center'
    },
    textinput: {
      marginTop: scale(10),
      padding: scale(20),
      height: '100%',
      width: '90%',
      ...textStyles.Bold,
      ...textStyles.Normal
    },
    btnContainer: {
      width: '80%',
      height: height * 0.1,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnSubContainer: {
      width: '80%',
      height: '60%'
    },
    btnTouch: {
      flex: 1,
      backgroundColor: props !== null ? props.buttonBackground : 'grey',
      borderRadius: scale(10),
      justifyContent: 'center',
      alignItems: 'center'
    },
    backImageContainer: {
      backgroundColor: 'white',
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    }
  })
export default styles
