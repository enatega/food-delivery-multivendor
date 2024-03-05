import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },

    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      ...alignment.PTsmall
    },

    headerLine: {
      borderBottomWidth: 1,
      borderColor: props !== null ? props.horizontalLine : 'grey'
    },
    upperContainer: {
      width: '100%',
      // height: verticalScale(80),
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'white',
      justifyContent: 'space-between'
    },

    innerContainer: {
      width: '72%'
      // height: verticalScale(40)
    },
    buttonContainer: {
      width: '25%',
      height: verticalScale(48),
      marginBottom: 7,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(6),
      backgroundColor: props !== null ? props.main : '#90E36D'
    }
  })
export default styles
