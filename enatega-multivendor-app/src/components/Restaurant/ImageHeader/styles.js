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
      height: height * 0.3,
      top: 0,
      left: 0,
      right: 0,
      //shadowColor: props != null ? props.shadowColor : 'black',
      //shadowOpacity: 0.7,
      // shadowOffset: {
      //   height: scale(1),
      //   width: 0
      // },
      //shadowRadius: scale(3),
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
      padding: 10,
      borderRadius: 20,
      borderColor: "white",
      borderWidth: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      width: '50%',
      alignItems: 'center',
      alignSelf: 'center'
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
      height: '50%',
      width: '100%',
      backgroundColor: 'white',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 25,
      zIndex: 2 // important
    },
    headerContainer: {
      height: '100%',
      width: '100%',
      display:"flex",
      backgroundColor: props != null ? props.menuBar : 'white',
      alignItems: "center",
      justifyContent: 'center',
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      borderRadius: 100
    },
    activeHeader: {
      borderBottomWidth: scale(4),
      borderColor: props != null ? props.tagColor : 'red',
      height: '100%',
    },
    heading: {
      fontWeight: "bold",
    },
    navbarTextContainer: {
      display:"flex",
      flex:1,
      flexDirection:"row",
      height: '100%',
      justifyContent: 'center',
       alignItems: 'center',
      
    }
  })
export default styles
