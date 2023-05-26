import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      backgroundColor: props !== null ? props.secondaryBackground : '#fefefe'
    },
    scrollViewContainer: {
      width: '100%',
      height: '100%'
    },
    lowerContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.secondaryBackground : '#fefefe',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      marginTop: -30,
      ...alignment.Pmedium
    },
    subContainer: {
      width: '100%',
      alignSelf: 'center',
      borderRadius: scale(20),
      backgroundColor: props !== null ? props.themeBackground : '#fefefe',
      ...alignment.Pmedium
    },
    line: {
      width: '100%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props.horizontalLine : 'black'
    }
  })
export default styles
