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
      // paddingBottom: scale(20),
      margin: scale(15),
      backgroundColor: '#FAFAFA'
    },
    itemContainer: {
      // borderBottomWidth: StyleSheet.hairlineWidth,
      margin: scale(4),
      borderWidth: 1,
      borderColor: '#d8d8d874',
      borderRadius: scale(16),
      backgroundColor: '#f5f5f5',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLlarge,
      ...alignment.PRlarge
    }
  })
export default styles
