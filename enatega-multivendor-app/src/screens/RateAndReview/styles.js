import { verticalScale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { textStyles } from '../../utils/textStyles'
const { height } = Dimensions.get('window')

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
      width: '40%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    reviewTextContainerImage: {
      width: '50%',
      height: '100%',
      justifyContent: 'center'
    },
    ratingContainer: {
      width: '100%',
      height: height * 0.1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    ratingSubContainer: {
      width: '70%',
      height: '60%'
    },
    inputContainer: {
      width: '100%',
      height: height * 0.1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputSubContainer: {
      width: '80%',
      height: '40%',
      borderBottomColor: props !== null ? props.horizontalLine : 'grey',
      borderBottomWidth: verticalScale(1)
    },
    textinput: {
      height: '100%',
      ...textStyles.Bold,
      ...textStyles.Normal
    },
    btnContainer: {
      width: '100%',
      height: height * 0.1,
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
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
