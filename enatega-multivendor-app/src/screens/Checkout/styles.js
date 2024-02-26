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


    mB10: {
      ...alignment.MBsmall
    },
    map: {
      width: '100%',
      height: '100%',
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
    mainContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
      //...alignment.PTsmall
    },
    dealContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      borderRadius: scale(10),
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    totalOrder: {
      color: props != null ? props.fontNewColor : '#6B7280',
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
      backgroundColor: props !== null ? props.backgroundColor : 'transparent'
    },
    priceContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : 'transparent',
      borderRadius: scale(20),
      borderBottomColor:
        props !== null ? props.lightHorizontalLine : 'transparent',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    modal: {
      backgroundColor: props != null ? props.cartContainer : '#FFF',
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
    suggestedItems:{
      paddingBottom:scale(30),
      ...alignment.PLlarge,
    },
    suggestItemDesciption:{
      ...alignment.PRlarge,
    },
    suggestItemImg:{
      width: '100%', 
      // aspectRatio: 18/8,
      height:scale(70) 
    },
    suggestItemContainer:{
      borderWidth:1,
      borderColor:'#D1D5DB',
      borderRadius:12,
      padding:scale(8),
      width: scale(120),
      marginTop:scale(14),
      
    },
    suggestItemImgContainer:{
      backgroundColor: '#F3F4F6',
      borderWidth:1,
      borderColor:'#E5E7EB',
      borderRadius:8,
      padding:scale(4),
    },
    suggestItemName:{
      marginVertical:scale(5)
    },
    suggestItemPrice:{
      marginTop:scale(5)
    },
    addToCart: {
      width: scale(25),
      height: scale(25),
      borderRadius: scale(12.5),
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center'
    },
    totalBillContainer:{
      width: '100%',
      height: '10%',
      // backgroundColor: props !== null ? props.newheaderColor : '#90E36D',
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      
    },
    buttonContainer: {     
     
      justifyContent: 'center',
      alignItems: 'center', 
    
    },
    button: {
      backgroundColor: '#111827',
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(140),
      height: scale(40),
      borderRadius:40
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
    //   backgroundColor: props != null ? props.black : 'black',
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
      borderRadius: scale(10),
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
      //borderWidth: 2,
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

    imageContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    cartInnerContainer: {
      marginTop: 4,
      padding: 6,
      backgroundColor: props != null ? props.black : '#B8B8B8',
      width: '50%',
      borderRadius: 6
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
    }
  })
export default styles