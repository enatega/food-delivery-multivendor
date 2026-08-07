import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
const styles = (props = null) =>
  StyleSheet.create({
    container: {
      paddingTop: props?.spacing?.md ?? scale(12),
      paddingBottom: props?.spacing?.xs ?? scale(4)
    },
    topContainer: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: scale(12),
      paddingHorizontal: scale(2)
    },
    titleContainer: {
      flex: 1,
      minWidth: 0
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: scale(6),
      flexShrink: 0
    },
    discountedPrice: {
      textDecorationLine: 'line-through'
    },
    descContainer: {
      width: '100%',
      paddingHorizontal: scale(2),
      paddingTop: scale(4)
    }
  })
export default styles
