import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : '#ffff'
    },
    scrollViewContainer: {
      width: '100%',
      height: '100%'
    },
    subContainer: {
      width: '90%',
      alignSelf: 'center'
    },
    line: {
      marginLeft: 10,
      width: '95%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props.black : 'black'
    },
    input: {
      backgroundColor: theme.Pink.lightHorizontalLine,
      borderRadius: 10,
      height: 50,
      paddingLeft: 10,
      textAlignVertical: 'center'
    },
    inputContainer: {
      width: '90%',
      alignSelf: 'center',
      zIndex: 1,
      height: 200
    }
  })
export default styles
