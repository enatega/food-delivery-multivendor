import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'

const { height, width } = Dimensions.get('window')
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    pT10: {
      ...alignment.PTsmall
    },
    pB10: {
      ...alignment.PBsmall
    },
    pB5: {
      ...alignment.PBxSmall
    },
    mB10: {
      ...alignment.MBsmall
    },
    mT10: {
      ...alignment.MTsmall
    },
    width100: {
      width: '100%'
    },
    width30: {
      width: '30%'
    },
    screenBackground: {
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    map: {
      width: width,
      height: height * 0.3
    },
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    dealContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      borderRadius: scale(5),
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      elevation: 7,
      shadowColor: props != null ? props.shadowColor : 'grey',
      shadowOffset: {
        width: 0,
        height: verticalScale(0)
      },
      shadowOpacity: 0.3,
      shadowRadius: verticalScale(3)
    },
    termsContainer: {
      width: '100%',
      backgroundColor: 'transparent',
      borderRadius: scale(5),
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    itemContainer: {
      width: '100%',
      backgroundColor: 'transparent'
    },
    priceContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      borderRadius: scale(5),
      borderBottomColor:
        props !== null ? props.lightHorizontalLine : 'transparent',
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      elevation: 3,
      shadowColor: props !== null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: -4
      },
      shadowOpacity: 0.1
    },
    deliveryContainer: {
      width: '90%',
      alignSelf: 'center',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      borderRadius: scale(5),
      borderBottomColor:
        props !== null ? props.lightHorizontalLine : 'transparent',
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
      // backgroundColor: 'linear-gradient(260.99deg, #90EA93 2.79%, #6FCF97 96.54%)',
      // boxShadow:' 0px 0px 15px rgba(0, 0, 0, 0.15)',
      // borderRadius: scale(20)
    },
    modal: {
      backgroundColor: props != null ? props.cartContainer : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0,
      marginBottom: 65
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    handle: {
      width: 150,
      backgroundColor: '#b0afbc'
    },
    floatView: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center'
    },
    floatLeft: {
      width: '30%',
      textAlign: 'left'
    },
    floatRight: {
      width: '70%',
      textAlign: 'right'
    },
    horizontalLine: {
      borderBottomColor: props !== null ? props.horizontalLine : 'black',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      ...alignment.PTsmall,
      backgroundColor: 'transparent'
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props != null ? props.themeBackground : 'red',
      height: '100%',
      width: '100%',
      ...alignment.PTsmall,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      elevation: 5,
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
      ...alignment.MBsmall,
      ...alignment.PTsmall,
      ...alignment.PBsmall,
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
    iconStyle: {
      height: verticalScale(15),
      width: verticalScale(20)
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center'
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBlarge
    },
    image: {
      width: scale(100),
      height: scale(100)
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    emptyButton: {
      width: '60%',
      height: '8%',
      backgroundColor: props !== null ? props.buttonBackground : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    placeHolderContainer: {
      backgroundColor: props != null ? props.cartContainer : '#B8B8B8',
      borderRadius: 3,
      elevation: 3,
      marginBottom: 12,
      padding: 12
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props.fontSecondColor : '#B8B8B8'
    },
    height100: {
      height: 100
    },
    height60: {
      height: 60
    },
    trashIcon: {
      backgroundColor: 'red',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    trashContainer: {
      ...alignment.PLmedium,
      ...alignment.MBxSmall,
      justifyContent: 'center',
      alignItems: 'center',
      width: '20%'
    },
    tipRow: {
      // justifyContent: 'space-between',
      alignItems: 'center',
      ...alignment.MBxSmall
    },
    buttonInline: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
    },
    labelButton: {
      width: '20%',
      borderWidth: 1,
      borderColor: props !== null ? props.fontMainColor : 'transparent',
      justifyContent: 'center',
      height: scale(25),
      borderRadius: scale(5)
    },
    activeLabel: {
      width: '20%',
      justifyContent: 'center',
      backgroundColor: props !== null ? props.tagColor : 'transparent',
      borderColor: props !== null ? props.tagColor : 'transparent',
      height: scale(25),
      borderRadius: scale(5)
    },
    line: {
      width: '100%',
      borderBottomColor: props !== null ? props.horizontalLine : 'black',
      borderBottomWidth: StyleSheet.hairlineWidth,
      ...alignment.MBsmall
    }
  })
export default styles
