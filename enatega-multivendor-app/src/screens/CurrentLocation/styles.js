import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    screenBackground: {
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBlarge
    },
    image: {
      width: scale(100),
      height: scale(100)
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    emptyButton: {
      display: 'flex',
      flexDirection: 'row',
      width: '80%',
      height: '5%',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center'
    },
    linkButton: {
      ...alignment.Pmedium,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent'
    }
  })

export default styles
