import { StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    map: {
      width: width,
      height: height
    },
    markerContainer: {
      flex: 1,
      flexDirection: 'row',
      gap: 4,
      alignItems: 'flex-end'
    },
    greenDot: {
      height: 18,
      width: 18,
      backgroundColor: props !== null ? props?.main : '#90E36D',
      borderRadius: scale(9),
      borderWidth: 1
    },
    markerImage: {
      height: 30,        // Reduced to 30
      width: 30,         // Reduced to 30
      borderRadius: 15,  // Half of width/height
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: '#fff'
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
      width: 310,
      backgroundColor: props !== null ? props?.white : 'white',
      padding: 16,
      borderRadius: scale(8),
      gap: 16
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
