import { scale, verticalScale } from '../../utils/scaling'
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
      backgroundColor: 'white',
      width: '95%',
      paddingLeft: scale(10),
      paddingRight: scale(10),
      height: verticalScale(70),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: scale(15)
    },
    buttonContainer: {
      width: '25%',
      height: '40%',
      borderRadius: scale(10),
      ...alignment.MTmedium,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonBackground : 'pink'
    }
  })
export default styles
