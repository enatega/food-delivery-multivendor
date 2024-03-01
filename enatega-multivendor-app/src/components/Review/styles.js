import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

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
  }
})
