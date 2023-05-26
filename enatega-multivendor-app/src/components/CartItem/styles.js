import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      paddingVertical: 15
    },
    actionContainer: {
      width: '25%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props !== null ? props.cartContainer : 'transparent'
    },
    actionContainerBtns: {
      width: 20,
      height: 20,
      backgroundColor: props !== null ? props.tagColor : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50
    },
    actionContainerView: {
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      ...alignment.PxSmall,
      borderRadius: scale(5),
      marginHorizontal: 10,
      width: 30
    }
  })
export default styles
