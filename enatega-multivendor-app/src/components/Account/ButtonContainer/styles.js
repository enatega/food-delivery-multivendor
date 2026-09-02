import { StyleSheet } from 'react-native'

const styles = (tokens, isRTL = false) =>
  StyleSheet.create({
    row: {
      minHeight: tokens.sizes.headerContent,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: tokens.spacing.md
    },
    pressed: {
      backgroundColor: tokens.colors.surfaceSubtle
    },
    content: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start'
    },
    label: {
      ...tokens.typeScale.caption,
      marginBottom: tokens.spacing.xxs
    },
    standaloneTitle: {
      ...tokens.typeScale.bodyStrong
    },
    detail: {
      ...tokens.typeScale.bodyStrong,
      maxWidth: '100%'
    },
    verifyView: {
      marginTop: tokens.spacing.xxs,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    status: {
      ...tokens.typeScale.caption
    }
  })
export default styles
