import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'
const { height } = Dimensions.get('window')


const styles = (props = null) => {  
  return StyleSheet.create({
    backdrop: {
      height: '80%'
    },
    layout: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      // height: 'auto',
      backgroundColor: props !== null ? props?.cardBackground : '#FFF',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingHorizontal: scale(20),
      paddingTop: scale(20),
      paddingBottom: scale(10),
      borderWidth: scale(1),
      borderColor: props !== null ? props?.customBorder : '#E5E7EB',
      justifyContent: 'center',
      flex: 1,
      // ...alignment.Psmall,
    },
    subContainer: {
      height: 500,
      width: '80%'
    },
    radioContainer: {
      width: '100%',
      backgroundColor: props !== null ? props?.cardBackground : '#FFF',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall,
      marginTop: scale(5),
      columnGap: 10
    },
    emptyButton: {
      display: 'flex',
      flexDirection: 'row',
      width: '82%',
      backgroundColor: props !== null ? props?.main : 'transparent',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(28),
      height: scale(40),
      margin: scale(10)
    },
    flexRow: {
      flex: 1,
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between'
    }
  })
}
export default styles
