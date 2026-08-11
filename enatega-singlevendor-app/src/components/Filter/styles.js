import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      maxHeight: '100%'
    },
    contentContainer: {
      paddingTop: scale(18),
      paddingBottom: scale(12)
    },
    headerRow: {
      flexDirection: props?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(14),
      marginBottom: scale(12)
    },
    filterSection: {
      paddingTop: scale(10)
    },
    sectionTitle: {
      paddingHorizontal: scale(14),
      marginBottom: scale(10)
    },
    flatlist: {
      alignSelf: 'flex-start',
      flexGrow: 1,
      gap: scale(8),
      paddingHorizontal: scale(14),
      paddingBottom: scale(14)
    },
    filterBtn: {
      minHeight: scale(36),
      paddingHorizontal: scale(14),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(18),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle,
      backgroundColor: props?.colors?.surfaceSubtle
    },
    filterBtnSelected: {
      borderColor: props?.colors?.accent,
      backgroundColor: props?.colors?.accentSubtle
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      marginHorizontal: scale(14),
      backgroundColor: props?.colors?.borderSubtle
    },
    actions: {
      paddingHorizontal: scale(14),
      paddingTop: scale(14),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: props?.colors?.borderSubtle,
      gap: scale(8)
    },
    applyBtn: {
      minHeight: scale(50),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: props?.colors?.accent ?? props?.main ?? '#90E36D',
      borderRadius: scale(14)
    },
    clearBtn: {
      alignSelf: props?.isRTL ? 'flex-start' : 'flex-end',
      minHeight: scale(32),
      justifyContent: 'center',
      paddingHorizontal: scale(4)
    },
    closeBtn: {
      width: scale(34),
      height: scale(34),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: scale(17),
      backgroundColor: props?.colors?.surfaceSubtle,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props?.colors?.borderSubtle
    }

  })
export default styles
