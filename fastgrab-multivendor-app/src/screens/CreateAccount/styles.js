import { scale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height, width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      alignItems: 'center',
      backgroundColor: props !== null ? props?.buttonText : 'transparent'
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props != null ? props?.themeBackground : '#FFF'
    },
    image: {
      // height: height * 0.4,
      height: 300,
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      shadowColor: '#f3f0eb',
      shadowOffset: { width: 16, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 19
    },
    image1: {
      top: scale(-50),
      width,
      overflow: 'hidden',
      alignItems: 'center',
    },
    subContainer: {
      alignSelf: 'center',
      width: '100%',
      // height: height * 0.6,
      flex: 1,
      backgroundColor: props != null ? props?.themeBackground : '#FFF'

    },
    signupContainer: {
      paddingVertical: scale(20),
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      flex: 1,
      justifyContent: 'space-between',
      ...alignment.MBsmall
    },
    whiteColor: {
      backgroundColor: props !== null ? props?.buttonText : 'transparent'
    },
    crossIcon: {
      width: scale(14),
      height: scale(14),
      ...alignment.MTlarge,
      ...alignment.MLlarge
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop10: {
      ...alignment.MTmedium
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    buttoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonBackground: {
      width: '90%',
      backgroundColor: props !== null ? props?.newFontcolor : '#000',
      borderRadius: scale(30),
      height: height * 0.07,
    },
    appleBtn: {
      width: '90%',
      alignSelf: 'center',
      height: height * 0.07
    },
    orText: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props?.borderBottomColor : '#9B9A9A'
    },
    guestButton: {
      width: '90%',
      alignSelf: 'center',
      padding: 15,
      alignItems: 'center',
      borderRadius: scale(40),
      backgroundColor: props !== null ? props?.main : '#F7E7E5'
    },
    descText: {
      marginHorizontal: scale(15)
    },
    mainHeadingTextOverlay: {
      position: 'absolute',
      top: scale(20),
      left: 0,
      right: 0
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    burgerImage: {
      position: 'absolute',
      top: scale(30),
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center'
    }
    
  })
export default styles
