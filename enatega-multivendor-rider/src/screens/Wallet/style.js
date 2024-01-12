import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'

const { width, height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    textView: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    btnView: {
      alignItems: 'center'
    },
    btn: {
      width: width * 0.8,
      borderRadius: 10,
      ...alignment.MBmedium,
      ...alignment.Pmedium
    },
    withdrawBtn: {
      backgroundColor: props != null ? props.primary : '#90EA93'
    },
    historyBtn: {
      borderWidth: 1
    },
    walletView: {
      height: height * 0.4,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageView: {
      ...alignment.MTlarge,
      ...alignment.MBlarge
    }
  })
export default styles
