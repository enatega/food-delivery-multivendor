import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    map: {
      width: width,
      height: height * 0.3,
      marginTop: scale(-30)
    },
  })
export default styles
