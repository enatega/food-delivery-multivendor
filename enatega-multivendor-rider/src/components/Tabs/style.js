import colors from '../../utilities/colors'
import { Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { width } = Dimensions.get('window')

export default {
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    backgroundColor: colors.black,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: -30,
        alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    borderRadius: 10
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
