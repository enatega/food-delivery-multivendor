import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    card: {
      backgroundColor: props?.colorBgTertiary,
      borderWidth: 1,
      borderColor: props?.newBorderColor2,
      marginHorizontal: scale(16),
      marginBottom: verticalScale(16),
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(14),
      borderRadius: scale(12)
    },
    freeDeliveriesCard: {
      paddingVertical: verticalScale(14)
    },
    label: {
      fontSize: scale(14),
      lineHeight: scale(20),
      marginBottom: verticalScale(8)
    },
    amount: {
      fontSize: scale(22),
      fontWeight: '700',
      lineHeight: scale(28),
      marginBottom: 0
    },
    freeDeliveriesAmount: {
      fontSize: scale(22),
      lineHeight: scale(28),
      marginBottom: 0
    }
  })

export default styles
