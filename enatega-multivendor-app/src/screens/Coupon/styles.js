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
      width: '95%',
      height: verticalScale(80),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props !== null ? props.radioOuterColor : 'white',
      justifyContent: 'space-between',
      paddingLeft: scale(10),
      paddingRight: scale(10),
      borderRadius: scale(6),
      marginTop: scale(30)
    },
    innerContainer: {
      width: '70%',
      paddingTop: scale(10)
    },
    buttonContainer: {
      width: '25%',
      height: '55%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(6),
      backgroundColor: props !== null ? props.buttonBackground : 'pink'
      // ...alignment.MTsmall
    }
  })
export default styles
