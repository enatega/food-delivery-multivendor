import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#F5F5F5'
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: verticalScale(24)
    },
    contentContainer: {
      paddingHorizontal: scale(20)
    },
    inputContainer: {
      marginBottom: verticalScale(24)
    },
    inputLabel: {
      marginBottom: verticalScale(8)
    },
    textInput: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderWidth: 1,
      borderColor: currentTheme?.gray200 || '#E5E5E5',
      borderRadius: 8,
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
      fontSize: scale(16),
      color: currentTheme?.fontMainColor || '#000000'
    },
    errorText: {
      marginTop: verticalScale(4),
      fontSize: scale(12)
    },
    footer: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(16),
      // backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      // borderTopWidth: 1,
      borderTopColor: currentTheme?.horizontalLine || '#E5E5E5'
    },
    updateButton: {
      backgroundColor: currentTheme?.singlevendorcolor || currentTheme?.main || '#0EA5E9',
      borderRadius: 8,
      paddingVertical: verticalScale(10),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: verticalScale(24)
    },
    updateButtonDisabled: {
      backgroundColor: currentTheme?.gray200 || currentTheme?.horizontalLine || '#E5E5E5',
      opacity: 0.6
    }
  })

export default styles
