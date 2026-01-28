import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { fontStyles } from '../../utils/fontStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },

    pT10: {
      ...alignment.PTsmall
    },

    mB10: {
      ...alignment.MBsmall
    },
    map: {
      width: '100%',
      height: '100%'
    },
    width100: {
      width: '100%'
    },
    width30: {
      width: '30%'
    },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF'
    },
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
      //...alignment.PTsmall
    },
    paymentSecInner: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      ...alignment.MTxSmall
    },
    totalOrder: {
      color: props != null ? props?.fontNewColor : '#6B7280',
      marginBottom: scale(12)
    },
    termsContainer: {
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    tipSec: {
      ...alignment.MLmedium,
      ...alignment.MRmedium,
      marginVertical: scale(22)
    },
    tipRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(8)
    },
    itemContainer: {
      width: '100%',
      backgroundColor: props !== null ? props?.backgroundColor : 'transparent'
    },
    priceContainer: {
      width: '100%',
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      borderRadius: scale(20),
      borderBottomColor:
        props !== null ? props?.lightHorizontalLine : 'transparent',
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      marginVertical: scale(13)
    },
    modal: {
      backgroundColor: props != null ? props?.cardBackground : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0,
      paddingTop: 24,
      paddingBottom: 24,
      paddingLeft: 16,
      paddingRight: 16,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: props !== null ? props?.customBorder : '#717171',
      justifyContent: 'space-between'
    },
    overlay: {
      backgroundColor: props !== null ? props?.backgroundColor2 : 'transparent'
    },
    handle: {
      width: 150,
      backgroundColor: props !== null ? props?.hex : '#b0afbc'
    },
    floatView: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
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
      borderWidth: 0.5,
      borderColor: props !== null ? props?.iconBackground : 'white'
    },
    horizontalLine2: {
      marginVertical: scale(11)
    },
    deliveryTime: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      margin: scale(5),
      ...alignment.PLxSmall
    },

    suggestedItems: {
      paddingBottom: scale(30),
      ...alignment.PLlarge
    },
    suggestItemDesciption: {
      ...alignment.PRlarge
    },
    suggestItemImg: {
      width: '100%',
      // aspectRatio: 18/8,
      height: scale(70)
    },
    suggestItemContainer: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
      padding: scale(8),
      width: scale(120),
      marginTop: scale(14)
    },
    suggestItemImgContainer: {
      backgroundColor: '#F3F4F6',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      padding: scale(4)
    },
    suggestItemName: {
      marginVertical: scale(5)
    },
    suggestItemPrice: {
      marginTop: scale(5)
    },
    addToCart: {
      width: scale(25),
      height: scale(25),
      borderRadius: scale(12.5),
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center'
    },

    buttonContainer: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PBlarge
    },
    changeBtn: {
      backgroundColor: props !== null ? props?.main : 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(80),
      height: scale(30),
      borderRadius: 40
    },
    changeBtnInner: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 5
    },
    button: {
      backgroundColor: props !== null ? props?.main : 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      height: scale(50),
      borderRadius: 40
    },
    buttonDisabled: {
      backgroundColor: props !== null ? props?.white : 'white',
      borderWidth: 1,
      borderColor: props !== null ? props?.black : 'black'
    },

    // totalBill:{
    //   fontSize:scale(27)
    // },
    // buttontLeft: {
    //   width: '35%',
    //   height: '50%',
    //   justifyContent: 'center'
    // },
    // buttonLeftCircle: {
    //   backgroundColor: props != null ? props?.black : 'black',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: scale(18),
    //   height: scale(18),
    //   borderRadius: scale(9)
    // },
    // iconStyle: {
    //   height: verticalScale(18),
    //   width: verticalScale(18)
    // },
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
      backgroundColor: props !== null ? props?.newheaderColor : 'transparent',
      width: '70%',
      height: scale(40),
      borderRadius: scale(20),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    placeHolderContainer: {
      backgroundColor: props != null ? props?.cartContainer : '#B8B8B8',
      borderRadius: 3,
      elevation: 3,
      marginBottom: 12,
      padding: 12
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props?.gray : '#B8B8B8'
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

    buttonInline: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between'
      // gap:scale(8),
    },
    labelButton: {
      borderRadius: scale(40),
      width: '23%',
      borderWidth: 1,
      borderColor: props !== null ? props?.iconBackground : 'transparent',
      backgroundColor: props !== null ? props?.color5 : 'transparent',
      justifyContent: 'center',
      height: scale(37)
    },
    activeLabel: {
      borderRadius: scale(40),
      backgroundColor: props !== null ? props?.main : 'transparent',
      width: '23%',
      justifyContent: 'center',
      borderColor: props !== null ? props?.main : 'transparent',
      height: scale(37)
    },
    headerContainer: {
      backgroundColor: props !== null ? props?.themeBackground : '#6FCF97'
    },
    mapView: {
      height: scale(119)
    },
    marker: {
      width: 50,
      height: 50,
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 1,
      translateX: -25,
      translateY: -25,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: -25 }, { translateY: -25 }]
    },
    voucherSec: {
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    voucherSecInner: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5),
      marginTop: scale(10),
      marginBottom: scale(10)
    },
    paymentSec: {
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      marginTop: scale(13)
    },

    imageContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    cartInnerContainer: {
      marginTop: 4,
      padding: 6,
      backgroundColor: props != null ? props?.black : '#B8B8B8',
      width: '50%',
      borderRadius: 6
    },
    couponContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-end'
    },
    tipContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    billsec: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    changeAddressContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    changeAddressBtn: {
      borderRadius: scale(10),
      backgroundColor: props != null ? props?.main : '#B8B8B8',
      width: '40%',
      justifyContent: 'center',
      alignItems: 'center',
      height: scale(30)
    },
    addressAllignment: {
      // display: 'flex',
      // flexDirection: 'column',
      // // justifyContent: 'flex-end',
      width: '100%',
      marginLeft: scale(15)
    },
    addressDetailAllign: {
      width: '65%',
      display: 'flex',
      alignItems: 'flex-end'
    },
    modalContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 24
    },
    modalHeader: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    modalheading: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 5
    },
    modalInput: {
      height: scale(40),
      borderWidth: 1,
      borderColor: props != null ? props?.verticalLine : '#B8B8B8',
      padding: 10,
      borderRadius: 6,
      color: props !== null ? props?.newFontcolor : '#f9f9f9',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    labelContainer: {
      width: '80%',
    },
    iconContainer: {
      flex: 1,
      padding: scale(2)
    },
    icon: {
      backgroundColor: props != null ? props?.iconBackground : '#E5E7EB',
      width: scale(24),
      height: scale(24),
      borderRadius: scale(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    pickupButton: {
      backgroundColor: props !== null ? props?.color3 : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      height: scale(40),
      borderRadius: 40,
      borderWidth: 1,
      borderColor: props !== null ? props?.iconColor : '#717171',
      width: '70%',
      alignSelf: 'center'
    },
    // Wallet Styles
    walletCard: {
      backgroundColor: '#90E36D',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    walletCardContent: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    walletIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: props?.isRTL ? 0 : 12,
      marginLeft: props?.isRTL ? 12 : 0
    },
    walletInfo: {
      flex: 1
    },
    walletArrow: {
      marginLeft: props?.isRTL ? 0 : 8,
      marginRight: props?.isRTL ? 8 : 0
    },
    walletAppliedCard: {
      backgroundColor: props !== null ? props?.themeBackground : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: props !== null ? props?.primary || '#90E36D' : '#90E36D'
    },
    walletAppliedHeader: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    },
    walletRemoveBtn: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6
    },
    walletAppliedContent: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    walletAppliedIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: props !== null ? `${props?.primary}20` || '#90E36D20' : '#90E36D20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: props?.isRTL ? 0 : 12,
      marginLeft: props?.isRTL ? 12 : 0
    },
    walletAppliedInfo: {
      flex: 1
    },
    walletSavingsTag: {
      backgroundColor: '#10B981',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
    },
    walletModalCard: {
      backgroundColor: '#90E36D',
      borderRadius: 12,
      padding: 16,
      marginTop: 8
    },
    walletModalHeader: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8
    },
    walletModalInput: {
      height: scale(50),
      borderWidth: 2,
      borderColor: props !== null ? props?.primary || '#90E36D' : '#90E36D',
      backgroundColor: props !== null ? props?.themeBackground : '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      fontSize: 16,
      color: props !== null ? props?.fontMainColor : '#000000',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    walletPreview: {
      backgroundColor: props !== null ? `${props?.primary}15` || '#90E36D15' : '#90E36D15',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center'
    },
    walletModalButton: {
      backgroundColor: '#90E36D',
      justifyContent: 'center',
      alignItems: 'center',
      height: scale(50),
      borderRadius: 12,
      marginTop: 16
    },
    // Remove Button
    removeButton: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: 'flex-end'
    }
  })
export default styles
