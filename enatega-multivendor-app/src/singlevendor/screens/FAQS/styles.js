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
      paddingBottom: verticalScale(24)
    },
    content: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16)
    },
    lastUpdated: {
      fontSize: scale(14),
      marginBottom: verticalScale(16),
      opacity: 0.6,
      fontWeight: '500'
    },
    introText: {
      fontSize: scale(15),
      lineHeight: scale(22),
      marginBottom: verticalScale(24),
      fontWeight: '500',
      color: currentTheme?.colorTextMuted,
    },
    section: {
      marginBottom: verticalScale(32)
    },
    sectionHeader: {
      fontSize: scale(18),
      marginBottom: verticalScale(12),
      lineHeight: scale(24),
      fontWeight: '800'
    },
    sectionTitle: {
      fontSize: scale(18),
      marginBottom: verticalScale(12),
      lineHeight: scale(24),
      fontWeight: '600'
    },
    sectionIntro: {
      fontSize: scale(15),
      lineHeight: scale(22),
      marginBottom: verticalScale(12),
      color: currentTheme?.colorTextMuted,
    },
    sectionParagraph: {
      fontSize: scale(15),
      lineHeight: scale(22),
      color: currentTheme?.colorTextMuted,
    },
    bulletList: {
      // marginTop: verticalScale(8)
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: verticalScale(8),
      paddingRight: scale(8)
    },
    bullet: {
      fontSize: scale(15),
      lineHeight: scale(22),
      marginRight: scale(4),
      color: currentTheme?.colorTextMuted,
    },
    bulletText: {
      fontSize: scale(15),
      lineHeight: scale(22),
      flex: 1,
      color: currentTheme?.colorTextMuted,
    },
    contactInfo: {
      flexDirection: 'row',
      marginTop: verticalScale(8),
      alignItems: 'center'
    },
    contactText: {
      fontSize: scale(15),
      lineHeight: scale(22),
      color: currentTheme?.colorTextMuted,
    }
  })

export default styles
