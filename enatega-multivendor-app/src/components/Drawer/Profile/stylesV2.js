import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.headerBackground : 'transparent'
    },
    logInContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
      ...alignment.PLsmall,
      ...alignment.PBlarge
    },
    alignLeft: {
      textAlign: 'left'
    },
    loggedInContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    subContainer: {
      width: '85%',
      height: '80%',
      justifyContent: 'space-between',
      ...alignment.MBlarge
    },
    imgContainer: {
      width: scale(70),
      height: scale(70),
      borderRadius: scale(35),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.fontWhite : 'transparent',
      ...alignment.MTlarge
    }
  })

export default styles
