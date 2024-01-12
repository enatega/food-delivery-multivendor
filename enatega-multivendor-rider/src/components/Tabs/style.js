import colors from '../../utilities/colors'
import { Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { width } = Dimensions.get('window')

export default {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: width * 0.79,
    height: 60,
    backgroundColor: colors.black,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: -30,
    ...alignment.PLlarge
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    ...alignment.MRmedium,
    ...alignment.PLsmall,
    ...alignment.PRsmall,
    ...alignment.PTsmall,
    ...alignment.PBsmall,
  },
  badge: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    marginTop: -20
  },
  rightBadge: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    marginTop: -20
  }
}
