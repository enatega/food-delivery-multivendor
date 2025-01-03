import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    ...alignment.MBsmall,
    justifyContent: 'space-between'
  },
  leftContainer: {
    width: '70%',
    flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  rightContainer: {
    width: '30%',
    flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'flex-end'
    },
    title: {
      paddingHorizontal: scale(10)
    }
})
export default styles
