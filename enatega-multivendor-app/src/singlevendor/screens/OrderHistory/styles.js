import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#F9FAFB'
    },
    tabsWrapper: {
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(12),
      paddingBottom: verticalScale(8)
    },
    tabsRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    tabsPill: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: props?.colorBgSecondary || '#EEF2F6',
      borderRadius: scale(20),
      padding: scale(4),
      borderWidth: 1,
      borderColor: props?.colorBorder || 'rgba(0,0,0,0.06)'
    },
    tabsItemWrapper: {
      flex: 1
    },
    tabsItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: verticalScale(8),
      borderRadius: scale(16)
    },
    tabsItemActive: {
      backgroundColor: props?.colorBgPrimary || props?.cardColor || '#FFFFFF',
      borderWidth: 1,
      borderColor: props?.main || props?.primary || '#0EA5E9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2
    },
    tabsItemText: {
      fontSize: scale(13),
      fontWeight: '600'
    },
    sortButton: {
      marginLeft: scale(10),
      paddingHorizontal: scale(12),
      paddingVertical: verticalScale(8),
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: props?.colorBorder || 'rgba(0,0,0,0.08)',
      backgroundColor: props?.colorBgPrimary || props?.cardColor || '#FFFFFF'
    },
    sortButtonActive: {
      borderColor: props?.main || props?.primary || '#0EA5E9',
      backgroundColor: props?.colorBgSecondary || '#EEF2F6'
    },
    sortButtonText: {
      fontSize: scale(12),
      fontWeight: '600'
    },
    tabContent: {
      flex: 1
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
