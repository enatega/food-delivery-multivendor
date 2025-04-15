import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      backgroundColor: props != null ? props?.themeBackground : '#fff'
    },
    scrollViewContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: props != null ? props?.themeBackground : '#fff'
    },
    subContainer: {
      width: '90%',
      backgroundColor: props != null ? props?.themeBackground : '#fff',
      alignSelf: 'center'
    },
    scrollViewStyle: {
      backgroundColor: props != null ? props?.themeBackground : '#fff'
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: props != null ? props?.themeBackground : '#fff',
      zIndex: 3
    },
    titleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: props != null ? props?.themeBackground : '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: scale(32)
    },
    line: {
      marginLeft: scale(10),
      width: '95%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props?.black : 'black'
    },
    input: {
      backgroundColor: props !== null ? props?.themeBackground : 'black',
      borderRadius: scale(10),
      height: scale(50),
      paddingLeft: scale(10),
      textAlignVertical: 'center',
      borderWidth: 1,
      borderColor: props != null ? props?.verticalLine : '#B8B8B8',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    inputContainer: {
      alignSelf: 'center',
      zIndex: scale(1)
    },
    backBtnContainer: {
      borderRadius: scale(50),
      width: scale(55),
      alignItems: 'center'
    },
    descriptionText: {
      color: props != null ? props?.darkBgFont : 'white',
      fontSize: 13,
      paddingTop: scale(10),
      maxWidth: '100%',
      ...alignment.MRxSmall
    }
  })
export default styles
