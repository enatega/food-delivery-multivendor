import { Dimensions } from 'react-native'
const { height } = Dimensions.get('window')

export default {
  backgroundImage: {
    marginTop: 50,
    width: '100%',
    height: height * 0.25,
  }
}
