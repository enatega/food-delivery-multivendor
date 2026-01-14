import { StyleSheet } from 'react-native'
import { verticalScale } from '../../../utils/scaling'

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
      paddingTop: verticalScale(16)
    },
    listContainer: {
      backgroundColor: currentTheme?.cardBackground || '#FFFFFF',
      borderRadius: 12,
      overflow: 'hidden'
    }
  })

export default styles
