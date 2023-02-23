import { verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    pT20: {
      ...alignment.PTmedium,
      ...alignment.PBmedium
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    radioContainer: {
      width: '15%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioGroup: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center'
    },
    iconContainer: {
      width: '25%',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center'
    },
    iconStyle: {
      height: verticalScale(20),
      width: verticalScale(35)
    }
  })
export default styles
