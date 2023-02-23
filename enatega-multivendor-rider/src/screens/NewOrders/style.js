import colors from '../../utilities/colors'
import { Dimensions, Platform } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { height } = Dimensions.get('window')

const styles = {
  flex: {
    flex: 1
  },
  container: {
    height: '100%',
    width: '100%'
  },
  innerContainer: {
    height: height * 1,
    backgroundColor: colors.themeBackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: colors.headerText,
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 13.0,
    elevation: 24,
    alignItems: 'center',
    ...alignment.MTlarge
  },
  ordersContainer: {
    height: height,
    marginBottom: Platform.OS === 'ios' ? height * 0.4 : height * 0.35,
    ...alignment.MTlarge
  },
  margin500: {
    marginTop: -500
  }
}

export default styles
