import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      paddingBottom: verticalScale(40)
    },
    content: {
      paddingHorizontal: scale(20)
    },
    
    // Hero Section
    heroSection: {
      alignItems: 'center',
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(32)
    },
    heroIconContainer: {
      width: scale(64),
      height: scale(64),
      borderRadius: scale(32),
      backgroundColor: currentTheme?.main ? currentTheme.main + '15' : '#90E36D15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: verticalScale(16)
    },
    pageTitle: {
      fontSize: scale(28),
      lineHeight: scale(36),
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: verticalScale(8)
    },
    pageSubtitle: {
      fontSize: scale(15),
      lineHeight: scale(22),
      textAlign: 'center',
      // opacity: 0.7
    },

    // Stats Container
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: currentTheme?.cartContainer || '#F9FAFB',
      borderRadius: scale(16),
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(12),
      marginBottom: verticalScale(32),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(6)
    },
    statDivider: {
      width: 1,
      height: scale(24),
      backgroundColor: currentTheme?.newBorderColor || '#E5E7EB',
      opacity: 0.3
    },
    statText: {
      fontSize: scale(13),
      fontWeight: '600'
    },

    // Section Header
    sectionHeader: {
      marginBottom: verticalScale(20)
    },
    sectionTitle: {
      fontSize: scale(20),
      lineHeight: scale(28),
      fontWeight: '700',
      marginBottom: verticalScale(4)
    },
    sectionSubtitle: {
      fontSize: scale(14),
      lineHeight: scale(20),
      // opacity: 0.6
    },

    // Accordion
    accordionContainer: {
      gap: verticalScale(12),
      marginBottom: verticalScale(32)
    },
    accordionCard: {
      backgroundColor: currentTheme?.cartContainer || '#FFFFFF',
      borderRadius: scale(16),
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: currentTheme?.newBorderColor || '#F3F4F6'
    },
    accordionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(18),
      paddingHorizontal: scale(16)
    },
    accordionHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: scale(12)
    },
    iconContainer: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center'
    },
    questionText: {
      fontSize: scale(15),
      lineHeight: scale(22),
      flex: 1,
      fontWeight: '600'
    },
    accordionContent: {
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(20),
      paddingTop: verticalScale(4),
      borderTopWidth: 1,
      borderTopColor: currentTheme?.newBorderColor || '#F3F4F6'
    },
    answerText: {
      fontSize: scale(14),
      lineHeight: scale(21),
      marginBottom: verticalScale(12),
      // opacity: 0.8
    },

    // Bullets
    bulletList: {
      marginTop: verticalScale(8),
      gap: verticalScale(10)
    },
    bulletItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingRight: scale(8)
    },
    bulletDot: {
      width: scale(6),
      height: scale(6),
      borderRadius: scale(3),
      backgroundColor: currentTheme?.main || '#3B82F6',
      marginTop: scale(7),
      marginRight: scale(12),
      opacity: 0.7
    },
    bulletText: {
      fontSize: scale(14),
      lineHeight: scale(21),
      flex: 1
    },

    // Contact Section
    contactSection: {
      backgroundColor: currentTheme?.cartContainer || '#F9FAFB',
      borderRadius: scale(20),
      padding: scale(24),
      marginBottom: verticalScale(24),
      borderWidth: 1,
      borderColor: currentTheme?.newBorderColor || '#F3F4F6'
    },
    contactHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      marginBottom: verticalScale(8)
    },
    contactTitle: {
      fontSize: scale(20),
      lineHeight: scale(28),
      fontWeight: '700'
    },
    contactDescription: {
      fontSize: scale(14),
      lineHeight: scale(21),
      marginBottom: verticalScale(20),
      // opacity: 0.7
    },

    // Info Card
    infoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
      borderRadius: scale(12),
      padding: scale(16),
      gap: scale(12),
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    infoIconContainer: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(10),
      alignItems: 'center',
      justifyContent: 'center'
    },
    infoCardContent: {
      flex: 1
    },
    infoCardTitle: {
      fontSize: scale(14),
      lineHeight: scale(20),
      fontWeight: '600',
      marginBottom: verticalScale(2)
    },
    infoCardDescription: {
      fontSize: scale(13),
      lineHeight: scale(18),
      // opacity: 0.7
    },

    // Footer
    footerNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: scale(8),
      paddingVertical: verticalScale(16)
    },
    footerText: {
      fontSize: scale(13),
      // opacity: 0.6
    }
  })

export default styles
