import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utilities/alignment'

const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      width: width * 0.85,
      borderRadius: 20,
      alignItems: 'center',
      alignSelf: 'center',
      shadowColor: props !== null ? props.fontSecondColor : 'black',
      shadowOffset: {
        width: 0,
        height: 5
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
      ...alignment.PTsmall,
      ...alignment.PBsmall,
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      ...alignment.MBmedium
    },
    bgBlack: {
      backgroundColor: props !== null ? props.black : 'black'
    },
    bgWhite: {
      backgroundColor: props !== null ? props.white : 'white'
    },
    horizontalLine: {
      width: width * 0.75,
      borderBottomWidth: 1,
      borderBottomColor: props !== null ? props.white : 'white',
      ...alignment.Msmall
    },
    requestDetails: {
      display: 'flex',
      flexDirection: 'row',
      ...alignment.PBxSmall
    },
    col1: {
      flex: 5
    },
    col2: {
      flex: 5
    }
  })
export default styles
