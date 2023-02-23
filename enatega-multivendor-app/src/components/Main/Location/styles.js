import { alignment } from '../../../utils/alignment'

export default {
  headerTitleContainer: {
    flex: 1,
    height: '100%'
  },
  headerContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textContainer: {
    maxWidth: '75%',
    ...alignment.PTxSmall,
    ...alignment.PBxSmall
  }
}
