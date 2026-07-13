import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
  mainContainer: {
    width: '100%',
    alignSelf: 'center',
    height: height * 0.06,
    flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    backgroundColor: props !==null ? props?.colorBgTertiary : '#F4F4F5',
    justifyContent: 'center',
    borderRadius: scale(8),
    gap: scale(15)
  }
  })
export default styles

