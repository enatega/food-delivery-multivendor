import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'

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
      marginLeft:  scale(10),
      width: '95%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props.black : 'black'
    },
    input: {
      backgroundColor: props !== null ? props.radioOuterColor : 'black',
      borderRadius:  scale(10),
      height:  scale(50),
      paddingLeft:  scale(10),
      textAlignVertical: 'center'
    },
    inputContainer: {
      width: '90%',
      alignSelf: 'center',
      zIndex:  scale(1),
      height: scale(200),
    
    },
    backBtnContainer: {
      backgroundColor:props !== null ? props.white : 'white',
      borderRadius:  scale(50),
      width:  scale(55),
      alignItems: 'center'
    }
  })
export default styles
