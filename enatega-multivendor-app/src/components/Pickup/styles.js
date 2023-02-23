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
      justifyContent: 'center'
    },
    activeLabel: {
      flex: 1,
      borderWidth: 2,
      justifyContent: 'center',
      color: props !== null ? props.tagColor : 'transparent',
      borderColor: props !== null ? props.tagColor : 'transparent',
      height: scale(35),
      alignItems: 'center'
    },
    labelButton: {
      flex: 1,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'transparent',
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
