import { StyleSheet } from 'react-native'
import { fontStyles } from '../../../utils/fontStyles'
import { scale, verticalScale } from '../../../utils/scaling'

const styles = (tokens = null) =>
  StyleSheet.create({
    bodyStyleOne: {
      flex: 1,
      minHeight: verticalScale(44),
      fontFamily: fontStyles.MuseoSans500,
      fontSize: scale(15),
      color: tokens?.colors?.textPrimary ?? '#18181B'
    },
    mainContainerHolder: {
      width: '100%',
      backgroundColor: 'transparent'
    },
    mainContainer: {
      width: '100%',
      minHeight: verticalScale(48),
      justifyContent: 'center',
      borderRadius: tokens?.radii?.round ?? scale(999),
      backgroundColor: tokens?.colors?.surfaceElevated ?? '#F7F7F8',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens?.colors?.borderSubtle ?? 'rgba(24, 24, 27, 0.10)'
    },
    subContainer: {
      minHeight: verticalScale(48),
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: tokens?.isRTL ? 'row-reverse' : 'row',
      paddingHorizontal: scale(14)
    },
    leftContainer: {
      flex: 1,
      minWidth: 0,
      flexDirection: tokens?.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(10),
      overflow: 'hidden'
    },
    searchContainer: {
      width: scale(22),
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputContainer: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center'
    },
    filterContainer: {
      width: scale(32),
      minHeight: verticalScale(44),
      justifyContent: 'center',
      alignItems: 'center'
    }
  })

export default styles
