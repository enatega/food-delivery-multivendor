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
      paddingBottom: verticalScale(20)
    }
  })

export default styles
