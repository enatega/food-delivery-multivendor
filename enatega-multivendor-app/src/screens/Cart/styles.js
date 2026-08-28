import { verticalScale, scale } from '../../utils/scaling'
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
    locationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    mB10: {
      ...alignment.MBsmall
    },
    width100: {
      width: '100%'
    },
    width30: {
      width: '30%'
    },
    screenBackground: {
      flex: 1,
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    mainContainer: {
      flex: 1,
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? 'transparent'
    },
    cartContent: {
      paddingHorizontal: props?.spacing?.md ?? scale(12),
      paddingTop: props?.spacing?.sm ?? scale(8),
      paddingBottom: scale(118),
      gap: props?.spacing?.md ?? scale(12)
    },
    dealContainer: {
      width: '100%',
      backgroundColor: 'transparent'
    },
    totalOrder: {
      marginBottom: scale(12)
    },
    termsContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.backgroundColor : 'transparent',
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
      borderRadius: scale(20),
      borderBottomColor:
        props !== null ? props.lightHorizontalLine : 'transparent',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    modal: {
      backgroundColor: props != null ? props.themeBackground : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0
    },
    overlay: {
      backgroundColor: props !== null ? props.backgroundColor2 : 'transparent'
    },
    handle: {
      width: 150,
      backgroundColor: props !== null ? props.hex : '#b0afbc'
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
      borderBottomColor: props !== null ? props.black : 'black',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    suggestedItems: {
      paddingTop: scale(6),
      paddingBottom: scale(24)
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
      borderColor: props != null ? props.customBorder : '#181818',
      borderRadius: 12,
      padding: scale(8),
      width: scale(120),
      marginTop: scale(14),
      backgroundColor: props != null ? props.cardBackground : '#181818'
    },
    suggestItemImgContainer: {
      backgroundColor: '#F3F4F6',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      padding: scale(4)
    },
    suggestItemName: {
      marginVertical: scale(10)
    },
    suggestItemPrice: {
      marginTop: scale(5)
    },
    addToCart: {
      width: scale(25),
      height: scale(25),
      borderRadius: scale(12.5),
      backgroundColor: props !== null ? props.newFontcolor : '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center'
    },
    totalBillContainer: {
      width: '100%',
      backgroundColor: props?.colors?.surface ?? '#FFFFFF',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: props?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)',
      paddingHorizontal: props?.spacing?.lg ?? scale(16),
      paddingBottom: props?.spacing?.lg ?? scale(16)
    },
    cartAmount: {
      width: '50%'
    },
    buttonContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: props?.spacing?.md ?? scale(12),
      gap: props?.spacing?.md ?? scale(12)
    },
    button: {
      backgroundColor: '#111827',
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(140),
      height: scale(40),
      borderRadius: 40
    },
    checkoutAction: {
      flex: 1,
      maxWidth: scale(180)
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
      backgroundColor: props !== null ? props.newheaderColor : 'transparent',
      width: '70%',
      height: scale(40),
      borderRadius: scale(20),
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
      backgroundColor: props != null ? props.gray : '#B8B8B8'
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
      alignItems: 'center',
      ...alignment.MBxSmall
    },
    buttonInline: {
      width: '100%',
      flexDirection: 'row'
    },
    labelButton: {
      marginRight: 10,
      borderRadius: scale(10),
      width: '22%',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.horizontalLine : 'transparent',
      justifyContent: 'center',
      height: scale(30)
    },
    activeLabel: {
      marginRight: 10,
      borderRadius: scale(10),
      backgroundColor: props !== null ? props.main : 'transparent',
      width: '22%',
      // borderWidth: 2,
      justifyContent: 'center',
      color: props !== null ? props.tagColor : 'transparent',
      borderColor: props !== null ? props.tagColor : 'transparent',
      height: scale(30)
    },
    headerContainer: {
      backgroundColor: props !== null ? props.themeBackground : '#6FCF97',
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      ...alignment.PLsmall,
      ...alignment.PRlarge,
      ...alignment.PBsmall
    },
    location: {
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    cartInnerContainer: {
      ...alignment.MTxSmall
    },
    couponContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    tipContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    changeAddressContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    changeAddressBtn: {
      borderRadius: scale(10),
      backgroundColor: props != null ? props.main : '#B8B8B8',
      width: '40%',
      justifyContent: 'center',
      alignItems: 'center',
      height: scale(30)
    },
    addressAllignment: {
      width: '100%',
      marginLeft: scale(15)
    },
    addressDetailAllign: {
      width: '65%',
      display: 'flex',
      alignItems: 'flex-end'
    },
    locationIcon: {
      backgroundColor: props != null ? props.newBorderColor : '#E5E7EB',
      width: scale(30),
      height: scale(30),
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: scale(10),
      borderWidth: 1,
      borderColor: props?.iconBackground || '#E5E7EB'
    },
    pickupButton: {
      backgroundColor: props !== null ? props.color3 : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: scale(40),
      borderRadius: 40,
      borderWidth: 1,
      borderColor: props !== null ? props.borderColor : 'black',
      width: '70%',
      alignSelf: 'center'
    },
    applyButton: {
      fontSize: 20,
      fontWeight: '500',
      color: props != null ? props.newFontcolor : '#E5E7EB'
    },
    buttonDisabled: {
      backgroundColor: '#374151',
      opacity: 0.55
    },
    minOrderMessageContainer: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      paddingBottom: verticalScale(10),
      paddingTop: verticalScale(10)
    },
    minOrderMessagePill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      maxWidth: '96%',
      backgroundColor: props !== null ? props.newBorderColor : '#F3F4F6',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props.red600 : '#DC2626',
      borderRadius: scale(20),
      paddingVertical: verticalScale(6),
      paddingHorizontal: scale(14)
    },
    minOrderMessageText: {
      flexShrink: 1,
      textAlign: 'center',
      marginLeft: scale(6)
    },
    cartSkeleton: {
      flex: 1,
      paddingHorizontal: props?.spacing?.md ?? scale(12),
      paddingTop: props?.spacing?.lg ?? scale(16),
      gap: props?.spacing?.md ?? scale(12),
      backgroundColor: props?.colors?.canvas ?? props?.themeBackground ?? '#000'
    },
    cartSkeletonRow: {
      minHeight: scale(88),
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: props?.spacing?.md ?? scale(12),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props?.colors?.borderSubtle ?? 'rgba(161, 161, 170, 0.22)'
    },
    cartSkeletonLines: {
      flex: 1,
      gap: props?.spacing?.sm ?? scale(8)
    }
  })
export default styles
