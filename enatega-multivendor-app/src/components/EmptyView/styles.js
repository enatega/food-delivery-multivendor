import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    mainContainerEmpty: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      paddingTop: scale(100)
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center'
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBlarge
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    emptyButton: {
      width: '60%',
      height: scale(40),
      backgroundColor: props !== null ? props.main : 'transparent',
      borderRadius: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    }
  })

export default styles
