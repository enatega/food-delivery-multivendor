import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'
import { textStyles } from '../../../utils/textStyles'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      position: 'absolute',
      // height: height * 0.3,
      top: 0,
      left: 0,
      right: 0,
      shadowColor: props != null ? props.shadowColor : 'black',
      shadowOpacity: 0.7,
      shadowOffset: {
        height: scale(1),
        width: 0
      },
      shadowRadius: scale(3),
      elevation: 5
    },
    touchArea: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,1)',
      borderRadius: scale(17),
      height: scale(34),
      width: scale(34)
    },
    fixedViewNavigation: {
      width: '100%',
      height: height * 0.07,
      justifyContent: 'center',
      zIndex: 1
    },
    fixedView: {
      flex: 1,
      backgroundColor: 'transparent',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    fixedIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    fixedText: {
      width: '100%',
      alignItems: 'center'
    },
    deliveryBox: {
      color: props != null ? props.fontWhite : 'white',
      fontSize: scale(12),
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: props != null ? props.white : 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: scale(5),
      ...alignment.PxSmall,
      ...alignment.MTsmall
    },
    ratingBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    // New Styling
    overlayContainer: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      // justifyContent: 'center',
      zIndex: 1,
      backgroundColor: 'rgba(0,0,0,0.15)',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    headerTitle: {
      ...textStyles.H5,
      ...textStyles.Bolder,
      color: props != null ? props.fontWhite : 'white',
      flex: 1,
      textAlign: 'center'
    },
    flatListStyle: {
      height: '100%',
      width: '100%',
      backgroundColor: props != null ? props.menuBar : 'white',
      zIndex: 2 // important
    },
    headerContainer: {
      height: '100%',
      backgroundColor: props != null ? props.menuBar : 'white',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PxSmall,
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    activeHeader: {
      borderBottomWidth: scale(2),
      borderColor: props != null ? props.tagColor : 'red',
      padding: scale(0),
      height: '100%'
    },
    navbarTextContainer: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
