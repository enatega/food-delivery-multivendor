import { StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'
import colors from '../../utilities/colors'

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.themeBackground
  },
  itemContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.horizontalLine,
    ...alignment.PTlarge,
    ...alignment.PBlarge,
    ...alignment.PLlarge
  }
})
export default styles
