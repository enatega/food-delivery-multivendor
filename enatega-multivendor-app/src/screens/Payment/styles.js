import { verticalScale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height } = Dimensions.get('window')
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    pT20: {
      ...alignment.PTmedium,
      ...alignment.PBxSmall
    },
    mainContainer: {
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent'
    },
    radioContainer: {
      width: '12%'
    },
    radioGroup: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center'
    },
    infoGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent',
      ...alignment.Pmedium,
      borderRadius: 20
    },
    backgroundImage: {
      width: 220,
      height: 220,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    iconContainer: {
      width: '25%',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center',
      ...alignment.MRxSmall
    },
    iconStyle: {
      height: verticalScale(20),
      width: verticalScale(35)
    },
    upperContainer: {
      height: height * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent'
    },
    lowerContainer: {
      ...alignment.Msmall,
      ...alignment.Psmall,
      flex: 1,
      borderRadius: 20,
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      alignSelf: 'center'
    }
  })
export default styles
