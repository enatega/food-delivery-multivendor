import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    backButton: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    mainContainer: {
      margin: scale(15),
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    itemContainer: {
      margin: scale(4),
      borderWidth: 1,
      borderColor: props !== null ? props.mustard : '#d8d8d874',
      borderRadius: scale(16),
      backgroundColor: props !== null ? props.radioOuterColor : 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLlarge,
      ...alignment.PRlarge
    },
    backImageContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    }
  })
export default styles
