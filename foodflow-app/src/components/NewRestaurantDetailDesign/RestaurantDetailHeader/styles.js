import { StyleSheet, Platform } from 'react-native'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import { StatusBar } from 'react-native'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: props?.cardBackground ?? '#181818'
    },
    imageContainer: {
      width: '100%',
      position: 'relative',
      height: scale(200)
    },
    mainRestaurantImg: {
      height: '100%',
      width: '100%'
    },
    headerIconsContainer: {
      position: 'absolute',
      top: STATUSBAR_HEIGHT + scale(10),
      left: 0,
      right: 0,
      paddingHorizontal: scale(15),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10
    },
    iconButton: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    deliveryDetailsOverlay: {
      position: 'absolute',
      bottom: scale(10),
      width: '100%',
      paddingHorizontal: scale(15),
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: scale(5)
    },
    detailPill: {
      backgroundColor: props?.themeBackground ?? 'white',
      borderRadius: scale(20),
      paddingVertical: scale(5),
      paddingHorizontal: scale(15),
      minWidth: '45%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    contentContainer: {
      padding: scale(15),
      gap: scale(12)
    },
    subContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    titleContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(10),
      flex: 1
    },
    restaurantImg: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(8)
    },
    cuisineContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    infoContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    ratingBox: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(8)
    },
    reviewButton: {
      backgroundColor: props?.newButtonBackground ?? '#F3FFEE',
      borderRadius: scale(4),
      paddingVertical: scale(8),
      paddingHorizontal: scale(12)
    },
    timingContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    timingRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5)
    },
    statusButton: {
      backgroundColor: props?.newButtonBackground ?? '#F3FFEE',
      borderRadius: scale(4),
      paddingVertical: scale(8),
      paddingHorizontal: scale(12)
    },
    deliveryContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(8)
    },
    searchContainer: {
      paddingHorizontal: scale(15),
      marginTop: scale(10),
      marginBottom: scale(15)
    },
    searchBarContainer: {
      height: scale(45),
      backgroundColor: props?.searchBarColor,
      borderRadius: scale(25),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scale(15),
      borderWidth: 1,
      borderColor: props?.borderColor
    },
    searchIcon: {
      marginRight: scale(10),
      opacity: 0.5
    },
    searchText: {
      fontSize: scale(16),
      color: props?.fontSecondColor,
      flex: 1
    }
  })

export default styles
