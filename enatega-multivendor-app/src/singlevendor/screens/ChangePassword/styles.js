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
    }
  })

export default styles
