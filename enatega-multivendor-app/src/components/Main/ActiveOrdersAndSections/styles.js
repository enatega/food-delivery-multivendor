import { verticalScale, scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = (currentTheme, index) =>
  StyleSheet.create({
    ML20: {
      ...alignment.MLlarge
    },
    MT5: {
      ...alignment.MTxSmall
    },
    offerScroll: {
      height: scale(230),
      width: '100%'
    },
    offerContainer: {
      backgroundColor:
        currentTheme != null
          ? index % 2 === 0
            ? currentTheme.main
            : currentTheme.black
          : 'white',
      elevation: 3,
      shadowColor: currentTheme != null ? currentTheme.iconColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3),
      height: scale(210),
      width: scale(130),
      borderRadius: 20,
      ...alignment.MBmedium,
      ...alignment.MTxSmall
    },
    imageContainer: {
      position: 'relative',
      height: '60%',
      width: scale(130),
      marginTop: 2.5
    },
    overlayContainer: {
      position: 'absolute',
      justifyContent: 'space-between',
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: scale(130)
    },
    deliveryOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: scale(55),
      height: scale(20),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      backgroundColor: currentTheme != null ? currentTheme.menuBar : 'white',
      borderRadius: 20,
      ...alignment.MxSmall,
      elevation: 3
    },
    labelOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: scale(55),
      height: scale(20),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      backgroundColor: currentTheme != null ? currentTheme.menuBar : 'white',
      borderRadius: 20,
      ...alignment.MxSmall,
      elevation: 3
    },
    favouriteOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: scale(20),
      height: scale(20),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      backgroundColor: currentTheme != null ? currentTheme.menuBar : 'white',
      borderRadius: 20,
      ...alignment.MxSmall,
      elevation: 3
    },
    featureOverlay: {
      height: '90%',
      position: 'absolute',
      left: 0,
      top: 10,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    featureText: {
      alignSelf: 'flex-start',
      maxWidth: '100%',
      fontSize: scale(9),
      ...alignment.MTxSmall,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall,
      backgroundColor: currentTheme != null ? currentTheme.iconColorPink : 'red'
    },
    descriptionContainer: {
      paddingTop: verticalScale(10),
      paddingBottom: verticalScale(10),
      paddingLeft: scale(10),
      paddingRight: scale(10),
      height: '40%',
      width: '100%',
      alignItems: 'center'
    },
    aboutRestaurant: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    offerCategoty: {
      ...alignment.MTxSmall,
      ...alignment.MBxSmall
    },
    statusCircle: {
      marginRight: scale(5),
      marginBottom: scale(5),
      marginTop: scale(5)
    }
  })

export default styles
