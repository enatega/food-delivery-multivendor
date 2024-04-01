import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      borderColor: props !== null ? props.color9 : 'gray',
      borderWidth: scale(1),
      width: scale(20),
      height: scale(20),
      borderRadius: scale(4),
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
