import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      height: height * 0.07,
      backgroundColor: props !== null ? props.buttonBackgroundPink : '#000000',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      ...alignment.PLsmall
    },
    marginLeft5: {
      ...alignment.MLsmall
    },
    marginLeft10: {
      ...alignment.MLmedium
    }
  })
export default styles
