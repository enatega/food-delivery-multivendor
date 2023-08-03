import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    map: {
      width: width,
      height: height * 0.3,
      marginTop: -30
    }
  })
export default styles
