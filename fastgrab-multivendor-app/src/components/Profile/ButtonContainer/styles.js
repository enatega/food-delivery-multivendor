import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
import { Dimensions } from 'react-native'
const {height} = Dimensions.get('screen')

const styles = (props = null) =>
  StyleSheet.create({
    leftContainer: {
      height: scale(30),
      width: scale(30),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.gray100 : 'transparent',
      borderRadius: 25
    },
    flexRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginVertical: scale(10),
    },
    linkContainer: {
      flex: 1,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
