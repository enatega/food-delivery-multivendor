import { verticalScale } from '../../../utilities/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utilities/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'black',
      backgroundColor: 'transparent'
    },
    img: {
      width: verticalScale(120),
      height: verticalScale(120),
      borderRadius: verticalScale(35),
      borderWidth: 10,
      justifyContent: 'center',
      alignSelf: 'center',
      borderColor: props !== null ? props.horizontalLine : 'black',
      backgroundColor: props !== null ? props.primary : '#90EA93',
      color: '#000',
      ...alignment.MBmedium
    }
  })
export default styles
