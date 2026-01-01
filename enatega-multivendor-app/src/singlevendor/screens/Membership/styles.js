import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: currentTheme?.themeBackground
    },
    backButton: {
      width: scale(40),
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    backButtonCircle: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: currentTheme?.colorBgTertiary || currentTheme?.cardBackground || '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    headerRight: {
      width: scale(40)
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(20)
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: verticalScale(40)
    },
    logo: {
      width: scale(150),
      height: scale(60),
      marginBottom: verticalScale(14)
    },
    subtitle: {
      fontSize: scale(12)
    },
    plansContainer: {
      marginBottom: verticalScale(0)
    },
    planCard: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: scale(12),
      padding: scale(20),
      marginBottom: verticalScale(16),
      borderWidth: 1,
      borderColor: currentTheme?.gray200 || '#E0E0E0',
      position: 'relative'
    },
    planCardSelected: {
      borderColor: currentTheme?.colorTextPrimary || '#006189',
      backgroundColor: currentTheme?.colorBgSecondary || '#CCE9F5'
    },
    popularBadge: {
      position: 'absolute',
      top: -12,
      right: scale(20),
      backgroundColor: currentTheme?.singlevendorcolor || '#0090CD',
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(6),
      borderRadius: scale(8)
    },
    popularText: {
      fontSize: scale(12)
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    planTitleContainer: {
      flex: 1
    },
    planTitle: {
      fontSize: scale(18),
      marginBottom: verticalScale(8)
    },
    planBilling: {
      fontSize: scale(14)
    },
    planPriceContainer: {
      alignItems: 'flex-end'
    },
    planPrice: {
      fontSize: scale(14),
      lineHeight: scale(25),
      marginBottom: verticalScale(4)
    },
    planPeriod: {
      fontSize: scale(14)
    },
    faqContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: verticalScale(20)
    },
    faqText: {
      fontSize: scale(14)
    },
    faqLink: {
      fontSize: scale(14),
      textDecorationLine: 'underline'
    },
    bottomSection: {
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(24),
      paddingTop: verticalScale(12),
      backgroundColor: currentTheme?.themeBackground,
      // borderTopWidth: 1,
      // borderTopColor: currentTheme?.horizontalLine || '#E0E0E0'
    },
    subscribeButton: {
      width: '100%',
      backgroundColor: currentTheme?.singlevendorcolor || '#0090CD',
      borderRadius: scale(8),
      paddingVertical: verticalScale(10),
      alignItems: 'center',
      justifyContent: 'center'
    },
    subscribeButtonText: {
      fontSize: scale(16)
    }
  })

export default styles
