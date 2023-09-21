import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    ...alignment.MBsmall
  },
  leftContainer: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightContainer: {
    width: '20%',
    justifyContent: 'center'
  }
})
export default styles
