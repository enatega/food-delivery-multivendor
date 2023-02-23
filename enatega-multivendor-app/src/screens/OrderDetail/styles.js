import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PTlarge,
      ...alignment.PBlarge
    },
    marginBottom20: {
      ...alignment.MBlarge
    },
    marginBottom10: {
      ...alignment.MBsmall
    },
    orderReceipt: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PBlarge
    },
    horizontalLine: {
      borderBottomColor: props !== null ? props.horizontalLine : 'pink',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    floatView: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center'
    }
  })
export default styles
