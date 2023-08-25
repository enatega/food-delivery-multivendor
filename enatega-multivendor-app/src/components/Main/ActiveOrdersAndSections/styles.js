import { verticalScale, scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    ML20: {
      ...alignment.MLlarge
    },
    offerScroll: {
      height: scale(230),
      width: '100%'
    },
    offerContainer: {
      backgroundColor: props != null ? props.cartContainer : 'white',
      elevation: 3,
      shadowColor: theme.Pink.white,

      height: scale(200),
      borderRadius: 25,
      width: scale(228),
      ...alignment.MBmedium,
      ...alignment.MTxSmall
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      height: '60%'
    },
    overlayContainer: {
      position: 'absolute',
      justifyContent: 'space-between',
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: scale(230)
    },
    deliveryOverlay: {
      position: 'absolute',
      top: 12,
      right: 18,
      width: scale(44),
      height: scale(19),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderRadius: scale(10),
      backgroundColor: props != null ? props.menuBar : 'white'
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
      backgroundColor: props != null ? props.iconColorPink : 'red'
    },
    descriptionContainer: {
      paddingTop: verticalScale(10),
      paddingBottom: verticalScale(5),
      paddingLeft: scale(10),
      paddingRight: scale(10),
      height: '40%',
      width: '100%'
    },
    aboutRestaurant: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    offerCategoty: {
      width: '100%',
      ...alignment.MTxSmall,
      ...alignment.MBxSmall
    },
    mainContainer: {
      paddingTop: scale(15),
      marginBottom: scale(15),
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      borderTopColor: '#ebebeb',
      borderTopWidth: scale(3)
    },
    restaurantImage: {
      width: scale(220),
      height: '100%',
      borderRadius: scale(25),
      marginTop: scale(5)
    },
    restaurantRatingContainer: {
      marginLeft: scale(2)
    },
    restaurantPriceContainer: {
      marginTop: scale(3),
      fontSize: 15
    }
  })

export default styles
