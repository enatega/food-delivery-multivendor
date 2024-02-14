import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  leftContainer: {
    width: '75%',
    alignItems: 'flex-start'
  },
  rightContainer: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    backgroundColor: theme.Pink.gray100,
    borderRadius: scale(20)
  }
})
export default styles
