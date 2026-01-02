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
    headerTitle: {
      fontSize: scale(18),
      flex: 1,
      textAlign: 'center'
    },
    headerRight: {
      width: scale(40)
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: scale(12),
      justifyContent: 'center',
      alignItems: 'center'
    },
    illustrationContainer: {
      marginBottom: verticalScale(10),
      alignItems: 'center'
    },
    illustration: {
      width: scale(200),
      height: scale(200)
    },
    title: {
      fontSize: scale(20),
      marginBottom: verticalScale(16),
      textAlign: 'center'
    },
    description: {
      fontSize: scale(12),
      lineHeight: scale(18),
      marginBottom: verticalScale(20),
      paddingHorizontal: scale(12),
      textAlign: 'center'
    },
    codeContainer: {
      width: '100%',
      marginBottom: verticalScale(12),
      marginTop: verticalScale(120)
    },
    codeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme?.colorBgSecondary,
      borderRadius: scale(6),
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(20),
    },
    codeIcon: {
      marginRight: scale(8)
    },
    codeText: {
      fontSize: scale(12),
      letterSpacing: scale(2)

    },
    primaryButton: {
      width: '100%',
      backgroundColor: '#CCE9F5',
      borderRadius: scale(6),
      paddingVertical: verticalScale(12),
      alignItems: 'center',
      justifyContent: 'center'
    },
    shareButton: {
      width: '100%',
      backgroundColor: '#0090CD',
      borderRadius: scale(6),
      paddingVertical: verticalScale(12),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },
    shareIcon: {
      marginRight: scale(8)
    },
    buttonText: {
      fontSize: scale(12)
    }
  })

export default styles
