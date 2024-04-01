import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
export const styles = (props) => StyleSheet.create({
  actionContainerBtns: {
    backgroundColor: props !== null ? props.newFontcolor :'#f0f0f0',
    justifyContent: 'center',
    borderRadius: scale(12),
    alignItems: 'center',
    padding: scale(5),
    marginRight: scale(10)
  },
  image: { height: scale(64), width: scale(64), flex: 1, borderRadius: 10 }
})
