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
      ...alignment.PBmedium,
      ...alignment.PRmedium,
      backgroundColor: 'white',
      borderRadius: 20
    },
    paymentMethod: {
      backgroundColor: '#F3F4F8',
      borderRadius: 20,
      padding: 10,
      display: 'flex',
      alignItems: 'center',
      width: '80%',
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    mainContainer: {
      //backgroundColor: props !== null ? props.themeBackground : 'transparent',
      backgroundColor: '#6FCF97',
      borderBottomRightRadius: 35,
      borderBottomLeftRadius: 35,
      ...alignment.PTlarge,
      //...alignment.PBlarge,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      paddingBottom: 25
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
      width: verticalScale(25)
    }
  })
export default styles
