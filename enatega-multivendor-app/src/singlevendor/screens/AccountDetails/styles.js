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
      paddingTop: verticalScale(12)
    },
    listContainer: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      marginHorizontal: scale(16),
      borderRadius: scale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: currentTheme?.colorBorder || '#E5E7EB',
      overflow: 'hidden'
    }
  })

export default styles
