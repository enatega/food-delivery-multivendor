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
      fontWeight: '700',
      lineHeight: scale(34),
      marginBottom: verticalScale(12)
    },
    walletDescription: {
      fontSize: scale(14),
      lineHeight: scale(20),
      marginTop: verticalScale(4)
    },
    balanceCard: {
      backgroundColor: props?.cardBackground || props?.themeBackground || '#FFFFFF',
      marginHorizontal: scale(16),
      marginBottom: verticalScale(24),
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(24),
      borderRadius: scale(12),
      shadowColor: props?.shadowColor || '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3
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
    buttonContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: scale(12)
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
      backgroundColor: props?.primaryBlue || props?.primary || '#0EA5E9',
      paddingHorizontal: scale(24),
      paddingVertical: verticalScale(14),
      borderRadius: scale(8),
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    browseButtonText: {
      fontSize: scale(16),
      fontWeight: '600',
      lineHeight: scale(22)
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
    }
  })

export default styles
