import { scale } from '../../utils/scaling'
import { StyleSheet, Dimensions, Platform } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props.headerBackground : 'transparent'
    },
    container: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      marginBottom: 90
    },
    contentContainer: {
      ...alignment.PBsmall,
      backgroundColor: props !== null ? props.menuBar : 'white',
      marginBottom: 60
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      ...alignment.PBlarge
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBxSmall
    },
    image: {
      width: scale(130),
      height: scale(130)
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    emptyButton: {
      padding: scale(10),
      backgroundColor: props !== null ? props.buttonBackground : 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },

    topContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      height: height * 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTmedium
    },
    lowerContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      shadowColor: props !== null ? props.fontSecondColor : 'grey',
      shadowOffset: {
        width: 0,
        height: 12
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      flex: 1
    },
    scrollView: {
      backgroundColor: 'transparent',
      marginBottom: Platform === 'ios' ? height * 0.1 : height * 0.1
    },
    barContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '75%',
      alignSelf: 'center',
      justifyContent: 'space-around',
      padding: 10,
      backgroundColor: props !== null ? props.tagColor : 'grey',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 5,
      marginTop: -30
    },
    barContent: {
      padding: 15,
      borderRadius: 10
    },
    badge: {
      position: 'absolute',
      backgroundColor: props !== null ? props.fontMainColor : 'white',
      width: 25,
      height: 25,
      borderRadius: 25,
      top: -8,
      right: -8,
      justifyContent: 'center',
      alignItems: 'center'
    }
  })

export default styles
