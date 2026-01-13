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
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
    //   backgroundColor:'red'
    },
    startShoppingButton: {
      backgroundColor: props?.colorBgSecondary ,
      paddingHorizontal: scale(32),
      paddingVertical: verticalScale(14),
      borderRadius: scale(8),
      marginTop: verticalScale(32),
      minWidth: scale(300),
      alignItems: 'center',
      justifyContent: 'center'
    },
    startShoppingButtonText: {
      fontSize: scale(16),
      fontWeight: '600'
    },
    bottomIndicatorContainer: {
      alignItems: 'center',
      marginTop: verticalScale(16)
    },
    bottomIndicatorDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: props?.primary || '#007AFF',
      marginBottom: verticalScale(4)
    },
    bottomIndicatorLine: {
      width: scale(1),
      height: scale(30),
      backgroundColor: props?.primary || '#007AFF',
      opacity: 0.3
    }
  })

export default styles

