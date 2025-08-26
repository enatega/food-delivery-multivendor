import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props?.cartContainer : '#FFF',
      borderRadius: scale(8),
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
      ...alignment.MRsmall,
      ...alignment.MLsmall,
      ...alignment.MTsmall,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall,
      ...alignment.PRsmall,
      ...alignment.PLxSmall
    },
    image: {
      height: '100%',
      width: '25%',
      borderRadius: scale(10)
    },
    textContainer: {
      width: '55%',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLsmall
    },
    leftContainer: {
      width: '95%'
    },
    rightContainer: {
      width: '20%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headingContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'grey',
      alignItems: 'center',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.MTsmall
    },
    line: {
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: props !== null ? props?.horizontalLine : 'grey'
    },
    headingLine: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props !== null ? props?.horizontalLine : 'grey'
    }
  })

export default styles
