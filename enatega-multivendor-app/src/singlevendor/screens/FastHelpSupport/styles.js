import { StyleSheet } from 'react-native'
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
    sectionHeaderContainer: {
      fontWeight:'800',
      
      // backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    sectionHeaderText: {
      fontWeight:'800',
      
      
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(14),
      paddingHorizontal: scale(16),
      backgroundColor: props?.cardBackground || '#FFFFFF'
    },
    itemTitle: {
      fontSize: scale(15),
      flex: 1
    },
    separator: {
      height: 1,
      backgroundColor: props?.horizontalLine || '#E5E5E5',
      opacity: 0.5,
      marginLeft: scale(16)
    }
  })

export default styles
