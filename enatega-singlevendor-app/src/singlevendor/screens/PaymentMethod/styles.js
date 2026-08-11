import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

export const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
    },
    scrollView: {
      flex: 1
    },
    content: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(8)
    },
    title: {
      fontSize: scale(24),
      fontWeight: '800',
      color: currentTheme?.fontMainColor || '#000',
      marginBottom: verticalScale(8)
    },
    subtitle: {
      fontSize: scale(14),
      color: currentTheme?.colorTextMuted || '#6B7280',
      marginBottom: verticalScale(24),
      lineHeight: scale(20),
    },
    paymentMethodsList: {
      marginBottom: verticalScale(20)
    },
    paymentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      paddingVertical: verticalScale(12),
      // paddingHorizontal: scale(16),
      borderRadius: 12,
    //   marginBottom: verticalScale(12),
    //   borderWidth: 1,
      borderColor: currentTheme?.newBorderColor || '#F3F4F6'
    },
    lastCard: {
      marginBottom: verticalScale(100)
    },
    cardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    iconContainer: {
      width: scale(48),
      height: scale(32),
      borderRadius: 6,
      borderWidth: 1,
      borderColor: currentTheme?.borderLight || '#E5E5E5',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF'
    },
    visaText: {
      fontSize: scale(12),
      fontWeight: '700',
      color: '#1434CB',
      letterSpacing: 1
    },
    mastercardContainer: {
      width: scale(48),
      height: scale(32),
      borderRadius: 6,
      borderWidth: 1,
      borderColor: currentTheme?.borderLight || '#E5E5E5',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      position: 'relative'
    },
    mastercardCircle: {
      width: scale(16),
      height: scale(16),
      borderRadius: scale(8),
      position: 'absolute'
    },
    mastercardCircleRight: {
      left: scale(8)
    },
    applePayContainer: {
      width: scale(48),
      height: scale(32),
      borderRadius: 6,
      borderWidth: 1,
      borderColor: currentTheme?.borderLight || '#E5E5E5',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF'
    },
    applePayText: {
      fontSize: scale(14),
      fontWeight: '500',
      color: '#000',
      marginLeft: scale(2)
    },
    cardInfo: {
      marginLeft: scale(12),
      flex: 1
    },
    cardNumberRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    cardNumber: {
      fontSize: scale(15),
      // fontWeight: '500',
      color: currentTheme?.fontMainColor || '#000',
      marginRight: scale(8)
    },
    defaultBadge: {
      backgroundColor: currentTheme?.colorBgSecondary || 'rgba(14, 165, 233, 0.2)',
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(6),
      borderRadius: 8
    },
    defaultText: {
      fontSize: scale(14),
      // fontWeight: '500',
      color: currentTheme?.headerMainFontColor 
    },
    cardRight: {
      marginLeft: scale(12)
    },
    menuButton: {
      padding: scale(4)
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: currentTheme?.newBorderColor || '#F3F4F6'
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme?.colorBgSecondary || 'rgba(14, 165, 233, 0.2)',
      paddingVertical: verticalScale(14),
      borderRadius: 12
    },
    addButtonText: {
      fontSize: scale(16),
      fontWeight: '500',
      color: currentTheme?.headerMainFontColor || '#0EA5E9',
      marginLeft: scale(8)
    }
  })
