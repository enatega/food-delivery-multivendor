import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    pT20: {
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      ...alignment.PRmedium,
      ...alignment.MTmedium,
      backgroundColor: props != null? props.radioOuterColor : 'white',
      borderRadius: scale(20)
    },
    paymentMethod: {
      backgroundColor: theme.Pink.lightHorizontalLine,
      borderRadius: scale(20),
      padding: scale(10),
      display: 'flex',
      alignItems: 'center',
      width: '80%',
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    mainContainer: {
      backgroundColor: props != null? props.themeBackground : 'white',
      borderBottomRightRadius: scale(35),
      borderBottomLeftRadius: scale(35),
      ...alignment.PTlarge,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      paddingBottom: scale(25)
    },
    radioContainer: {
      width: '15%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    backButton: {
      backgroundColor: theme.Pink.white,
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    radioGroup: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
 
    },
    iconContainer: {
      width: '25%',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center'
    },
    iconStyle: {
      height: verticalScale(20),
      width: verticalScale(25)
    }
  })
export default styles
