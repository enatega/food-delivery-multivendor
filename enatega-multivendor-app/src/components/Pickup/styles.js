import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    tabStyles: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 40
    },
    tabContainer: {
      margin: scale(15),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: props?.borderLight
    },
    tabHeading: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '700'
    },
    tabSubHeading: {
      fontSize: 20,
      fontWeight: '500'
    },
    tabSubHeadingActive: {
      borderBottomWidth: 2,
      borderBottomColor: props?.newFontcolor,
      paddingBottom: scale(10)
    },
    activeLabel: {
      flex: 1,
      justifyContent: 'flex-end',
      // borderBottomWidth: 1,
      // borderBottomColor: props !== null ? props.tagColor : 'transparent',
      height: scale(35),
      alignItems: 'center'
      // marginRight: scale(-15),
    },
    labelButton: {
      flex: 1,
      // borderWidth: StyleSheet.hairlineWidth,
      // borderColor: props !== null ? props.horizontalLine : 'transparent',
      justifyContent: 'flex-end',
      height: scale(35),
      alignItems: 'center',
      borderRadius: scale(10)
      // marginRight: scale(-15),
    },
    iosDateFormat: {
      fontSize: 16
    },
    androidDateFormat: {
      marginTop: scale(20),
      marginBottom: scale(30),
      paddingTop: scale(5),
      fontSize: scale(25),
      fontWeight: '500'
    }
  })
}

export default styles
