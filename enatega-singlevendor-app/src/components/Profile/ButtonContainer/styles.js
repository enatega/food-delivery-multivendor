import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    leftContainer: {
      height: scale(36),
      width: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props?.colors?.surfaceSubtle ?? 'transparent',
      borderRadius: props?.radii?.round ?? 25
    },
    flexRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      minHeight: scale(60),
      paddingHorizontal: props?.spacing?.lg ?? scale(16)
    },
    linkContainer: {
      flex: 1,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    mainLeftContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: scale(16)
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props.color6 : '#9B9A9A',
      paddingTop: scale(1)
    },
    padding: {
      ...alignment.PLmedium,
      ...alignment.PRmedium
    }
  })
export default styles
