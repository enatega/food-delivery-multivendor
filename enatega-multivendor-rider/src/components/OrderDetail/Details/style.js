import colors from '../../../utilities/colors'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utilities/alignment'
const { height, width } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 25,
    marginTop: -25,
    padding: 20
  },
  timeContainer: {
    ...alignment.Pmedium
  },
  btn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    borderRadius: 10,
    height: height * 0.07,
    ...alignment.MBmedium
  },
  pt5: {
    paddingTop: 5
  },
  pt15: {
    paddingTop: 20
  },
  heading: {
    ...alignment.MTmedium
  },
  horizontalLine: {
    alignSelf: 'center',
    width: width * 0.9,
    borderBottomWidth: 1,
    borderBottomColor: colors.fontSecondColor,
    ...alignment.MTlarge,
    ...alignment.MBlarge
  },
  horizontalLine2: {
    alignSelf: 'center',
    width: width * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: colors.fontSecondColor,
    ...alignment.MBmedium
  },
  orderDetails: {
    backgroundColor: colors.white,
    shadowColor: colors.fontSecondColor,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderRadius: 20,
    ...alignment.MTlarge,
    ...alignment.MBlarge,
    ...alignment.Plarge
  },
  rowDisplay: {
    display: 'flex',
    flexDirection: 'row'
  },
  col1: {
    flex: 6
  },
  col2: {
    flex: 6,
    ...alignment.PBmedium
  },
  coll1: {
    flex: 2
  },
  coll2: {
    flex: 7,
    ...alignment.PBmedium
  },
  coll3: {
    flex: 3
  }
})
