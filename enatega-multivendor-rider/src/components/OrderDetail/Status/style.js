import colors from '../../../utilities/colors'
import { Platform, StyleSheet } from 'react-native'
import { alignment } from '../../../utilities/alignment'

export default StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    ...alignment.PBlarge
  },
  statusMessage: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    height: 80,
    borderRadius: 25,
    marginTop: -20,
    padding: 4,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconView: {
    height: 50,
    width: 50,
    margin: Platform.OS === 'android' ? 7 : 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: colors.black
  },
  icon: {
    height: 30,
    width: 30
  },
  message: {
    margin: 10
  },
  status: {
    padding: 20
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    ...alignment.MRlarge
  },
  bgPrimary: {
    backgroundColor: colors.primary
  },
  bgSecondary: {
    backgroundColor: colors.fontSecondColor
  },
  statusOrder: {
    flex: 7
  },
  time: {
    flex: 5,
    marginTop: -5
  },
  verticalLine: {
    height: 50,
    width: 2,
    ...alignment.MTsmall,
    ...alignment.MBsmall,
    ...alignment.MLsmall
  }
})
