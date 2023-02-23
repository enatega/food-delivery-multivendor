import colors from '../../../utilities/colors'
import { verticalScale } from '../../../utilities/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utilities/alignment'

export default {
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.horizontalLine,
    backgroundColor: 'transparent'
  },
  img: {
    width: verticalScale(120),
    height: verticalScale(120),
    borderRadius: verticalScale(35),
    borderWidth: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: colors.horizontalLine,
    backgroundColor: colors.primary,
    color: '#000',
    ...alignment.MBmedium
  }
}
