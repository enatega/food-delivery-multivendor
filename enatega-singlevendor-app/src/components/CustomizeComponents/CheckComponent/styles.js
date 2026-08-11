import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      minHeight: scale(42),
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    leftContainer: {
      flex: 1,
      minWidth: 0,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    rightContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-end',
      flexShrink: 0
    },
    title: {
      paddingHorizontal: scale(10),
      flexShrink: 1
    }
  })
export default styles
