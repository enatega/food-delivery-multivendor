import { verticalScale, scale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    // ML20: {
    //   ...alignment.MLlarge
    // },
    // offerScroll: {
    //   height: scale(270),
    //   width: '100%',
    //   ...alignment.MLlarge,
    // },
    offerContainer: {
      borderRadius: 25,
      width: scale(270),
      ...alignment.MRsmall
    },

    overlayContainer: {
      position: 'absolute',
      top: 0,
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      width: scale(270)
    },
    favouriteOverlay: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: scale(38),
      height: scale(28),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderRadius: scale(16),
      backgroundColor: props != null ? props.menuBar : 'white',
      borderWidth: 1,
      borderColor: props != null ? props.newBorderColor : '#F3F4F6'
    },
    // featureOverlay: {
    //   height: '90%',
    //   position: 'absolute',
    //   left: 0,
    //   top: 10,
    //   backgroundColor: 'rgba(0, 0, 0, 0)'
    // },
    // featureText: {
    //   alignSelf: 'flex-start',
    //   maxWidth: '100%',
    //   fontSize: scale(9),
    //   ...alignment.MTxSmall,
    //   ...alignment.PLsmall,
    //   ...alignment.PRsmall,
    //   ...alignment.PTxSmall,
    //   ...alignment.PBxSmall,
    //   backgroundColor: props != null ? props.iconColorPink : 'red'
    // },
    descriptionContainer: {
      // paddingTop: verticalScale(12),
      // paddingBottom: verticalScale(12),
      paddingLeft: scale(10),
      paddingRight: scale(10),
      width: '100%',
      borderColor: props != null ? props.iconBackground : '#E5E7EB',
      borderWidth: 1,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      height: '35%',
      justifyContent: 'center'
    },
    aboutRestaurant: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(2)
    },
    offerCategoty: {
      width: '100%',
      paddingBottom: scale(7),
      paddingTop: scale(7)
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(18)
    },
    deliveryTime: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4)
    }
  })

export default styles
