import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    listContent: {
      paddingTop: verticalScale(8),
      paddingBottom: verticalScale(24)
    },
    sectionHeader: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
      paddingBottom: verticalScale(8),
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    sectionHeaderText: {
      fontSize: scale(16),
      fontWeight: '600',
      lineHeight: scale(20)
    }
  })

export default styles

