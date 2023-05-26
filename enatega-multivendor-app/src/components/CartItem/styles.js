import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%'
    },
    actionContainer: {
      width: '20%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.cartContainer : 'transparent'
    },
    actionContainerBtns: {
      width: '33%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    actionContainerView: {
      width: '33%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
