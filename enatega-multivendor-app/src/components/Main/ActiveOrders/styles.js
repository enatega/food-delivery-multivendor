import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'

const styles = (tokens) =>
  StyleSheet.create({
    card: {
      marginTop: 0,
      marginHorizontal: tokens.spacing.xl,
      marginBottom: scale(10),
      padding: tokens.spacing.lg,
      borderRadius: tokens.radii.xl,
      backgroundColor: tokens.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: tokens.colors.borderSubtle
    },
    headerRow: {
      flexDirection: tokens.isRTL ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    },
    titleWrap: {
      flex: 1,
      paddingEnd: tokens.spacing.md
    },
    title: {
      color: tokens.colors.textPrimary,
      fontSize: scale(17),
      lineHeight: scale(22),
      textAlign: tokens.isRTL ? 'right' : 'left'
    },
    subtitle: {
      marginTop: tokens.spacing.xs,
      color: tokens.colors.textMuted,
      fontSize: scale(12),
      lineHeight: scale(17),
      textAlign: tokens.isRTL ? 'right' : 'left'
    },
    statusIcon: {
      width: scale(44),
      height: scale(44),
      borderRadius: scale(22),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.accentSubtle
    },
    progressRow: {
      flexDirection: tokens.isRTL ? 'row-reverse' : 'row',
      marginTop: tokens.spacing.lg
    },
    progressSegment: {
      flex: 1,
      height: scale(4),
      borderRadius: tokens.radii.round,
      backgroundColor: tokens.colors.borderStandard
    },
    progressSpacing: {
      marginEnd: tokens.spacing.sm
    },
    progressActive: {
      backgroundColor: tokens.colors.accent
    },
    metaRow: {
      flexDirection: tokens.isRTL ? 'row-reverse' : 'row',
      paddingTop: tokens.spacing.lg,
      paddingEnd: tokens.spacing.xs
    },
    metaPill: {
      maxWidth: scale(180),
      minHeight: scale(36),
      paddingHorizontal: tokens.spacing.md,
      flexDirection: tokens.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      borderRadius: tokens.radii.round,
      backgroundColor: tokens.colors.surfaceElevated
    },
    metaSpacing: {
      marginEnd: tokens.spacing.sm
    },
    metaText: {
      color: tokens.colors.textSecondary,
      fontSize: scale(12)
    },
    addressRow: {
      marginTop: tokens.spacing.lg,
      flexDirection: tokens.isRTL ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: tokens.spacing.sm
    },
    addressText: {
      flex: 1,
      color: tokens.colors.textMuted,
      fontSize: scale(12),
      lineHeight: scale(17),
      textAlign: tokens.isRTL ? 'right' : 'left'
    },
    moreText: {
      color: tokens.colors.accent,
      fontSize: scale(12),
      fontWeight: '600'
    }
  })

export default styles
