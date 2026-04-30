import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) => {
  return StyleSheet.create({
    flex: {
      flex: 1
    },
    topContainer: {
      height: '30%',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props !== null ? props.horizontalLine : 'transparent'
    },
    botContainer: {
      ...alignment.MTsmall
    },
    item: {
      height: '9.5%',
      ...alignment.MBxSmall
    },
    iconContainer: {
      backgroundColor: theme.Pink.deleteButton
    }
  })
}
export default styles
