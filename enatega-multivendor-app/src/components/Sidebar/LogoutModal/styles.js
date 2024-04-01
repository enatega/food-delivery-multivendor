import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) => {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        props !== null ? props.customizeOpacityBtn : 'rgba(0, 0, 0, 0.74)'
    },
    modalContent: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      padding: scale(20),
      borderRadius: scale(10)
    },
    modalText: {
      fontSize: scale(15),
      marginBottom: scale(10),
      color: props !== null ? props.secondaryText : '#4B5563'
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: scale(10)
    },
    modalHeader: {
      fontSize: scale(20),
      marginBottom: scale(10),
      fontWeight: 'bold',
      color: props !== null ? props.secondaryText : '#4B5563'
    }
  })
}
export default styles
