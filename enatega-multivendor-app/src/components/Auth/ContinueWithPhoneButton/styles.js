import { Dimensions, StyleSheet, Platform } from 'react-native'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    viaPhoneButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      height: height * 0.06,
      backgroundColor: props !== null ? props?.primaryBlue : '#0EA5E9',
      borderRadius: scale(8)
    }
  })
export default styles
