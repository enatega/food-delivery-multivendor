import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
const styles = (props = null) =>
  StyleSheet.create({
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: scale(7),
      borderRightWidth: scale(7),
      borderBottomWidth: scale(8),
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: props !== null ? props?.themeBackground : 'black'
    }
  })
export default styles
