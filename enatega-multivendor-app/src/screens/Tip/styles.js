import { verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mB10: {
      ...alignment.MBsmall
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    headerlineContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    headerLine: {
      borderBottomWidth: 1,
      borderColor: props !== null ? props.horizontalLine : 'grey'
    },
    upperContainer: {
      width: '100%',
      height: verticalScale(60),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    buttonContainer: {
      width: '25%',
      height: '70%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonBackground : 'pink'
    }
  })
export default styles
