import { Dimensions, StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')
const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      backgroundColor: props != null ? props.themeBackground : 'transparent',
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PTsmall
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.PBsmall
    },
    restImageContainer: {
      ...alignment.MTxLarge,
      ...alignment.MBlarge,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    headerImage: {
      width: scale(66),
      height: scale(66),
      objectFit: 'cover',
      borderRadius: 8
    },
    headingTitle: {
      bottom: scale(10),
      left: scale(30)
    },
    overlayContainer: {},
    // touchArea: {
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: scale(20)
    // },
    deliveryBoxContainer: {
      ...alignment.PTsmall,
      ...alignment.PLxSmall
    },

    animatedIconStyle: {
      fontSize: scale(20)
    },

    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: scale(3),
      gap: scale(3)
    },
    backArrow: {
      color: props != null ? props.black : '#FFF',
      fontSize: scale(20),
      backgroundColor: 'white',
      paddingLeft: scale(15),
      paddingRight: scale(15),
      paddingBottom: scale(5),
      paddingTop: scale(5),
      borderRadius: scale(22)
    }
  })
export default styles
