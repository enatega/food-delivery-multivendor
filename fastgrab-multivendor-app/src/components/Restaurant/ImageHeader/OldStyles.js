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
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },

    overlayContainer: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.01)',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    headerTitle: {
      ...textStyles.H5,
      ...textStyles.Bolder,
      color: props != null ? props.black : 'black',
      flex: 1,
      textAlign: 'center'
    },
    flatListStyle: {
      height: '50%',
      width: '100%',
      backgroundColor: props != null ? props.themeBackground : 'white',
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      zIndex: 2
    },
    headerContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      backgroundColor: props != null ? props.menuBar : 'white',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      borderRadius: 100
    },
    activeHeader: {
      borderBottomWidth: scale(4),
      borderColor: props != null ? props.tagColor : 'red',
      height: '100%'
    },
    heading: {
      fontWeight: 'bold'
    },
    navbarTextContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
