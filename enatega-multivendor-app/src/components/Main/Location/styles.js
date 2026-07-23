import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    headerTitleContainer: {
      flex: 1,
      height: '100%',
      width: '100%',
      justifyContent: 'center'
    },
    row: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginHorizontal: scale(10),
      gap: scale(8),
      minHeight: scale(34)
    },
    locationIcon: {
      backgroundColor: props != null ? props?.iconBackground : '#E5E7EB',
      width: scale(28),
      height: scale(28),
      borderRadius: scale(28),
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    headerContainer: {
      flex: 1,
      // Safety floor so the address column can never collapse to zero (which
      // left only the location icon visible). It fills the full title width when
      // available, but is guaranteed at least this much so the address always
      // renders next to the icon.
      minWidth: scale(150),
      justifyContent: 'center'
    },
    titleWrap: {
      // Keep the inner text able to shrink/ellipsize within headerContainer.
      minWidth: 0
    },
    titleText: {
      lineHeight: scale(18)
    },
    subtitleText: {
      lineHeight: scale(15)
    }
  })
}
export default styles
