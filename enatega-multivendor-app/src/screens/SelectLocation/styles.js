import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
const { StyleSheet } = require('react-native')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mapView: {
      height: '70%',
      marginBottom: scale(-20)
    },
    container: {
      flex: 1,
      backgroundColor: 'red',
      height: '90%',
      overflow: 'visible',
      justifyContent: 'space-around',
      borderTopLeftRadius: scale(30),
      borderTopRightRadius: scale(30),
      backgroundColor: props !==null ? props.themeBackground : '#f5f5f5',
      borderWidth: scale(1),
      borderColor: '#DAD6D6',
      paddingTop: scale(20),
      paddingBottom: scale(20)
    },
    container2: {
      flex: 1,
  
      height: '90%',
      overflow: 'visible',
      justifyContent: 'space-around',
      borderTopLeftRadius: scale(30),
      borderTopRightRadius: scale(30),
      backgroundColor:props !==null ? props.themeBackground : '#f5f5f5',
      borderWidth: scale(1),
      borderColor: '#DAD6D6',
      padding: scale(25)
    },
    heading: {
      paddingLeft: scale(20),
      ...alignment.MBlarge,
      ...alignment.MRmedium
    },
    addressHeading: {
      marginBottom: scale(30)
    },
    button: {
      width: '100%',
      height: '20%',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingLeft: scale(20),
      marginTop: scale(10),
      marginBottom: scale(10)
    },
    dropdownContainer: {
      borderWidth: 1,
      borderColor: '#DAD6D6',
      borderRadius: 8,
      height: '18%',
      overflow: 'hidden',
      justifyContent: 'center'
    },
    button1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10
    },
    cityField: {
      color:props != null ? props.newFontcolor : '#E5E7EB',
    },
    icon1: {
      marginLeft: 10
    },
    textInput: {
      width: '100%',
      height: '22%',
      justifyContent: 'center',
      paddingHorizontal: scale(10),
      marginTop: scale(15),
      borderWidth: 1,
      borderColor: props != null ? props.borderBottomColor : '#E5E7EB',
      borderRadius: scale(8)
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)'
    },
    icon: {
      backgroundColor: props != null ? props.iconBackground : '#E5E7EB',
      height: scale(36),
      width: scale(36),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(18),
      marginRight: scale(16)
    },
    line: {
      borderBottomWidth: scale(1),
      borderBottomColor: props != null ? props.borderBottomColor : '#DAD6D6',
      width: '100%'
    },
    emptyButton: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '20%',
      backgroundColor: props !== null ? props.main : 'transparent',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(28),
      marginTop: scale(50)
    },
    mainContainer: {
      width: scale(50),
      height: scale(50),
      position: 'absolute',
      top: '46%',
      left: '50%',
      zIndex: 1,
      translateX: scale(-25),
      translateY: scale(-25),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: scale(-25) }, { translateY: scale(-25) }]
    }
  })
export default styles
