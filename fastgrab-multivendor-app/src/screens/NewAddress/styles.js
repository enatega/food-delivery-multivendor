import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex:1,
      backgroundColor: props !== null ? props?.radioOuterColor : '#FFF'
    },
    subContainer: {
      flex: 1,
      flexGrow: 1,
      alignItems: 'center',
      borderTopLeftRadius: scale(30),
      borderTopRightRadius: scale(30),
      borderColor: props !== null ? props?.gray : 'grey',
      justifyContent: 'space-between',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      shadowColor: '#00000026',
      shadowRadius: scale(11),

      ...alignment.PTlarge
    },
    upperContainer: {
      width: '90%',
      alignItems: 'center'
    },
    horizontalLine: {
      borderBottomColor: theme.Pink.tagColor,
      borderBottomWidth: scale(1),
      marginVertical: scale(10), // Adjust this value to control the spacing above and below the line
      width: '90%',
      alignSelf: 'center',
      marginBottom: scale(30)
    },
    addressContainer: {
      paddingTop: scale(0),
      width: '100%',
      ...alignment.Psmall
    },
    labelButtonContainer: {
      ...alignment.PxSmall,
      width: '80%'
    },
    labelTitleContainer: {
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    buttonInline: {
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: 'black'
    },
    textbuttonInline: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: 'black'
    },
    titlebuttonInline: {
      paddingLeft: scale(10),
      paddingRight: scale(12),
      justifyContent: 'space-between',
      ...alignment.PxSmall
    },
    labelButton: {
      width: scale(60),
      height: scale(60),
      borderWidth: scale(1),
      borderColor: props !== null ? props?.tagColor : 'transparent',
      borderRadius: scale(8),
      justifyContent: 'center',
      ...alignment.PxSmall,
      backgroundColor: props !== null ? props?.tagColor : 'transparent',
    },
    textlabelButton: {
      justifyContent: 'center',
      ...alignment.PxSmall,
      backgroundColor: theme.Pink.tagColor
    },
    activeLabel: {
      width: scale(60),
      height: scale(60),
      borderWidth: scale(1),
      borderRadius: scale(8),
      justifyContent: 'center',
      color: props !== null ? props?.tagColor : 'transparent',
      borderColor: props !== null ? props?.black : 'transparent',
      backgroundColor: props !== null ? props?.darkBgFont : 'transparent',
      ...alignment.PxSmall
    },
    saveBtnContainer: {
      width: '80%',
      height: verticalScale(40),
      borderRadius: scale(20),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.buttonBackground : 'transparent',
      alignSelf: 'center',
      marginTop: scale(20),
      marginBottom: scale(20)
    },
    fakeMarkerContainer: {
      position: 'absolute',
      top: scale(0),
      bottom: scale(0),
      left: scale(0),
      right: scale(0),
      marginLeft: scale(-24),
      marginTop: scale(-58),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props !== null ? props?.backgroundColor : 'transparent'
    },
    marker: {
      height: scale(48),
      width: scale(48)
    },
    mapContainer: {
      height: '40%',
      backgroundColor: props !== null ? props?.backgroundColor : 'transparent'
    },
    geoLocation: {
      flexDirection: 'row'
    },
    headerBackBtnContainer: {
      backgroundColor: props !== null ? props?.white : 'white',
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    imageContainer: {
      width: scale(50),
      height: scale(50),
      position: 'absolute',
      top: '50%',
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
