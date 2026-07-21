import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    headerTitleContainer: {
      flex: 1,
      height: '100%',
      width: '95%',
      justifyContent: 'center'
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
      height: '100%',
      width: '90%',
      paddingLeft: scale(5),
      marginTop: scale(10)
    },
  })
}
export default styles