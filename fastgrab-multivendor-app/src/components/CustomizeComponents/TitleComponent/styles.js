import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      marginVertical: scale(10),
      justifyContent: 'space-between'
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(20),
    borderWidth:scale(1),
    borderColor:'#E5E7EB'
  }
})
export default styles
