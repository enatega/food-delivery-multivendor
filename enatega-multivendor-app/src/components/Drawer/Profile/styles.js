import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1
    },
    logInContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
      ...alignment.PLsmall,
      ...alignment.PBlarge
    },
    loggedInContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    subContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    imgContainer: {
      width: scale(70),
      height: scale(70),
      borderRadius: scale(35),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.fontWhite : 'transparent',
      ...alignment.MBlarge
    }
  })

export default styles
