import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    MB15: {
      ...alignment.MBmedium
    },
    width10: {
      width: '10%'
    },
    width90: {
      width: '90%'
    },
    mapMainContainer: {
      flexGrow: 1,
      ...alignment.PTlarge,
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    inlineFloat: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%'
    },
    mapContainer: {
      height: '40%',
      backgroundColor: 'transparent'
    },
    mainContainer: {
      backgroundColor: props != null ? props.cartContainer : 'white'
    },
    restaurantContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: props != null ? props.themeBackground : 'white',
      ...alignment.Psmall
    },
    restaurantTitle: {
      width: '75%',
      ...alignment.PLxSmall
    },
    line: {
      width: '100%',
      borderBottomColor: props != null ? props.horizontalLine : 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    reviewerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    },
    ratingContainer: {
      flexDirection: 'row',
      width: '25%',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    timingContainer: {
      marginLeft: scale(30),
      marginBottom: scale(20)
    },
    dateReview: {
      width: '100%',
      textAlign: 'left',
      ...alignment.PTsmall,
      ...alignment.PBxSmall
    },
    navigationContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      ...alignment.MTlarge
    },
    tab: {
      width: scale(60),
      height: verticalScale(35),
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MRsmall
    },
    selectedTab: {
      borderBottomColor: props != null ? props.tagColor : 'red',
      borderBottomWidth: StyleSheet.hairlineWidth * 4
    },
    timingRow: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  })
export default styles
