import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF'
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      borderColor: props != null ? props?.borderBottomColor : '#DAD6D6',
      paddingTop: scale(25),
      paddingBottom: scale(25)
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBlarge
    },
    mapView: {
      height: '75%',
      marginBottom: scale(-20)
    },
    line: {
      borderBottomWidth: scale(1),
      borderBottomColor: props != null ? props?.borderBottomColor : '#DAD6D6',
      width: '100%',
      marginTop: scale(26),
      marginBottom: scale(26)
    },
    image: {
      width: scale(100),
      height: scale(100)
    },
    welcomeHeading: {
      fontSize: scale(30),
      ...alignment.MTlarge
    },
    descriptionEmpty: {
      color: props != null ? props?.secondaryText : '#4B5563',
      lineHeight: scale(18),
      marginLeft: scale(50),
      marginRight: scale(50),
      ...alignment.PTsmall
    },
    emptyButton: {
      display: 'flex',
      flexDirection: 'row',
      width: '82%',
      height: '20%',
      backgroundColor: props !== null ? props?.main : 'transparent',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(28)
    },
    linkButton: {
      display: 'flex',
      flexDirection: 'row',
      width: '82%',
      height: '25%',
      backgroundColor: 'transparent',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(28),
      borderWidth: scale(1),
      borderColor: props !== null ? props?.newIconColor : 'transparent',
      ...alignment.Mmedium
    }
  })

export default styles
