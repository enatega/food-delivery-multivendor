import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'
import colors from '../../utilities/colors'
const { width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    width: width * 0.85,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: colors.fontSecondColor,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    ...alignment.PTsmall,
    ...alignment.PBsmall,
    ...alignment.PLlarge,
    ...alignment.PRlarge,
    ...alignment.MBmedium
  },
  bgBlack: {
    backgroundColor: colors.black
  },
  bgWhite: {
    backgroundColor: colors.white
  },
  horizontalLine: {
    width: width * 0.75,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    ...alignment.Msmall
  },
  requestDetails: {
    display: 'flex',
    flexDirection: 'row',
    ...alignment.PBxSmall
  },
  col1: {
    flex: 5
  },
  col2: {
    flex: 5
  }
})
