import { StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'white'
    },
    itemContainer: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'black',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLlarge
    }
  })
export default styles
