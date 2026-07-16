import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import { fontStyles } from '../../utils/fontStyles'

export const styles = StyleSheet.create({
  container: theme => ({
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    paddingBottom: scale(28),
    backgroundColor: theme.cardBackground,
    flexGrow: 1
  }),
  content: theme => ({
    flexGrow: 1,
    paddingBottom: scale(18)
  }),
  starContainer: theme => ({
    width: '100%',
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    paddingVertical: scale(10),
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }),
  smallStarContainer: {
    flexDirection: 'row'
  },
  headingContainer: theme => ({
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  itemContainer: theme => ({
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    ...alignment.MTlarge
  }),
  summaryTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: scale(10)
  },
  starRow: {
    marginTop: scale(8)
  },
  feedbackSection: {
    marginTop: scale(8)
  },
  image: {
    height: scale(64),
    width: scale(82),
    borderRadius: 10
  },
  cardContainer: theme => ({
    borderRadius: scale(5),
    borderColor: theme.gray200,
    borderWidth: 1,
    padding: scale(10),
    ...alignment.MTsmall
  }),
  reviewContainer: theme => ({
    flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center'
  }),
  modalInput: (theme)=> ({
    minHeight: scale(96),
    borderWidth: 1,
    borderColor: theme != null ? theme.verticalLine : '#B8B8B8',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    borderRadius: 10,
    color: theme !== null ? theme.newFontcolor : '#f9f9f9',
    fontFamily: fontStyles.MuseoSans500,
    textAlign: theme?.isRTL ? 'right' : 'left',
    backgroundColor: theme?.cardBackground,
    marginTop: scale(4)
  })
})
