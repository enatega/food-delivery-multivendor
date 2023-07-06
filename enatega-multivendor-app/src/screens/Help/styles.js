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
      borderRadius: 50,
      marginLeft: 10,
      width: 55,
      alignItems: 'center'
    },
    mainContainer: {
      paddingBottom: 20,
      backgroundColor: 'white',
      margin: 15,
      borderRadius: scale(15)
    },
    itemContainer: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'grey',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLlarge
    }
  })
export default styles
