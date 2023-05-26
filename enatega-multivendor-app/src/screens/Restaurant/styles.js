import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props != null ? props.secondaryBackground : 'white'
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
      backgroundColor: props != null ? props.secondaryBackground : 'white'
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: 'transparent'
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props != null ? props.themeBackground : 'red',
      height: '100%',
      width: '100%',
      ...alignment.PTmedium,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: verticalScale(2)
      },
      borderTopLeftRadius: scale(10),
      borderTopRightRadius: scale(10),
      shadowOpacity: 0.6,
      shadowRadius: verticalScale(2),
      zIndex: 1
    },
    buttonText: {
      width: '50%',
      ...alignment.MBmedium,
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      borderRadius: scale(10)
    },
    buttontLeft: {
      width: '50%',
      justifyContent: 'center',
      ...alignment.MBmedium,
      alignItems: 'center'
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
      fontSize: 20,
      ...alignment.MLxSmall,
      ...alignment.MRxSmall,
      backgroundColor: 'transparent',
      color: props != null ? props.backIconBackground : 'black'
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
    },
    two: {
      borderWidth: 1,
      borderColor: props != null ? props.backIconBackground : 'black',
      ...alignment.PxSmall,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      borderRadius: scale(5)
    }
  })
export default styles
