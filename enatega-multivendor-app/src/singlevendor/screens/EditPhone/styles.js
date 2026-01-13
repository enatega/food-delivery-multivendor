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
      marginBottom: verticalScale(16)
    },
    inputLabel: {
      marginBottom: verticalScale(8)
    },
    phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderWidth: 1,
      borderColor: currentTheme?.gray200 || '#E5E5E5',
      borderRadius: 8,
      padding: 0
    },
    errorInput: {
      borderColor: currentTheme?.red600 || '#DC2626'
    },
    countryCodeContainer: {
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(14),
      borderRightWidth: 1,
      borderRightColor: currentTheme?.gray200 || '#E5E5E5'
    },
    countryCodeInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(4)
    },
    countryCodeText: {
      minWidth: scale(40)
    },
    phoneField: {
      flex: 1,
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(14),
      fontSize: scale(14),
      color: currentTheme?.fontMainColor || '#000000'
    },
    errorText: {
      marginTop: verticalScale(4),
      fontSize: scale(12)
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      padding: scale(12),
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentTheme?.gray200 || '#E5E5E5',
      marginTop: verticalScale(8)
    },
    infoText: {
      flex: 1,
      marginLeft: scale(8),
      fontSize: scale(13),
      lineHeight: scale(18)
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
      paddingVertical: verticalScale(14),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: verticalScale(50)
    },
    updateButtonDisabled: {
      backgroundColor: currentTheme?.gray200 || currentTheme?.horizontalLine || '#E5E5E5',
      opacity: 0.6
    }
  })

export default styles
