import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
const styles = (props = null) =>
  StyleSheet.create({
    topContainer: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.MTsmall,
      paddingHorizontal: scale(10),
      zIndex: 9999
    },
    titleContainer: {
      width: 'auto',
      ...alignment.MTsmall,
      ...alignment.MBsmall
    },
    priceContainer: {
      width: '30%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      ...alignment.MTsmall,
      ...alignment.MBsmall
    },
    descContainer: {
      width: '100%',
      ...alignment.MBsmall
    }
  })
export default styles
