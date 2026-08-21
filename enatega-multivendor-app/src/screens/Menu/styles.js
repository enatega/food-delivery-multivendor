import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'

import { alignment } from '../../utils/alignment'
import { subtleCardShadow } from '../../utils/cardShadows'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    floatingCart: {
      position: 'absolute',
      bottom: scale(16),
      width: scale(54),
      height: scale(54),
      borderRadius: scale(27),
      backgroundColor: props?.main,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4
    },
    cartBadge: {
      position: 'absolute',
      top: -scale(4),
      right: -scale(4),
      minWidth: scale(20),
      height: scale(20),
      paddingHorizontal: scale(4),
      borderRadius: scale(10),
      backgroundColor: props?.black,
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: { flex: 1, gap: 8, backgroundColor: props != null ? props?.themeBackground : '#FFF' },
    screenBackground: {
      backgroundColor: props != null ? props?.themeBackground : '#FFF',
      ...alignment.PBlarge
    },
    searchbar: {
      ...alignment.PBmedium,
      backgroundColor: props != null ? props?.white : '#FFF'
    },

    mainContentContainer: {
      width: '100%',
      height: '80%',
      alignSelf: 'center'
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
      backgroundColor: props?.colors?.surface ?? props?.cardBackground ?? '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      position: 'relative',
      zIndex: 9999999,
      shadowOpacity: 0,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? props?.customBorder
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
      width: scale(36),
      height: scale(4),
      borderRadius: scale(2),
      backgroundColor: props?.colors?.borderStandard ?? props?.backgroundColor
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
      backgroundColor: props !== null ? props?.cardBackground : '#000',
      borderRadius: scale(16),
      width: '85%',
      minHeight: verticalScale(150),
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(15),
      marginTop: scale(30),
      borderWidth: 1,
      borderColor: props?.newBorderColor || '#E5E7EB',
      ...subtleCardShadow
    },
    emptyBadge: {
      paddingVertical: scale(6),
      paddingHorizontal: scale(12),
      borderRadius: scale(999),
      backgroundColor: props?.newButtonBackground || '#EEF5FA',
      marginBottom: scale(12)
    },
    emptyTitle: {
      marginBottom: scale(8)
    },
    emptyDescription: {
      opacity: 0.8
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
    menuHeader: {
      paddingTop: scale(12)
    },
    menuSectionHeader: {
      paddingHorizontal: 0,
      marginBottom: scale(15)
    },
    collectionRail: {
      marginHorizontal: -(props?.spacing?.md ?? scale(12))
    },
    collectionSeparator: {
      width: props?.spacing?.lg ?? scale(16)
    },
    restaurantSectionHeader: {
      paddingHorizontal: 0,
      marginTop: scale(20),
      marginBottom: scale(15)
    },
    restaurantSeparator: {
      height: props?.spacing?.lg ?? scale(16)
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
      paddingHorizontal: props?.spacing?.md ?? scale(12),
      paddingBottom: props?.spacing?.sm ?? scale(8)
    }
  })
export default styles
