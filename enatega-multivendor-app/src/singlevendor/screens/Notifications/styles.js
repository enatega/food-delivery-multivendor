import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'

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
      fontSize: scale(18),
      fontWeight: '600',
      lineHeight: scale(20)
    },
    paginationRow: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      alignItems: 'center'
    },
    showMoreButton: {
      // backgroundColor: 'transparent'
      backgroundColor: theme?.Dark?.primaryBlue,
      borderRadius: scale(8),
      paddingVertical: verticalScale(6),
      paddingHorizontal: scale(16),
    },
    showMoreText: {
      fontSize: scale(14),
      fontWeight: '600'
    },
    endMessageText: {
      fontSize: scale(12),
      opacity: 0.7
    }
  })

export default styles

