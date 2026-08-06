import { StyleSheet } from 'react-native'
import { scale, verticalScale } from '../../utils/scaling'

const styles = (tokens = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: tokens?.colors?.canvas ?? '#FFFFFF'
    },
    stickySearchBar: {
      zIndex: 2,
      paddingTop: tokens?.spacing?.sm ?? scale(8),
      paddingBottom: tokens?.spacing?.sm ?? scale(8),
      paddingHorizontal: tokens?.spacing?.sm ?? scale(8),
      backgroundColor: tokens?.colors?.canvas ?? '#FFFFFF'
    },
    contentScroll: {
      flex: 1
    },
    searchList: {
      flex: 1,
      marginBottom: scale(70),
      marginTop: tokens?.spacing?.sm ?? scale(8),
      paddingHorizontal: tokens?.spacing?.sm ?? scale(8)
    },
    recentSearchContainer: {
      marginTop: tokens?.spacing?.lg ?? scale(16),
      paddingHorizontal: tokens?.spacing?.sm ?? scale(8)
    },
    recentSectionHeader: {
      paddingHorizontal: 0,
      marginBottom: scale(15)
    },
    recentList: {
      overflow: 'hidden',
      borderRadius: tokens?.radii?.lg ?? scale(14),
      backgroundColor: tokens?.colors?.surface ?? '#FFFFFF',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    recentListBtn: {
      minHeight: scale(54),
      flexDirection: tokens?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: scale(14),
      gap: scale(10)
    },
    recentIcon: {
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens?.colors?.accentSubtle ?? 'rgba(144, 227, 109, 0.14)'
    },
    recentText: {
      flex: 1,
      fontSize: scale(14),
      lineHeight: scale(20),
      textAlign: tokens?.isRTL ? 'right' : 'left'
    },
    line: {
      height: StyleSheet.hairlineWidth,
      marginStart: scale(56),
      backgroundColor: tokens?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    tagView: {
      flexDirection: tokens?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      rowGap: scale(10),
      columnGap: scale(10),
      marginTop: tokens?.spacing?.lg ?? scale(16),
      paddingHorizontal: tokens?.spacing?.sm ?? scale(8)
    },
    tagItem: {
      minHeight: scale(40),
      maxWidth: scale(220),
      justifyContent: 'center',
      paddingVertical: scale(9),
      paddingHorizontal: scale(14),
      borderRadius: tokens?.radii?.round ?? scale(999),
      backgroundColor: tokens?.colors?.accentSubtle ?? 'rgba(144, 227, 109, 0.14)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    emptyViewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: tokens?.spacing?.sm ?? scale(8)
    },
    emptyViewBox: {
      width: '100%',
      minHeight: verticalScale(120),
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(16),
      marginTop: scale(20),
      borderRadius: tokens?.radii?.lg ?? scale(14),
      backgroundColor: tokens?.colors?.surface ?? '#FFFFFF',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    }
  })

export default styles
