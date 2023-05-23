import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    tabStyles: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      height: 40
    },
    tabContainer: {
      flexDirection: 'row',
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: props !== null ? props.tagColor : '#90EA93',
      borderRadius: 20
    },
    activeLabel: {
      flex: 1,
      justifyContent: 'center',
      color: props !== null ? props.tagColor : 'transparent',
      height: scale(35),
      backgroundColor: '#000',
      borderRadius: 20,
      alignItems: 'center'
    },
    labelButton: {
      flex: 1,
      justifyContent: 'center',
      height: scale(35),
      alignItems: 'center'
    },
    iosDateFormat: {
      fontSize: 16
    },
    androidDateFormat: {
      paddingTop: 5,
      fontSize: 18
    }
  })
}

export default styles
