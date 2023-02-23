import { StyleSheet } from 'react-native'
import { scale } from '../utilities/scaling'

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -scale(6),
    top: 0,
    borderRadius: scale(9),
    width: scale(18),
    height: scale(18),
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default styles
