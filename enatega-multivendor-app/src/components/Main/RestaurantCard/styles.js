import { scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    offerContainer: {
      borderRadius: 15,
      width: scale(270),
      height: height * 0.376,
      ...alignment.MRsmall,
      backgroundColor: props != null ? props?.cardBackground : '#181818'
    },
    overlayContainer: {
      position: 'absolute',
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: scale(270),
      pointerEvents: 'box-none'
    },
    favouriteOverlay: {
      position: 'absolute',
      top: 10,
      ...props?.isRTL ? { left: 10 } : { right: 10 },
      width: scale(38),
      height: scale(28),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderRadius: scale(16),
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      borderWidth: 1,
      borderColor: props != null ? props?.customBorder : '#F3F4F6'
    },
    descriptionContainer: {
      paddingLeft: scale(10),
      paddingRight: scale(10),
      width: '100%',
      // borderColor: props != null ? props?.iconBackground : '#E5E7EB',
      // borderWidth: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      height: '35%',
      justifyContent: 'center',
      gap: 10
    },
    aboutRestaurant: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(2)
    },
    offerCategoty: {
      width: '100%',
      textAlign: props?.isRTL ? 'right' : 'left'
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
      width: scale(270),
      height: '100%',
      borderTopLeftRadius: scale(8),
      borderTopRightRadius: scale(8)
    },
    imageContainer: {
      position: 'relative',
      alignItems: 'center',
      height: '65%'
    },
    restaurantTotalRating: {
      paddingLeft: scale(5)
    },
    restaurantPriceContainer: {
      marginTop: scale(3),
      fontSize: 15
    },
    deliveryInfo: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(18)
    },
    deliveryTime: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(4)
    }, 
    border: {
      width: '100%',
      height: 1,
      borderWidth: 1,
      borderColor: props != null ? props?.iconBackground : '#E5E7EB',
      borderStyle: 'dashed'
    },
    closedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(150, 150, 150, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default styles
