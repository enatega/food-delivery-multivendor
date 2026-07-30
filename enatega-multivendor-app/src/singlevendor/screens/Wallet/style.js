import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props?.themeBackground || '#FFFFFF'
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      paddingBottom: verticalScale(24)
    },
    titleContainer: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(24)
    },
    walletTitle: {
      fontSize: scale(28),
      fontWeight: '800',
      lineHeight: scale(34),
      marginBottom: verticalScale(12)
    },
    walletDescription: {
      fontWeight: '500',
      fontSize: scale(14),
      lineHeight: scale(20),
      marginTop: verticalScale(4)
    },
    balanceCard: {
      backgroundColor: props?.colorBgTertiary ,
      borderWidth: 1,
      borderColor: props?.newBorderColor2 ,
      marginHorizontal: scale(16),
      marginBottom: verticalScale(24),
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(24),
      borderRadius: scale(12),
      // shadowColor: props?.shadowColor || '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 2
      // },
      // shadowOpacity: 0.1,
      // shadowRadius: 8,
      // elevation: 0.1
    },
    balanceLabel: {
      fontSize: scale(14),
      lineHeight: scale(20),
      marginBottom: verticalScale(8)
    },
    balanceAmount: {
      fontSize: scale(32),
      fontWeight: '700',
      lineHeight: scale(40),
      marginBottom: verticalScale(20)
    },
    freeDeliveriesCard: {
      paddingVertical: verticalScale(14),
      marginBottom: verticalScale(16)
    },
    freeDeliveriesAmount: {
      fontSize: scale(22),
      lineHeight: scale(28),
      marginBottom: 0
    },
    buttonContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      // paddingLeft: scale(12),
      // backgroundColor: 'red'
    },
    buttonDecorator: {
      position: 'absolute',
      left: 0,
      alignItems: 'center',
      zIndex: 1
    },
    buttonDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: props?.primaryBlue || props?.primary || '#0EA5E9',
      marginBottom: verticalScale(2)
    },
    buttonLine: {
      width: scale(1),
      height: verticalScale(20),
      backgroundColor: props?.primaryBlue || props?.primary || '#0EA5E9',
      opacity: 0.3
    },
    browseButton: {
      backgroundColor: props?.singlevendorcolor ,
      paddingVertical: verticalScale(10),
      borderRadius: scale(8),
      alignSelf: 'flex-start',  
    },
    browseButtonText: {
      fontSize: scale(16),
      fontWeight: '500',
      lineHeight: scale(22),
      paddingHorizontal: scale(12),
    },
    refundHistoryContainer: {
      paddingHorizontal: scale(16)
    },
    refundHistoryTitle: {
      fontSize: scale(20),
      fontWeight: '700',
      lineHeight: scale(26),
      marginBottom: verticalScale(16)
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: verticalScale(16),
      gap: scale(8)
    },
    filterButton: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(8),
      borderRadius: scale(8),
      backgroundColor: props?.colorBgTertiary || props?.gray100 || '#F3F4F6',
      minWidth: scale(80)
    },
    filterButtonActive: {
      backgroundColor: props?.lowOpacityBlue || 'rgba(14, 165, 233, 0.2)'
    },
    filterButtonText: {
      fontSize: scale(14),
      fontWeight: '600',
      lineHeight: scale(20),
      textAlign: 'center'
    },
    listContainer: {
      minHeight: scale(200)
    },
    historyContainer: {
      paddingHorizontal: scale(16),
      marginBottom: verticalScale(24)
    },
    historyTitle: {
      fontSize: scale(18),
      fontWeight: '700',
      lineHeight: scale(24),
      marginBottom: verticalScale(12)
    },
    historyEmpty: {
      fontSize: scale(14),
      lineHeight: scale(20)
    },
    historyList: {
      gap: verticalScale(10)
    },
    historyItem: {
      backgroundColor: props?.cardBackground || '#fff',
      borderWidth: 1,
      borderColor: props?.newBorderColor2 || '#E4E4E7',
      borderRadius: scale(10),
      paddingHorizontal: scale(14),
      paddingVertical: verticalScale(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    historyLeft: {
      flex: 1,
      marginRight: scale(12)
    },
    historyAmount: {
      fontSize: scale(16),
      lineHeight: scale(22),
      marginBottom: verticalScale(4)
    },
    historyMeta: {
      fontSize: scale(12),
      lineHeight: scale(16)
    },
    historyRight: {
      alignItems: 'flex-end',
      gap: verticalScale(6)
    },
    historyBadge: {
      backgroundColor: props?.primaryBlue || props?.primary || '#0EA5E9',
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(4),
      borderRadius: scale(6)
    },
    historyDate: {
      fontSize: scale(11),
      lineHeight: scale(14)
    }
  })

export default styles
