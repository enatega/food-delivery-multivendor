import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
  mainContainer: {
    width: '90%',
    alignSelf: 'center',
    height: height * 0.07,
    flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    borderRadius: scale(28),
    borderWidth: scale(1),
    borderColor: props !== null ? props?.newIconColor : '#9B9A9A',
    gap: scale(15)
  }
  })
export default styles

