import { StyleSheet, Platform } from 'react-native'
import { verticalScale, scale } from '../../../utils/scaling'
import { fontStyles } from '../../../utils/fontStyles'
import { theme } from '../../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props?.headerBackground : 'transparent'
    },
    mainContentContainer: {
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    randomShapeContainer: {
      right: 0,
      position: 'absolute',
      zIndex: -1,
      transform: [{ rotate: '90deg' }]
    },
    statusContainer: {
      overflow: 'hidden',
      width: '95%',
      alignSelf: 'center',
      backgroundColor: theme.Pink.main,
      borderRadius: scale(12),
      marginTop: verticalScale(10),
      elevation: 7,
      shadowColor: props != null ? props?.shadowColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3),
      borderWidth: 1,
      borderColor: theme.Pink.white
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
      color: props !== null ? props?.statusSecondColor : 'grey',
      fontSize: verticalScale(15),
      fontFamily: fontStyles.MuseoSans500
    },
    description: {
      color: props !== null ? props?.fontMainColor : '#000',
      fontSize: verticalScale(15),
      fontFamily: fontStyles.MuseoSans500,
      paddingLeft: scale(5),
      paddingTop: scale(3),
      fontWeight: '700'
    },

    statusText: {
      color: props !== null ? props?.statusSecondColor : 'grey',
      fontSize: verticalScale(13),
      fontFamily: fontStyles.MuseoSans500,
      marginBottom: scale(10),
      // paddingLeft: 40,
      fontWeight: '500'
    },
    timeText: {
      color: props !== null ? props?.iconColorPink : 'red',
      fontSize: verticalScale(24),
      fontFamily: fontStyles.MuseoSans300,
      marginLeft: -10
    },
    statusCircle: {
      marginRight: scale(5),
      marginBottom: scale(5),
      marginTop: scale(5)
    },
    viewAllButton: {
      paddingTop: scale(0),
      paddingBottom: scale(10)
    },
    btncontainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      padding: scale(10),
      borderRadius: scale(5)
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold'
    },
    textInnerContainer: {
      flexDirection: 'row'
    },
    activeOrdersContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: scale(2),
      marginBottom: scale(2),
      paddingLeft: scale(40)
    },
    minimizedTab: {
      backgroundColor: props !== null ? props?.main : '#FF6B6B',
      borderRadius: scale(30),
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      minWidth: scale(120)
    },
    minimizedContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    minimizedBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: scale(12),
      paddingHorizontal: scale(8),
      paddingVertical: scale(4),
      marginLeft: scale(8)
    }
  })

export default styles
