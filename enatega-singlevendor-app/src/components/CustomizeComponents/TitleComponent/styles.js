import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      marginBottom: scale(8),
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(12)
    },
    textContainer: {
      flex: 1,
      minWidth: 0
    },
    rightContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(9),
      minHeight: scale(26),
      backgroundColor: props?.colors?.surfaceSubtle ?? '#F3F4F6',
      borderRadius: props?.radii?.round ?? scale(999),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle ?? '#E5E7EB',
      flexShrink: 0
    },
    errorContainer: {
      backgroundColor: props?.isDark ? 'rgba(248, 113, 113, 0.12)' : 'rgba(220, 38, 38, 0.08)'
    }
  })
export default styles
