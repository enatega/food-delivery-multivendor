import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'
import colors from '../../utilities/colors'
const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
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
    backgroundColor: colors.primary
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
