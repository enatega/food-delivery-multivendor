import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    tabStyles: {
      flex: 1,
      //borderWidth: 1,
      //s borderColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      height: 40
    },
    tabContainer: {
      margin: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%'
    },
    tabHeading: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '700'
    },
    activeLabel: {
      flex: 1,
      borderWidth: 2,
      justifyContent: 'center',
      backgroundColor: props !== null ? props.tagColor : 'transparent',
      color: props !== null ? props.tagColor : 'transparent',
      borderColor: props !== null ? props.tagColor : 'transparent',
      height: scale(35),
      alignItems: 'center',
      borderRadius: 10,
      marginRight: -15,
      zIndex: 999
    },
    labelButton: {
      flex: 1,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'transparent',
      justifyContent: 'center',
      height: scale(35),
      alignItems: 'center',
      borderRadius: 10,
      marginRight: -15
    },
    iosDateFormat: {
      fontSize: 16
    },
    androidDateFormat: {
      marginTop: 20,
      marginBottom: 30,
      paddingTop: 5,
      fontSize: 25,
      fontWeight: '500'
    }
  })
}

export default styles
