import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    scrollView: {
      flex: 1
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: verticalScale(24),
      paddingHorizontal: scale(16)
    },
    formContainer: {
      gap: verticalScale(20)
    },
    buttonContainer: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
      backgroundColor: props?.themeBackground || '#F9FAFB'
    },
    oauthNoticeContainer: {
      backgroundColor: props?.cardBackground || '#FFFFFF',
      borderRadius: scale(12),
      padding: scale(20),
      borderWidth: 1,
      borderColor: props?.gray200 || '#E5E5E5',
      alignItems: 'center',
      marginTop: verticalScale(20)
    },
    oauthNoticeTitle: {
      fontSize: scale(18),
      marginBottom: verticalScale(12),
      textAlign: 'center'
    },
    oauthNoticeText: {
      fontSize: scale(14),
      textAlign: 'center',
      lineHeight: scale(20)
    }
  })

export default styles
