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
    backgroundColor: theme === 'Dark' ? '#6B7280' : 'transparent',
    borderRadius: scale(20),
    borderWidth:scale(1),
    borderColor:'#6B7280'
  }
})
export default styles
