import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(10)
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: scale(5),
    paddingHorizontal: scale(10)
  },
  reviewCardSec:{
    paddingBottom:scale(20)
  },
  backImageContainer:{
    width:scale(30)
  }
})
