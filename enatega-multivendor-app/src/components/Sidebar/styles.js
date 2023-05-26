import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) => {
  return StyleSheet.create({
    flex: {
      flex: 1
    },
    topContainer: {
      height: '30%',
      borderBottomColor: props !== null ? props.horizontalLine : 'transparent'
    },
    botContainer: {
      ...alignment.MTsmall,
      alignItems: 'center'
    },
    item: {
      height: '9.5%'
    },
    image: {
      flex: 1
    }
  })
}
export default styles
