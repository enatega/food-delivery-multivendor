import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

export default {
  headerTitleContainer: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  headerContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'column-reverse',
    paddingLeft: scale(10)
  },
  textContainer: {
    maxWidth: '100%',
    ...alignment.PTxSmall,
    ...alignment.PBxSmall
  }
}
