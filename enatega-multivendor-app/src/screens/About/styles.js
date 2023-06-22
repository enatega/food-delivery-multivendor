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
      width: '100%',
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center'
    },
    mapContainer: {
      marginTop: 10,
      borderRadius: scale(10),
      borderColor: 'white',
      borderWidth: 2,
      height: '30%',
      backgroundColor: 'white'
    },
    mainContainer: {
      backgroundColor: props != null ? '#F5F5F5' : 'white'
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
      alignItems: 'center'

      // marginLeft: scale(30),
      // marginBottom: scale(20)
    },
    dateReview: {
      marginTop: -8,
      width: '100%',
      textAlign: 'left',
      fontSize: 10,
      ...alignment.PTsmall,
      ...alignment.PBxSmall
    },
    navigationContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      marginTop: scale(-15)
    },
    tab: {
      backgroundColor: 'white',
      width: scale(170),
      borderRadius: 10,
      height: verticalScale(35),
      justifyContent: 'center',
      alignItems: 'center'
    },
    selectedTab: {
      backgroundColor: props != null ? props.main : 'lightgrey',
      borderBottomColor: props != null ? props.tagColor : 'red'
      //marginLeft: scale(-5)
      //borderBottomWidth: StyleSheet.hairlineWidth * 4
    },
    timingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props != null ? props.main : '#90EA93',
      marginBottom: 5,
      width: '60%',
      padding: 8,
      borderRadius: 20
    }
  })
export default styles
