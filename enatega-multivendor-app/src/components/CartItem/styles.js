import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%'
    },
    actionContainer: {
      width: '27%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.cartContainer : 'transparent'
    },
    actionContainerBtns: {
      width: '24%',
      backgroundColor: props !== null ? props.main : 'transparent',
      justifyContent: 'center',
      borderRadius: scale(20),
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    actionContainerView: {
      width: '33%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 0.2,
      borderRadius: scale(5),
      padding: scale(5),
      margin: scale(8)
    }
  })
export default styles
