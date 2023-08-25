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
      borderRadius: scale(25),
      height: scale(220),
      width: '99%',
      padding: scale(15),

      ...alignment.MBsmall
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      height: '70%'
    },
    img: {
      width: '100%',
      height: '100%',
      borderRadius: scale(18)
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
      top: 10,
      right: 12,
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
      bottom: 15,
      left: 10,
      width: scale(45),
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
      padding: scale(10)
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
