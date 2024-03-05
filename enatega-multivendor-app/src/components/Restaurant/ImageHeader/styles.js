import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'
import { textStyles } from '../../../utils/textStyles'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')
const windowWidth = Dimensions.get('window').width
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      backgroundColor: '#fff',
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      height: height * 0.5
    },

    touchArea: {
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(20)
    },
    fixedViewNavigation: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.PTsmall
    },

    fixedIcons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 12
    },
    restaurantDetails: {
      marginTop: scale(16)
    },

    restaurantImg: {
      width: scale(80),
      height: scale(80),
      borderRadius: 12
    },
    restaurantAbout: {
      fontSize: scale(14),
      color: '#6B7280',
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
      color: props != null ? props.fontWhite : 'white',
      borderRadius: scale(5),
      ...alignment.PxSmall
    },
    ratingBox: {
      flexDirection: 'row',
      gap: scale(3),
      alignItems: 'center'
      // marginTop: scale(15)
    },

    // headerTitle: {
    //   ...textStyles.H5,
    //   ...textStyles.Bolder,
    //   color: props != null ? props.black : 'black',
    //   flex: 1,
    //   textAlign: 'center'
    // },
    flatListStyle: {
      height: '10%',
      width: '100%',
      marginTop: scale(25)
      // backgroundColor: props != null ? props.themeBackground : 'white',
      // borderBottomLeftRadius: 25,
      // borderBottomRightRadius: 25,
      // zIndex: 2
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
      borderBottomWidth: scale(3),
      borderColor: '#90E36D'
    },
    heading: {
      fontWeight: 'bold'
    }
    // navbarTextContainer: {
    //   display: 'flex',
    //   flex: 1,
    //   flexDirection: 'row',
    //   height: '100%',
    //   justifyContent: 'center',
    //   alignItems: 'center'
    // }
  })
export default styles
