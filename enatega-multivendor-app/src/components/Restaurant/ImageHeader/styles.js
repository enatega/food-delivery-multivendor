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
      right: 0
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
      alignSelf: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: props != null ? props.buttonBackground : 'green',
      borderRadius: scale(10),
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      ...alignment.Psmall
    },
    deliveryBox: {
      color: props != null ? props.fontWhite : 'white',
      fontSize: scale(12),
      borderRadius: scale(5),
      ...alignment.PxSmall
    },
    ratingBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTxSmall
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
      // backgroundColor: 'rgba(0,0,0,0.5)',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    headerTitle: {
      ...textStyles.H4,
      ...textStyles.Bolder,
      color: props != null ? props.fontMainColor : 'white',
      flex: 1,
      textAlign: 'center'
    },
    flatListStyle: {
      width: '90%',
      backgroundColor: props != null ? props.menuBar : 'white',
      alignSelf: 'center',
      borderRadius: scale(10),
      ...alignment.MTsmall,
      ...alignment.MBsmall,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
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
      borderBottomWidth: scale(4),
      borderColor: props != null ? props.tagColor : 'red',
      height: '90%'
    },
    inActiveHeader: {
      borderBottomWidth: scale(1),
      borderColor: props != null ? props.tagColor : 'red',
      height: '85%'
    },
    navbarTextContainer: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
