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
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(24)
    },
    menuContainer: {
      backgroundColor: props?.cardBackground || '#FFFFFF',
      borderRadius: scale(12),
      marginHorizontal: scale(16),
      overflow: 'hidden'
    },
    separator: {
      height: 1,
      backgroundColor: props?.horizontalLine || '#E5E5E5',
      opacity: 0.5
    }
  })

export default styles
