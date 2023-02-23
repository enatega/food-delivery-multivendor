import colors from '../../utilities/colors'
import { Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { width } = Dimensions.get('window')

const Styles = {
  container: {
    width: width * 0.85,
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 0,
    shadowColor: colors.fontSecondColor,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    marginTop: -15,
    ...alignment.MBmedium
  },
  bgWhite: {
    backgroundColor: colors.white
  },
  bgPrimary: {
    backgroundColor: colors.primary
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    ...alignment.MBsmall
  },
  rowItem1: {
    flex: 7
  },
  rowItem2: {
    flex: 5
  },
  horizontalLine: {
    width: width * 0.78,
    borderBottomColor: colors.black,
    borderBottomWidth: 1
  },
  timeLeft: {
    marginTop: 25
  },
  time: {
    marginTop: -8,
    ...alignment.MLxSmall
  },
  btn: {
    backgroundColor: colors.black,
    borderRadius: 10,
    marginTop: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pt5: {
    paddingTop: 5
  },
  pt15: {
    paddingTop: 16
  },

  badge: {
    display: 'flex',
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 999,
    elevation: 999
  },
  bgRed: {
    backgroundColor: colors.orderUncomplete
  },
  bgBlack: {
    backgroundColor: colors.black
  }
}

export default Styles
