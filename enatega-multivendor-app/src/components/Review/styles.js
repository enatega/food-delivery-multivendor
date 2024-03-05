import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(16),
    paddingVertical: scale(24)
  },
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
    justifyContent: 'space-between'
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
  }
})
