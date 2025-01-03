import { Platform, StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    mainContainer: {
      backgroundColor: props != null ? props?.cardBackground : '#181818',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      overflow: 'auto'
    },

    touchArea: {
      backgroundColor: props != null ? props?.themeBackground : 'white',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 38,
      maxHeight: 30,
      padding: 4,
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
      backgroundColor: props != null ? props?.menuBar : 'white',
      borderWidth: 1,
      borderColor: props != null ? props?.newBorderColor : '#F3F4F6'
    },
    fixedViewNavigation: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999,
      ...alignment.PLmedium,
      ...alignment.PRmedium,
    },
    fixedIcons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 12,
      marginTop: 12
    },
    restaurantDetails: {
      top: -scale(85),
    },
    mainRestaurantImg: {
      height: scale(250),
      width: '100%',
      position: 'relative',
      ...alignment.MBlarge,
    },
    mainDetailsContainer: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      paddingBottom: scale(22),
      alignItems: props?.isRTL ? 'flex-end' : 'flex-start'
    },
    subDetailsContainer: {
      backgroundColor: props != null ? props?.themeBackground : 'white',
      width: '45%',
      alignItems: 'center',
      borderRadius: scale(50),
      padding: scale(5),
      marginVertical: scale(3),
    },
    subContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(10),
      width: '70%',
    },
    timingRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5),
    },
    timingRowMain: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignSelf: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      width: '100%'
    },
    navbarTextContainer: {
      zIndex: 3,
      width: 'auto',
      marginTop: -1
    },
    navbarTextContainerSubCtg: {
      zIndex: 3,
      width: 'auto',
      marginTop: -1,
    },
    flatListStyle: {
      height: 20,
      width: '100%',
      color: props != null ? props?.themeText : 'white',
      backgroundColor: props != null ? props?.themeBackground : 'white',
      zIndex: 999,
      borderBottomColor: 'lightgray',
      borderBottomWidth: 0.2,
    },
    SubCategoryflatListStyle: {
      height: 20,
      width: '100%',
      backgroundColor: props != null ? props?.themeBackground : 'white',
      color: props != null ? props?.themeText : 'white',
      zIndex: 999,
      marginTop: 0,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
    },
    restaurantImg: {
      width: scale(60),
      height: scale(50),
      borderRadius: 12
    },
    restaurantAbout: {
      fontSize: scale(14),
      fontWeight: '500'
    },
    fixedText: {
      padding: 10,
      borderRadius: 10,
      borderColor: 'white',
      borderWidth: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.74)',
      width: '50%',
      alignItems: 'center',
      alignSelf: 'center'
    },
    deliveryBox: {
      color: props != null ? props?.fontWhite : 'white',
      borderRadius: scale(5),
      ...alignment.PxSmall
    },
    ratingBox: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      gap: scale(10),
      alignItems: 'center',
      ...alignment.PLmedium,
      ...alignment.PRmedium,
    },
    seeReviewsBtn: {
      backgroundColor: props != null ? props?.newButtonBackground : '#F3FFEE',
      borderRadius: 4,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      marginHorizontal: 15
    },

    headerContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PLlarge,
      ...alignment.PRlarge
    },
    activeHeader: {
      backgroundColor: props != null ? '#cdf7cd' : '#cdf7cd',
      borderRadius: scale(50),
      height: 30,
      marginLeft: 10,
      marginTop: 10,
    },
    nonActiveHeader: {
      borderWidth: 1,
      marginTop: 10,
      marginLeft: 10,
      height: 30,
      borderColor: 'gray',
      borderRadius: scale(50),
    },
    activeHeaderCtg: {
      // backgroundColor: props != null ? props?.newButtonBackground : '#F3FFEE',
      marginLeft: 10,
      borderColor: 'green',
      borderWidth: 3,
      borderColor: 'green',
      borderRadius: scale(50),
      height: 30,
      marginTop: 10
    },
    heading: {
      fontWeight: 'bold'
    },
    overlayContainer: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 7 : 0,
      width: '100%',
      height: '100%',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      color: props != null ? props?.newFontcolor : 'red',
      marginTop: -25
    },
    headerTitle: {
      ...textStyles.H5,
      ...textStyles.Bolder,
      color: props != null ? props?.newFontcolor : 'black',
      flex: 1,
      textAlign: 'center'
    },
    center: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }
  })
export default styles