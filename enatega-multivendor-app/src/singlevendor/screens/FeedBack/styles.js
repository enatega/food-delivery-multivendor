import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
    },
    keyboardView: {
      flex: 1
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      paddingBottom: verticalScale(16),
      flex: 1,
    },
    content: {
      justifyContent: 'center',
      flex: 1,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(32),
    },
    questionText: {
      fontSize: scale(20),
      marginBottom: verticalScale(24),
      textAlign: 'center'
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: verticalScale(16),
      gap: scale(12)
    },
    starWrapper: {
      width: scale(48),
      height: scale(48),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ scale: 2 }]
    },
    helperText: {
      fontSize: scale(14),
      textAlign: 'center',
      marginBottom: verticalScale(32),
      color: currentTheme?.CharcoalBlack 
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: currentTheme?.borderColor || '#E5E5E5',
      borderRadius: scale(12),
      minHeight: verticalScale(150),
      marginBottom: verticalScale(16),
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF'
    },
    textInput: {
      fontSize: scale(15),
      color: currentTheme?.fontMainColor || '#000000',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
      minHeight: verticalScale(150),
      textAlignVertical: 'top'
    },
    buttonContainer: {
      paddingHorizontal: scale(16),
      paddingBottom: verticalScale(16),
      paddingTop: verticalScale(8),
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
      borderTopColor: currentTheme?.horizontalLine || '#E5E5E5'
    },
    submitButton: {
      backgroundColor: currentTheme?.singlevendorcolor,
      borderRadius: scale(12),
      paddingVertical: verticalScale(10),
      alignItems: 'center',
      justifyContent: 'center'
    },
    submitButtonDisabled: {
      backgroundColor: currentTheme?.colorBgTertiary ,
      borderWidth: 1,
      borderColor: currentTheme?.borderColor || '#E5E5E5'
    },
    submitButtonText: {
      fontSize: scale(14),
      fontWeight: '500'
    }
  })

export default styles
