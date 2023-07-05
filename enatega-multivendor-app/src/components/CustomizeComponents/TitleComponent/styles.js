import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    ...alignment.MBxSmall
  },
  leftContainer: {
    width: '75%'
  },
  rightContainer: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    backgroundColor: theme.Pink.buttonBackground,
    borderRadius: 20
  }
})
export default styles
