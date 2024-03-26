import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainerEmpty: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    container: {
      backgroundColor: props !== null ? props.newheaderBG : 'transparent'
    },
    contentContainer: {
      flexGrow: 1,
      ...alignment.PBsmall
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
      width: '60%',
      height: scale(40),
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      borderRadius: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
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
