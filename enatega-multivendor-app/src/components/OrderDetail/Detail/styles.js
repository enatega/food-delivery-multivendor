import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'
const { width: WIDTH } = Dimensions.get('window')
export default StyleSheet.create({
  container: (theme) => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderSubtle,
    borderRadius: scale(16),
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: scale(12),
    marginTop: scale(12),
    padding: scale(14)
  }),
  line: (theme) => ({
    height: 1,
    width: '90%',
    backgroundColor: theme.secondaryText
  }),
  riderCard: (theme) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderSubtle,
    borderRadius: scale(14),
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    padding: scale(12)
  }),
  riderIdentity: (theme) => ({
    alignItems: 'center',
    flex: 1,
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    minWidth: 0
  }),
  riderCopy: {
    flex: 1,
    marginHorizontal: scale(10)
  },
  riderActions: (theme) => ({
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    gap: scale(8)
  }),
  riderAction: (theme) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.accentSubtle,
    borderRadius: scale(18),
    height: scale(36),
    justifyContent: 'center',
    width: scale(36)
  }),
  unreadDot: (theme) => ({
    backgroundColor: theme.red600,
    borderColor: theme.colors.surface,
    borderRadius: scale(4),
    borderWidth: 1,
    height: scale(8),
    position: 'absolute',
    right: scale(6),
    top: scale(5),
    width: scale(8)
  }),

  orderDetailsContainer: (theme) => ({
    backgroundColor: theme.themeBackground
  }),
  addressContainer: {
    width: WIDTH - 20
  },
  row: {
    paddingTop: scale(25),
    flexDirection: 'row'
  },
  itemsContainer: {
    width: '100%'
  },
  line2: (theme) => ({
    marginVertical: scale(10),
    backgroundColor: theme.secondaryText,
    height: scale(1),
    width: '100%'
  }),
  itemRow: (theme) => ({
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderSubtle
  }),
  itemCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center'
  },
  itemPrice: {
    minWidth: scale(58),
    textAlign: 'right'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10)
  }
})
