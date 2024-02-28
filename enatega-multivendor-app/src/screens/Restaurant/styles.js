import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'
import { theme } from '../../utils/themeColors'


const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props != null ? props.themeBackground : 'white'
    },
    navbarContainer: {
      paddingBottom: 0,
      height: '5%',
      elevation: 4,
      shadowColor: theme.Pink.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(2)
      },
      shadowOpacity: 0.6,
      shadowRadius: verticalScale(2),
      zIndex: 1
    },
    sectionHeaderText: {
      textTransform: 'capitalize',
      ...alignment.PLmedium,
      ...alignment.PTlarge,
      fontSize: scale(18),
      fontWeight: '600'
    },
    popularItemCards:{
      // ...alignment.PLlarge,
      // ...alignment.PTlarge,
    },
    deal: {
      width: '80%',
      flexDirection: 'row',
      backgroundColor: props != null ? props.themeBackground : 'white',
      alignItems: 'center',
      gap:scale(5)
    },
    dealSection: {
      // position: 'relative',
      backgroundColor: props != null ? props.themeBackground : 'white',
      paddingVertical: scale(10),
      ...alignment.PRmedium,
    },
    dealDescription: {
      backgroundColor: props != null ? props.themeBackground : 'white',

      ...alignment.PRxSmall
    },
    dealPrice: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflow: 'hidden'
    },
    priceText: {
      color: props != null ? props.darkBgFont : 'white',
      fontSize: 15,
      paddingTop: scale(10),
      maxWidth: '100%',
      ...alignment.MRxSmall
    },
    
    headerText: {
      fontSize: 18,
      paddingTop: scale(5),
      maxWidth: '100%',
      ...alignment.MRxSmall,
      backgroundColor: props != null ? props.themeBackground : 'white'
    },
    addToCart: {
      width: scale(25),
      height: scale(25),
      borderRadius: scale(12.5),
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center'
    },
    // listSeperator: {
    //   borderBottomWidth: StyleSheet.hairlineWidth,
    //   borderColor: theme.Pink.black,
    //   paddingTop: scale(15),
    //   marginBottom: scale(15),
    //   width: '90%',
    //   alignSelf: 'center'
    // },
    sectionSeparator: {
      width: '100%',
      height: scale(15),
      backgroundColor: props != null ? props.themeBackground : 'white'
    },

    buttonContainer: {
      width: '100%',
      height: '10%',
      backgroundColor: props !== null ? props.themeBackground : 'black',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 12,
      shadowColor: props !== null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: -verticalScale(3)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(2)
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: scale(16),
      backgroundColor: props !== null ? props.buttonBackground : 'black',
      height: '75%',
      width: '95%',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    buttonText: {
      width: '30%',
      color: 'black'
    },
    buttonTextRight: {
      width: '35%'
    },
    buttontLeft: {
      width: '35%',
      height: '50%',
      justifyContent: 'center'
    },
    buttonLeftCircle: {
      backgroundColor: props != null ? props.black : 'black',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTextLeft: {
      ...textStyles.Bolder,
      ...textStyles.Center,
      ...textStyles.Smaller,
      backgroundColor: 'transparent',
      color: props != null ? props.white : 'white'
    },
    triangleCorner: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: scale(25),
      borderTopWidth: scale(20),
      borderLeftColor: 'transparent',
      borderTopColor: props != null ? props.tagColor : 'red'
    },
    tagText: {
      width: scale(15),
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 1,
      right: 0,
      textAlign: 'center'
    }
  })
export default styles