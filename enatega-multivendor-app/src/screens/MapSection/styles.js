import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject
    },
    // Single circular pin: green ring acts as border + fallback when the image is missing.
    markerPin: {
      height: 40,
      width: 40,
      borderRadius: 20,
      backgroundColor: props !== null ? props?.main : '#90E36D',
      alignItems: 'center',
      justifyContent: 'center'
    },
    markerImage: {
      height: 36,
      width: 36,
      borderRadius: 18,
      overflow: 'hidden'
    },
    userMarkerImage: {
      height: 25,
      width: 25,
      borderRadius: 12.5,
      overflow: 'hidden'
    },
    restContainer: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 9999
    },
    restCard: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 310,
      backgroundColor: props !== null ? props?.white : 'white',
      padding: 16,
      borderRadius: scale(8),
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4
    },
    restImg: {
      height: 60,
      width: 60,
      borderRadius: scale(10),
      overflow: 'hidden'
    },
    restInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12)
    },
    deliveryTime: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4)
    }
  })
export default styles
