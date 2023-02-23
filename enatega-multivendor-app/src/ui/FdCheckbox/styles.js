import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      borderColor: props !== null ? props.horizontalLine : 'grey',
      borderWidth: StyleSheet.hairlineWidth,
      width: scale(20),
      height: scale(20),
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
