import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: scale(10)
  },
  leftContainer: {
    width: '75%',
    alignItems: 'flex-start'
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(20),
    borderWidth:scale(1),
    borderColor:'#E5E7EB'
  }
})
export default styles
