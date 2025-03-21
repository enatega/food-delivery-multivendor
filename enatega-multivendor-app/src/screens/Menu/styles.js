import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'

import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: { flex: 1, gap: 8, backgroundColor: props != null ? props?.themeBackground : '#FFF' },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      ...alignment.PBlarge,
      
    },
    searchbar: {
      ...alignment.PBmedium,
      backgroundColor: props != null ? props?.white : '#FFF'
    },

    mainContentContainer: {
      width: '100%',
      height: '80%',
      alignSelf: 'center',
      // backgroundColor: 'red'
    },

    ML20: {
      ...alignment.MLlarge
    },
    PB10: {
      ...alignment.MBsmall
    },
    mL5p: {
      ...alignment.MLsmall
    },
    addressbtn: {
      backgroundColor: props != null ? props?.color8 : '#f0f0f0',
      marginLeft: scale(10),
      marginRight: scale(10),
      marginBottom: scale(10),
      borderRadius: scale(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: scale(5),
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      borderWidth: scale(1),
      borderColor: props != null ? props?.color10 : '#FFF'
    },
    addNewAddressbtn: {
      padding: scale(5),
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    addressContainer: {
      width: '100%',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    addButton: {
      backgroundColor: props !== null ? props?.newheaderColor : 'transparent',
      width: '100%',
      height: scale(40),
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    addressSubContainer: {
      width: '90%',
      alignSelf: 'center',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center'
    },
    content: {
      ...alignment.PTlarge
    },
    modal: {
      backgroundColor: props != null ? props?.cardBackground : '#FFF',
      paddingTop: scale(10),
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      position: 'relative',
      zIndex: 9999999,
      shadowOpacity: 0,
      borderWidth: scale(1),
      borderColor: props != null ? props?.customBorder : '#FFF'
    },
    addressTextContainer: {
      display: 'flex',
      flexDirection: 'row'
    },
    addressTick: {
      width: '10%',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginRight: scale(5)
    },
    overlay: {
      backgroundColor:
        props != null ? props?.backgroundColor2 : 'rgba(0, 0, 0, 0.5)'
    },
    handle: {
      width: scale(150),
      backgroundColor: props != null ? props?.backgroundColor : 'transparent'
    },
    relative: {
      position: 'relative'
    },
    placeHolderContainer: {
      backgroundColor: props != null ? props?.cartContainer : '#B8B8B8',
      borderRadius: scale(3),
      elevation: scale(3),
      marginBottom: scale(12),
      padding: scale(12)
    },
    height200: {
      height: scale(200)
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props?.gray : '#B8B8B8'
    },
    emptyViewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    emptyViewBox: {
      backgroundColor: props !== null ? props?.color8 : '#000',
      borderRadius: scale(10),
      width: '85%',
      height: verticalScale(130),
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(15),
      marginTop: scale(30)
    },
    homeIcon: {
      color: props !== null ? props?.darkBgFont : '#000',
      width: '15%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    titleAddress: {
      width: '55%',
      justifyContent: 'center'
    },
    labelStyle: {
      textAlignVertical: 'bottom',
      fontSize: scale(14),
      fontWeight: '700',
      textAlign: 'left'
    },
    addressDetail: {
      alignSelf: 'flex-end',
      fontSize: scale(4),
      fontWeight: '300',
      textAlign: 'justify',
      paddingLeft: scale(38)
    },
    collectionCard: {
      backgroundColor: props !== null ? props?.cardBackground : '#181818',
      height: 135,
      width: 100,
      borderRadius: 8,
      shadowColor: props !== null ? props?.iconColor : 'gray',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    collectionImage: {
      height: 80,
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8
    },
    header: {
      
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.MTsmall,
      
    },
    seeAllBtn: {
      backgroundColor: props != null ? props?.newButtonBackground : '#F3FFEE',
      borderRadius: 4,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
    },
    modalContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 16,
      ...alignment.Pmedium
    },
    closeBtn: {
      marginLeft: 'auto'
    },
    collectionContainer: {
      flexGrow: 1,
      gap: 8,
      // ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    all:
    {
      padding:3,
      backgroundColor:"red"
    },
    brandImgContainer:
    {
      overflow:"scroll",
    }
  })
export default styles
