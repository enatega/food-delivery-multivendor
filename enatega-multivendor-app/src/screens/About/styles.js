import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    MB15: {
      padding: 10,
      ...alignment.MBmedium,
      backgroundColor: props != null ? props.radioOuterColor : 'white',
      borderRadius: 10,
      shadowOffset: { width: 2, height: 4 },
      shadowColor: props != null ? props.black : 'black',
      shadowOpacity: 0.1,
      shadowRadius: 10
    },
    width10: {
      width: '10%'
    },
    width90: {
      width: '90%',
      paddingLeft: 10
    },
    mapMainContainer: {
      backgroundColor: props != null ? props.themeBackground : 'white',
      flexGrow: 1,
      ...alignment.PTlarge,
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    inlineFloat: {
      width: '100%',
      backgroundColor: props != null ? props.radioOuterColor : 'white',
      flexDirection: 'row',
      alignItems: 'center'
    },
    mapContainer: {
      marginTop: 10,
      marginBottom: 20,
      borderRadius: scale(10),
      borderColor: props != null ? props.white : 'white',
      borderWidth: 2,
      height: 200,
      backgroundColor: props != null ? props.white : 'white'
    },
    marker: {
      width: 50,
      height: 50,
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 1,
      translateX: -25,
      translateY: -25,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: -25 }, { translateY: -25 }]
    },
    mainContainer: {
      backgroundColor: props != null ? props.themeBackground : 'white'
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
    review: {
      marginHorizontal: 5,
      zIndex: 1,
      elevation: 1,
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 10
    },
    ratingContainer: {
      flexDirection: 'row',
      width: '25%',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    timingContainer: {
      alignSelf: 'center',
      width: '90%',
      marginBottom: scale(20)
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
      zIndex: 999
    },
    tab: {
      backgroundColor: props != null ? props.radioOuterColor : 'white',
      marginTop: scale(-15),
      width: '48%',
      height: verticalScale(35),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(10),
      margin: scale(-10)
    },
    selectedTab: {
      backgroundColor: props != null ? props.main : '#90EA93',
      borderRadius: scale(10),
      margin: scale(-10)
    },
    timingRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      alignSelf: 'center',
      backgroundColor: props != null ? props.main : '#90EA93',
      borderRadius: 30,
      padding: 10,
      marginBottom: 10,
      width: '90%'
    },
    marker: {
      width: 50,
      height: 50,
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 1,
      translateX: -25,
      translateY: -25,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: -25 }, { translateY: -25 }]
    },
    review: {
      marginHorizontal: 5,
      zIndex: 1,
      elevation: 1,
      backgroundColor: props != null ? props.black : 'black',
      padding: 10,
      borderRadius: 10
    },
    timingText: {
      width: scale(140),
      textAlign: 'left'
    }
  })
export default styles
