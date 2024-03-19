import { Dimensions } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')

export default {
  mainContainer: {
    width: '90%',

    alignSelf: 'center',
    height: height * 0.08,
    flexDirection: 'row',
    alignItems: 'center',
    ...alignment.PRlarge,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    borderRadius: scale(28),
    borderWidth: scale(1),
    borderBottomColor: '#000',
    ...alignment.PLlarge
  },

  marginLeft10: {
    ...alignment.MLmedium
  },
  textStyle: {
    ...textStyles.Bold,
    ...textStyles.Normal,
    color: '#000'
  }
}
