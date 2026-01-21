import { StyleSheet } from 'react-native'
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
    onBoardingContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: insets?.top + scale(16),
      paddingBottom: insets?.bottom + scale(16),
      paddingHorizontal: scale(16),
      height: '100%'
    }
  })

export default styles
