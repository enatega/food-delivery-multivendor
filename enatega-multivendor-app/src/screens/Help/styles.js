import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale, verticalScale } from '../../utils/scaling'
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props?.themeBackground : 'transparent'
    },
    backButton: {
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    mainContainer: {
      ...alignment.Msmall,
      marginTop: scale(5),
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      gap: scale(10)
    },
    listContent: {
      paddingBottom: scale(24)
    },
    itemContainer: {
      margin: scale(4),
      borderWidth: 1,
      borderColor: props !== null ? props?.gray200 : '#E5E7EB',
      borderRadius: scale(8),
      backgroundColor: props !== null ? props?.gray100 : '#F3F4F6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLlarge,
      ...alignment.PRlarge
    },
    backImageContainer: {
      backgroundColor: props !== null ? props?.white : 'white',
      borderRadius: scale(50),
      width: scale(40),
      alignItems: 'flex-start',
      marginLeft: scale(5)
    },
    topContainer: {
      marginLeft: scale(10),
      marginTop: scale(10)
    },
    containerButton: {
      backgroundColor: props !== null ? props?.themeBackground : 'transparent',
      width: '90%',
      height: scale(40),
      bottom: verticalScale(0),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
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
    whatsAppText: {
      textAlign: 'center',
      // paddingLeft: scale(5),
    },
    contentContainer: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: scale(10)
    },
    faqAnswer: {
      lineHeight: scale(18)
    },
    footerSection: {
      marginTop: scale(18),
      paddingBottom: scale(12)
    },
    supportCard: {
      backgroundColor: props !== null ? props?.cardBackground : '#fff',
      borderRadius: scale(18),
      padding: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props?.borderLight : '#D9D9D9'
    },
    supportSubText: {
      marginTop: scale(8),
      lineHeight: scale(18)
    },
    supportButton: {
      marginTop: scale(14),
      minHeight: scale(44),
      borderRadius: scale(22),
      backgroundColor: props !== null ? props?.primary : '#90E36D',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(16)
    },
    supportButtonText: {
      marginLeft: scale(8)
    },
    ticketSection: {
      marginTop: scale(18)
    },
    ticketSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scale(10)
    },
    ticketCard: {
      backgroundColor: props !== null ? props?.cardBackground : '#fff',
      borderRadius: scale(16),
      padding: scale(14),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props?.borderLight : '#D9D9D9',
      marginBottom: scale(10)
    },
    ticketTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: scale(10)
    },
    ticketTitle: {
      flex: 1,
      paddingRight: scale(8)
    },
    statusBadge: {
      paddingHorizontal: scale(10),
      paddingVertical: scale(5),
      borderRadius: scale(999)
    },
    ticketDescription: {
      marginTop: scale(8),
      lineHeight: scale(17)
    },
    ticketMetaRow: {
      marginTop: scale(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    emptyTicketState: {
      paddingVertical: scale(18),
      paddingHorizontal: scale(16),
      borderRadius: scale(16),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props !== null ? props?.borderLight : '#D9D9D9',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.gray100 : '#F3F4F6'
    },
    emptyTicketTitle: {
      marginTop: scale(10),
      marginBottom: scale(6),
      textAlign: 'center'
    },
    emptyTicketDescription: {
      lineHeight: scale(18)
    }
  })
export default styles
