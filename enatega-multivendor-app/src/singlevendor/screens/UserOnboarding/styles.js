import { Platform, StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (currentTheme, insets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.colorBgSecondary || '#CCE9F5',
      height: '100%'
    },
    scrollView: {
      flex: 1
    },
    contentContainer: {
      flexGrow: 1
    },
    onBoardingContainer: {
      display: 'flex',

      paddingTop: Platform.OS === 'android' ? insets?.top + scale(16) : 0,
      paddingBottom: insets?.bottom + scale(16),
      paddingHorizontal: scale(16),
      height: '100%'
    },
    imageSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

export default styles
