import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'


const styles = (props = null) => {
  return StyleSheet.create({
    backdrop: {
      height: '90%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    layout: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: props !== null ? props.cardBackground : '#FFF',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingHorizontal: scale(20),
      paddingTop: scale(20),
      paddingBottom: scale(20),
      borderWidth: 1,
      borderColor: props !== null ? props.customBorder : '#E5E7EB',
      justifyContent: 'center'
    },
    flexRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      padding: scale(20),
      borderRadius: scale(10),
      justifyContent: 'center',
      backgroundColor: 'red'
    },
    modalText: {
      fontSize: scale(15),
      marginBottom: scale(10),
    },
    modalButtonsContainer: {
      justifyContent: 'space-around',
    },
    modalHeader: {
      fontSize: scale(20),
      marginBottom: scale(10),
      fontWeight: 'bold',
    },
    btn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      height: scale(40),
      borderRadius: 40,
      marginVertical: scale(5),
      backgroundColor: props !== null ? props.color3 : 'transparent',
      borderWidth: 1,
    },
    btnCancel: {
      borderColor: props !== null ? props.linkColor : '#0EA5E9'
    },
    btnLogout: {
      borderColor: props !== null ? props.red600 : '#DC2626'
    },
  })
}
export default styles
