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
      margin: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%'
    },
    tabHeading: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '700',
    
    },
    tabSubHeading: {
      fontSize: 20,
      fontWeight: '500'
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
      borderRadius: scale(10),
      marginRight: scale(-15),
      zIndex: 999
    },
    labelButton: {
      flex: 1,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'transparent',
      justifyContent: 'center',
      height: scale(35),
      alignItems: 'center',
      borderRadius: scale(10),
      marginRight: scale(-15)
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
