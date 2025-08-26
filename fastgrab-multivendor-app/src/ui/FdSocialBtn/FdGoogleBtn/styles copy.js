import { Dimensions } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
const { height } = Dimensions.get('window')

export default {
  mainContainer: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#b71c1c',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    ...alignment.PRlarge
  },
  marginLeft5: {
    ...alignment.MLsmall
  },
  marginLeft10: {
    ...alignment.MLmedium
  },
  textStyle: {
    ...textStyles.Bold,
    ...textStyles.Normal,
    color: '#FFF'
  }
}
