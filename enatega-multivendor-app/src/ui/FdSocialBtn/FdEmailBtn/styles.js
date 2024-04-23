import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
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
      borderColor: props !== null ? props.newIconColor : '#9B9A9A',
      ...alignment.PLlarge
    },
    marginLeft5: {
      ...alignment.MLsmall
    },
    marginLeft10: {
      ...alignment.MLmedium
    }
  })
export default styles
