import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
export default StyleSheet.create({
  cancelButtonContainer: theme => ({
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.red600,
    borderWidth: 1,
    borderRadius: scale(25),
    margin: scale(20)
  })
})
