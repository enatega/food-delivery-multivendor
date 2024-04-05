import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      backgroundColor: props != null ? props.themeBackground : '#fff'
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
      marginLeft: scale(10),
      width: '95%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props.black : 'black'
    },
    input: {
      backgroundColor: props !== null ? props.themeBackground : 'black',
      borderRadius: scale(10),
      height: scale(50),
      paddingLeft: scale(10),
      textAlignVertical: 'center',
      borderWidth: 1,
      borderColor: props != null ? props.verticalLine : '#B8B8B8',
    },
    inputContainer: {
      width: '90%',
      alignSelf: 'center',
      zIndex: scale(1)

    },
    backBtnContainer: {
      
      borderRadius: scale(50),
      width: scale(55),
      alignItems: 'center'
    }
  })
export default styles
