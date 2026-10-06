import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { DISCOVERY_GUTTER } from '../../../singlevendor/components/Home/discoveryLayout'

// Same anatomy as the single-vendor HomeCart card, with tighter padding and
// smaller fixed-width elements so it reads as a compact live activity.
const styles = (tokens) => {
  const { colors } = tokens
  const row = tokens.isRTL ? 'row-reverse' : 'row'
  const textAlign = tokens.isRTL ? 'right' : 'left'

  return StyleSheet.create({
    card: {
      marginTop: scale(12),
      marginBottom: scale(2),
      marginHorizontal: DISCOVERY_GUTTER,
      paddingHorizontal: scale(12),
      paddingVertical: scale(11),
      borderRadius: scale(16),
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderSubtle,
      shadowColor: '#0B1407',
      shadowOpacity: tokens.isDark ? 0 : 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: tokens.isDark ? 0 : 2,
      overflow: 'hidden'
    },
    cardPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.99 }]
    },
    topRow: {
      flexDirection: row,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statusChip: {
      flexDirection: row,
      alignItems: 'center',
      gap: scale(5),
      paddingHorizontal: scale(8),
      height: scale(20),
      borderRadius: 999,
      backgroundColor: colors.accentSubtle
    },
    statusChipText: {
      color: colors.accentForeground,
      fontSize: scale(9.5),
      letterSpacing: 0.6,
      textTransform: 'uppercase'
    },
    orderNumber: {
      color: colors.textMuted,
      fontSize: scale(11),
      fontVariant: ['tabular-nums'],
      maxWidth: '55%'
    },
    mainRow: {
      marginTop: scale(10),
      flexDirection: row,
      alignItems: 'center'
    },
    iconTile: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(12),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accentSubtle
    },
    titleWrap: {
      flex: 1,
      marginHorizontal: scale(10)
    },
    title: {
      color: colors.textPrimary,
      fontSize: scale(14),
      lineHeight: scale(18),
      letterSpacing: -0.2,
      textAlign
    },
    subtitle: {
      marginTop: scale(2),
      color: colors.textMuted,
      fontSize: scale(11.5),
      lineHeight: scale(15),
      textAlign
    },
    etaBlock: {
      minWidth: scale(44),
      paddingVertical: scale(4),
      paddingHorizontal: scale(6),
      borderRadius: scale(12),
      backgroundColor: colors.accent,
      alignItems: 'center'
    },
    etaValue: {
      color: colors.textOnAccent,
      fontSize: scale(17),
      lineHeight: scale(20),
      fontVariant: ['tabular-nums']
    },
    etaUnit: {
      color: colors.textOnAccent,
      fontSize: scale(9.5),
      lineHeight: scale(11),
      opacity: 0.8
    },
    chevron: {
      width: scale(28),
      height: scale(28),
      borderRadius: scale(14),
      backgroundColor: colors.surfaceSubtle,
      alignItems: 'center',
      justifyContent: 'center'
    },
    progressRow: {
      marginTop: scale(12),
      flexDirection: row,
      gap: scale(4)
    },
    progressSegment: {
      flex: 1,
      height: scale(4),
      borderRadius: 999,
      backgroundColor: colors.borderStandard
    },
    progressActive: {
      backgroundColor: colors.accent
    },
    footer: {
      marginTop: scale(10),
      paddingTop: scale(9),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderSubtle,
      flexDirection: row,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: scale(8)
    },
    addressWrap: {
      flex: 1,
      flexDirection: row,
      alignItems: 'center',
      gap: scale(5)
    },
    addressText: {
      flex: 1,
      color: colors.textMuted,
      fontSize: scale(11.5),
      textAlign
    },
    itemsPill: {
      flexDirection: row,
      alignItems: 'center',
      gap: scale(4),
      paddingHorizontal: scale(8),
      height: scale(20),
      borderRadius: 999,
      backgroundColor: colors.surfaceSubtle
    },
    itemsText: {
      color: colors.textPrimary,
      fontSize: scale(10.5)
    }
  })
}

export default styles
