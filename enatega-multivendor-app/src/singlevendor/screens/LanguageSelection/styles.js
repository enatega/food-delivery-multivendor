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
      paddingTop: verticalScale(8)
    },
    listContainer: {
      paddingHorizontal: scale(16)
    }
  })

export default styles
