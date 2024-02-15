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
    backgroundColor: theme.Pink.gray100,
    borderRadius: scale(20)
  }
})
export default styles
