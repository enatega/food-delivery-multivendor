import { verticalScale, scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { StyleSheet } from 'react-native'

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      alignItems: 'center',
      ...alignment.MBxSmall
    },
    restaurantContainer: {
      backgroundColor: props != null ? props.cartContainer : 'white',
      elevation: 3,
      shadowColor: props != null ? props.shadowColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3),
      height: scale(220),
      width: '99%',
      ...alignment.Psmall,
      ...alignment.MBsmall
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      height: '70%'
    },
    img: {
      width: '100%',
      height: '100%'
    },
    overlayRestaurantContainer: {
      position: 'absolute',
      justifyContent: 'space-between',
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: '100%'
    },
    favOverlay: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: scale(30),
      height: scale(30),
      borderRadius: scale(15),
      backgroundColor: props != null ? props.white : 'white',
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    deliveryRestaurantOverlay: {
      position: 'absolute',
      bottom: 5,
      left: 5,
      width: scale(50),
      height: scale(20),
      borderRadius: scale(10),
      backgroundColor: props != null ? props.menuBar : 'white',
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    aboutRestaurant: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    descriptionContainer: {
      height: '30%',
      width: '100%',
      ...alignment.PTsmall
    },
    offerCategoty: {
      ...alignment.MTxSmall,
      ...alignment.MBxSmall
    },
    priceRestaurant: {
      alignItems: 'center',
      flexDirection: 'row'
    },
    verticalLine: {
      height: '60%',
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: props != null ? props.horizontalLine : 'black',
      opacity: 0.6,
      ...alignment.MLxSmall,
      ...alignment.MRxSmall
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
      backgroundColor: props != null ? props.tagColor : 'black'
    }
  })
export default styles
