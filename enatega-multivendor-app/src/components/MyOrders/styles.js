import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.cartContainer : '#FFF',
      borderRadius: scale(5),
      elevation: 3,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      ...alignment.MRsmall,
      ...alignment.MLsmall,
      ...alignment.MTsmall
    },
    leftContainer: {
      width: '75%',
      ...alignment.PRxSmall,
      ...alignment.PLxSmall
    },
    rightContainer: {
      width: '25%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headingContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTlarge,
      ...alignment.PBlarge
    },
    line: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: props !== null ? props.horizontalLine : 'grey'
    },
    headingLine: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props !== null ? props.horizontalLine : 'grey'
    }
  })

export default styles
