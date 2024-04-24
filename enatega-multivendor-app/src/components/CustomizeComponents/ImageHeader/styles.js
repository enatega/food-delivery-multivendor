import { Dimensions, StyleSheet } from 'react-native'
const { height } = Dimensions.get('window')
import { alignment } from '../../../utils/alignment'

export default StyleSheet.create({
  backgroundImage: {
    height: height * 0.20,
    objectFit: 'cover',
    ...alignment.Mmedium,
  }
})
