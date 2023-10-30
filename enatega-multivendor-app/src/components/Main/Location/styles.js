import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    headerTitleContainer: {
      flex: 1,
      height: '100%',
      width: '95%',
      justifyContent: 'center',
      paddingBottom: scale(8),
    },
    headerContainer: {
      height: '100%',
      width: '110%',
      flexDirection: 'column-reverse',
      paddingLeft: scale(5),
      paddingTop: scale(10)
    },
    textContainer: {
      maxWidth: '100%',
      paddingTop: scale(2),
      paddingBottom: scale(2)
    }
  })
}
export default styles