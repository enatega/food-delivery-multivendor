import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(10),
    paddingBottom: scale(24)
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionSpacing: {
    paddingBottom: scale(6)
  },
  summaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12)
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0
  },
  ratingValueText: {
    marginLeft: scale(2),
    lineHeight: scale(22)
  },
  ratingBreakdownSection: {
    marginBottom: scale(8)
  },
  ratingBreakdownRow: {
    alignItems: 'center',
    minHeight: scale(28),
    marginBottom: scale(8)
  },
  ratingLabelContainer: {
    width: scale(46),
    alignItems: 'center',
    flexShrink: 0
  },
  ratingLabel: {
    minWidth: scale(12),
    textAlign: 'center'
  },
  ratingBarTrack: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: scale(10),
    borderRadius: scale(8),
    overflow: 'hidden'
  },
  reviewsSection: {
    marginTop: scale(8)
  },
  filtersRow: {
    alignItems: 'center'
  },
  filtersContent: {
    alignItems: 'center',
    paddingVertical: scale(4),
    paddingRight: scale(4)
  },
  filterButton: {
    minWidth: scale(104),
    height: scale(38),
    paddingHorizontal: scale(14),
    borderRadius: scale(19),
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterText: {
    fontSize: scale(11),
    lineHeight: scale(14)
  },
  reviewsList: {
    marginTop: scale(2)
  },
  emptyStateContainer: {
    paddingTop: scale(12),
    alignItems: 'center'
  },
  emptyStateCard: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(22),
    borderRadius: scale(20),
    borderWidth: StyleSheet.hairlineWidth
  },
  emptyStateIllustration: {
    width: scale(108),
    height: scale(108),
    borderRadius: scale(54),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(14)
  },
  emptyStateBadge: {
    position: 'absolute',
    right: scale(-2),
    bottom: scale(2),
    transform: [{ scale: 0.78 }]
  },
  emptyStateTitle: {
    marginBottom: scale(6)
  },
  emptyStateDescription: {
    paddingHorizontal: scale(10),
    lineHeight: scale(18)
  },
  backImageContainer: {
    width: scale(30)
  }
})
