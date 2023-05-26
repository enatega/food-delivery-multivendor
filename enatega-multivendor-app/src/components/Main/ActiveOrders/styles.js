import { StyleSheet } from 'react-native'
import { verticalScale, scale } from '../../../utils/scaling'
import { fontStyles } from '../../../utils/fontStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props.headerBackground : 'transparent'
    },
    mainContentContainer: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    randomShapeContainer: {
      right: 0,
      position: 'absolute',
      zIndex: -1,
      transform: [{ rotate: '90deg' }]
    },
    statusContainer: {
      overflow: 'hidden',
      width: scale(270),
      alignSelf: 'center',
      backgroundColor: props !== null ? props.cartContainer : 'white',
      marginTop: verticalScale(5),
      marginBottom: verticalScale(10),
      marginLeft: scale(15),
      elevation: 7,
      shadowColor: props != null ? props.shadowColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3),
      borderWidth: 1,
      borderColor: '#FFF',
      paddingBottom: scale(15)
    },
    cardViewContainer: {
      width: '98%',
      alignSelf: 'center',
      height: verticalScale(180),
      marginTop: verticalScale(2),
      marginBottom: verticalScale(10),
      elevation: 7,
      shadowColor: props !== null ? props.shadowColor : 'transparent',
      shadowOffset: {
        width: 0,
        height: verticalScale(3)
      },
      shadowOpacity: 1,
      shadowRadius: verticalScale(4),
      borderWidth: 1,
      borderColor: props !== null ? props.white : '#FFF'
    },
    imgCard: {
      position: 'relative',
      flex: 1,
      width: undefined,
      height: undefined
    },
    textContainer: {
      width: scale(300),
      paddingTop: scale(15),
      paddingLeft: scale(15),
      paddingRight: scale(15)
    },
    title: {
      color: props !== null ? props.statusSecondColor : 'grey',
      fontSize: verticalScale(16),
      fontFamily: fontStyles.MuseoSans500
    },
    description: {
      color: props !== null ? props.fontMainColor : '#000',
      fontSize: verticalScale(18),
      fontFamily: fontStyles.MuseoSans500,
      marginTop: scale(2)
    },
    statusText: {
      color: props !== null ? props.statusSecondColor : 'grey',
      fontSize: verticalScale(13),
      fontFamily: fontStyles.MuseoSans500,
      marginBottom: scale(10)
    },
    timeText: {
      color: props !== null ? props.iconColorPink : 'red',
      fontSize: verticalScale(24),
      fontFamily: fontStyles.MuseoSans300,
      marginLeft: -10
    },
    statusCircle: {
      marginRight: scale(5),
      marginBottom: scale(5),
      marginTop: scale(5)
    }
  })

export default styles
