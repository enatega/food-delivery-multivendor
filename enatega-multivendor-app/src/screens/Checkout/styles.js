import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

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
      flex: 1,
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#FFF'
    },
    mainContainer: {
      flex: 1,
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? 'transparent'
      // ...alignment.PTsmall
    },
    headerBackButton: {
      width: scale(40),
      height: scale(40),
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkoutContent: {
      paddingHorizontal: scale(8),
      paddingTop: scale(8),
      paddingBottom: scale(112)
    },
    mapCard: {
      borderRadius: scale(16),
      overflow: 'hidden',
      backgroundColor: props?.colors?.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle
    },
    detailsSection: {
      marginTop: scale(12)
    },
    addressRow: {
      minHeight: scale(60),
      justifyContent: 'center'
    },
    sectionInset: {
      paddingHorizontal: 0
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
      paddingHorizontal: 0,
      marginTop: scale(6),
      marginBottom: scale(20)
    },
    tipSec: {
      marginTop: scale(26),
      marginBottom: scale(8),
      paddingHorizontal: 0
    },
    tipRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(10)
    },
    itemContainer: {
      width: '100%',
      backgroundColor: props !== null ? props?.backgroundColor : 'transparent'
    },
    priceContainer: {
      width: '100%',
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      marginTop: scale(30),
      marginBottom: scale(8)
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
      height: StyleSheet.hairlineWidth,
      backgroundColor: props?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    horizontalLine2: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: props?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)',
      marginVertical: props?.spacing?.md ?? scale(12)
    },
    deliveryTime: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      minHeight: scale(60),
      paddingHorizontal: scale(10)
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
      paddingHorizontal: scale(8),
      paddingTop: scale(10),
      backgroundColor: props?.colors?.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: props?.colors?.borderSubtle
    },
    changeBtn: {
      backgroundColor: props?.colors?.accent ?? props?.main ?? 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(80),
      height: scale(30),
      borderRadius: scale(13)
    },
    changeBtnInner: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 5
    },
    button: {
      backgroundColor: props?.colors?.accent ?? props?.main ?? 'gray',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      height: scale(52),
      borderRadius: scale(14)
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
      gap: scale(8)
    },
    labelButton: {
      flex: 1,
      borderRadius: scale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? 'transparent',
      backgroundColor: props?.colors?.surfaceSubtle ?? 'transparent',
      justifyContent: 'center',
      height: scale(42)
    },
    activeLabel: {
      flex: 1,
      borderRadius: scale(12),
      backgroundColor: props?.colors?.accentSubtle ?? props?.main ?? 'transparent',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.accent ?? props?.main ?? 'transparent',
      height: scale(42)
    },
    headerContainer: {
      backgroundColor: props !== null ? props?.themeBackground : '#6FCF97'
    },
    mapView: {
      height: scale(132)
    },
    mapLabel: {
      position: 'absolute',
      left: scale(9),
      bottom: scale(9),
      maxWidth: '72%',
      minHeight: scale(32),
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(6),
      paddingHorizontal: scale(10),
      backgroundColor: props?.colors?.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle,
      borderRadius: scale(11)
    },
    mapUnavailable: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: scale(8),
      paddingHorizontal: scale(20),
      backgroundColor: props !== null ? props?.cardBackground : '#F3F4F6'
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
      paddingHorizontal: 0,
      marginTop: scale(24)
    },
    voucherSecInner: {
      display: 'flex',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5),
      minHeight: scale(44),
      marginVertical: 0
    },
    paymentSec: {
      paddingHorizontal: 0,
      marginTop: scale(26)
    },
    checkoutSkeleton: {
      paddingHorizontal: scale(8),
      paddingTop: scale(10),
      gap: scale(14)
    },
    skeletonSection: {
      gap: scale(10),
      paddingVertical: scale(8)
    },
    skeletonPills: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    skeletonBillRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: scale(28)
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
      alignItems: 'center',
      minHeight: scale(38)
    },
    summaryDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: props?.colors?.borderSubtle,
      marginTop: scale(5),
      marginBottom: scale(7)
    },
    totalRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: scale(44)
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
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? '#B8B8B8',
      padding: 10,
      borderRadius: 6,
      color: props !== null ? props?.newFontcolor : '#f9f9f9',
      textAlign: props?.isRTL ? 'right' : 'left'
    },
    labelContainer: {
      width: '80%'
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
      alignItems: 'center'
    },
    pickupButton: {
      backgroundColor: props !== null ? props?.color3 : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      height: scale(40),
      borderRadius: 40,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderStandard ?? '#717171',
      width: '70%',
      alignSelf: 'center'
    }
  })
export default styles
