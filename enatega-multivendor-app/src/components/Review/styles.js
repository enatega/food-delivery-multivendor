import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import { fontStyles } from '../../utils/fontStyles'

export const styles = StyleSheet.create({
  container: theme => ({
    paddingHorizontal: scale(16),
    paddingVertical: scale(24),
    backgroundColor:theme.themeBackground
  }),
  starContainer: {
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  smallStarContainer: {
    flexDirection: 'row'
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...alignment.MTlarge
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
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalInput: (theme)=> ({
    height: scale(40),
    borderWidth: 1,
    borderColor: theme != null ? theme.verticalLine : '#B8B8B8',
    padding: 10,
    borderRadius: 6,
    color: theme !== null ? theme.newFontcolor : '#f9f9f9',
    fontFamily: fontStyles.MuseoSans500
  })
})
