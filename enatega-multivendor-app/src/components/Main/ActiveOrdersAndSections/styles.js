import { verticalScale, scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

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
      shadowColor: props != null ? props.shadowColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3),
      height: scale(200),
      width: scale(230),
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
      top: 0,
      right: 0,
      width: scale(25),
      height: scale(25),
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
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
      paddingBottom: verticalScale(10),
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
    }
  })

export default styles
