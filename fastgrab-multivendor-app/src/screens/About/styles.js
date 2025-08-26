import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    topMarginSmall: {
      ...alignment.MTxSmall
    },
    topMarginLarge: {
      ...alignment.MTsmall
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
    // mapMainContainer: {
    //   backgroundColor: props != null ? props.themeBackground : 'white',
    //   flexGrow: 1,
    //   ...alignment.PTlarge,
    //   ...alignment.PLmedium,
    //   ...alignment.PRmedium
    // },

    location: {
      marginLeft: scale(3)
    },
    inlineFloat: {
      width: '100%',
      backgroundColor: props != null ? props.radioOuterColor : 'white',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    mapContainer: {
      borderRadius: scale(10),
      height: scale(210),
      backgroundColor: props != null ? props.themeBackground : 'white'
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
      backgroundColor: props != null ? props.themeBackground : 'white',

      ...alignment.Pmedium
    },
    restaurantContainer: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
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
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
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
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginVertical: scale(8)
    },
    timingContainer: {
      // alignSelf: 'center',
      width: '100%',
      ...alignment.PTmedium
    },
    dateReview: {
      marginTop: -8,
      width: '100%',
      textAlign: 'left',
      fontSize: 10,
      ...alignment.PTsmall,
      ...alignment.PBxSmall
    },
    // navigationContainer: {
    //   flexDirection: props?.isRTL ? 'row-reverse' : 'row',
    //   alignItems: 'flex-start',
    //   justifyContent: 'center',
    //   width: '100%',
    //   zIndex: 999
    // },
    // tab: {
    //   backgroundColor: '#E4FFD9',
    //   width: '48%',
    //   height: verticalScale(35),
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   borderRadius: scale(10),
    //   margin: scale(-10)
    // },
    // selectedTab: {
    //   backgroundColor: props != null ? props.main : '#90EA93',
    //   borderRadius: scale(10)
    // },
    timingRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5),
    },
    timingRowMain: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-evenly',
      alignSelf: 'center',
      backgroundColor: props != null ? props.cardBackground : '#181818',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      width: '100%'
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
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    subContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props.color6 : '#9B9A9A',
      marginTop: scale(10)
    }
  })
export default styles