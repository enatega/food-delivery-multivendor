import { StyleSheet } from 'react-native'

const styles = (theme) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.canvas
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl
  },
  addressRow: {
    minHeight: theme.sizes.compactTile,
    flexDirection: theme.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle
  },
  selectedAddressRow: {
    marginVertical: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.tile,
    borderBottomColor: 'transparent',
    backgroundColor: theme.colors.accentSubtle
  },
  selectionColumn: {
    width: theme.sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addressCopy: {
    flex: 1,
    minWidth: 0,
    paddingLeft: theme.isRTL ? 0 : theme.spacing.xs,
    paddingRight: theme.isRTL ? theme.spacing.xs : 0
  },
  addressTitleRow: {
    flexDirection: theme.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs
  },
  addressTitle: {
    flex: 1,
    textAlign: theme.isRTL ? 'right' : 'left',
    ...theme.typeScale.bodyStrong
  },
  addressDetail: {
    paddingRight: theme.isRTL ? 0 : theme.spacing.xl,
    paddingLeft: theme.isRTL ? theme.spacing.xl : 0,
    textAlign: theme.isRTL ? 'right' : 'left',
    ...theme.typeScale.body
  },
  editButton: {
    width: theme.sizes.iconButton,
    height: theme.sizes.iconButton,
    borderRadius: theme.radii.round,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomAction: {
    paddingTop: theme.spacing.sm
  },
  actionRow: {
    flexDirection: theme.isRTL ? 'row-reverse' : 'row',
    gap: theme.spacing.sm
  },
  secondaryAction: {
    flex: 1
  },
  primaryAction: {
    flex: 0.82
  }
})

export default styles
