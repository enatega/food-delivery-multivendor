import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')

const CONTAINER_HEIGHT = Math.floor(scale(height / 5) * 1.4)
const BACKDROP_HEIGHT = Math.floor(scale(height - CONTAINER_HEIGHT))

const styles = (props = null) => {
  return StyleSheet.create({
    backdrop: {
      height: BACKDROP_HEIGHT,
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
      height: CONTAINER_HEIGHT,
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingHorizontal: scale(20),
      paddingBottom: scale(20),
      borderWidth: scale(1),
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      justifyContent: 'center',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: props !== null ? props.themeBackground : '#fff',
      padding: scale(20),
      borderRadius: scale(10),
      justifyContent: 'center',
    },
    modalText: {
      fontSize: scale(15),
      marginBottom: scale(10),
      color: props !== null ? props.secondaryText : '#4B5563'
    },
    modalButtonsContainer: {
      // flexDirection: 'row',
      justifyContent: 'space-around',
      // marginTop: scale(10)
    },
    modalHeader: {
      fontSize: scale(20),
      marginBottom: scale(10),
      fontWeight: 'bold',
      color: props !== null ? props.secondaryText : '#4B5563'
    },
    btn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      height: scale(40),
      borderRadius: 40,
      marginVertical: scale(5),
      backgroundColor: props !== null ? props.transparent : '#00000000',
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
