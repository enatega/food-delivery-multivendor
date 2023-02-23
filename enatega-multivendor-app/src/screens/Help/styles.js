import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
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
