import colors from '../../utilities/colors'
import { alignment } from '../../utilities/alignment'

const styles = {
  flex: {
    flex: 1,
    color: colors.white
  },
  topContainer: {
    height: '30%',
    backgroundColor: colors.horizontalLine
  },
  botContainer: {
    flex: 1,
    marginTop: '4%',
    marginBottom: 70,
    backgroundColor: colors.cartContainer
  },
  item: {
    height: '10%',
    ...alignment.MBsmall
  },
  spinnerBackgorund: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.fontSecondColor,
    opacity: 1
  },
  rowDisplay: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  online: {
    marginTop: 2,
    ...alignment.MRxSmall
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  opacity: {
    backgroundColor: colors.black,
    opacity: 0.8
  }
}

export default styles
