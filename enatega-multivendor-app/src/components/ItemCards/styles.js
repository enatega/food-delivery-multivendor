import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../utils/scaling'
const windowWidth = Dimensions.get('window').width
const styles = (props = null) =>
  StyleSheet.create({
    popularItems: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    card: {
      width: windowWidth / 2 - 30, // assuming 20 is the total margin/padding
      borderRadius: 8, // adjust border radius as per your requirement
      paddingTop: scale(17),
      paddingLeft: scale(17),
      paddingRight: scale(17),
      paddingBottom: scale(9),
      borderColor: '#E5E7EB',
      borderWidth: 1,
      flexGrow: 1
    },
    popularMenuPrice: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#fff',
      paddingTop: 5,
      paddingBottom: 5,
      width: '85%',
      borderRadius: 16,
      borderColor: '#E5E7EB',
      borderWidth: 1,
      marginTop: 5
    }
  })
export default styles
