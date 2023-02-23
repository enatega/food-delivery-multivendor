import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    navbarContainer: {
      paddingBottom: 0,
      height: '5%',
      elevation: 4,
      shadowColor: '#000',
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
      backgroundColor: props != null ? props.cartContainer : 'white',
      ...alignment.PLlarge,
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    deal: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    dealSection: {
      position: 'relative',
      backgroundColor: props != null ? props.cartContainer : 'white',
      ...alignment.PLlarge,
      ...alignment.PRxSmall
    },
    dealDescription: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
      ...alignment.PRxSmall
    },
    dealPrice: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflow: 'hidden'
    },
    priceText: {
      maxWidth: '100%',
      ...alignment.MRxSmall
    },
    listSeperator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: props != null ? props.lightHorizontalLine : 'grey'
    },
    sectionSeparator: {
      width: '100%',
      height: scale(15),
      backgroundColor: props != null ? props.themeBackground : 'white'
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: scale(40),
      backgroundColor: props != null ? props.themeBackground : 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props != null ? props.buttonBackgroundPink : 'red',
      height: '100%',
      width: '100%',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    buttonText: {
      width: '30%'
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
      backgroundColor: props != null ? props.buttonTextPink : 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTextLeft: {
      ...textStyles.Bold,
      ...textStyles.Center,
      ...textStyles.Smaller,
      backgroundColor: 'transparent',
      color: props != null ? props.buttonBackground : 'black'
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
