import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: width * 0.7,
      height: 60,
      backgroundColor: props !== null ? props.black : 'black',
      borderRadius: 15,
      alignItems: 'center',
      marginTop: -30,
      ...alignment.PLlarge
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10
    },
    btn: {
      backgroundColor: props !== null ? props.primary : '#90EA93',

      borderRadius: 10,
      ...alignment.MRmedium,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    badge: {
      width: 20,
      height: 20,
      backgroundColor: props !== null ? props.primary : '#90EA93',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 2,
      marginTop: -20
    },
    rightBadge: {
      width: 20,
      height: 20,
      backgroundColor: props !== null ? props.primary : '#90EA93',
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -20
    }
  })
export default styles
