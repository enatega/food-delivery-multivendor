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
      paddingTop: verticalScale(20),
      paddingBottom: verticalScale(100)
    },
    title: {
      fontSize: scale(20),
      fontWeight: '700',
      color: currentTheme?.fontMainColor || '#000',
      marginBottom: verticalScale(8)
    },
    subtitle: {
      fontSize: scale(14),
      color: currentTheme?.colorTextMuted || '#6B7280',
      marginBottom: verticalScale(32),
      lineHeight: scale(20)
    },
    label: {
      fontSize: scale(14),
      fontWeight: '500',
      color: currentTheme?.fontMainColor || '#000',
      marginBottom: verticalScale(8)
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: currentTheme?.newBorderColor || '#E5E7EB',
      borderRadius: 8,
      paddingHorizontal: scale(12),
      height: verticalScale(48),
      marginBottom: verticalScale(20),
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF'
    },
    input: {
      flex: 1,
      fontSize: scale(14),
      color: currentTheme?.fontMainColor || '#000',
      height: '100%'
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: scale(16),
      paddingBottom: verticalScale(32),
      backgroundColor: currentTheme?.themeBackground || '#FFFFFF',
    },
    saveButton: {
      backgroundColor: '#F3F4F6', 
      paddingVertical: verticalScale(14),
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center'
    },
    saveButtonText: {
      fontSize: scale(16),
      fontWeight: '500', 
      color: '#9CA3AF' 
    }
  })
