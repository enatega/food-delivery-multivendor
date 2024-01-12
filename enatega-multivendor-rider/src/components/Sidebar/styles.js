import { alignment } from '../../utilities/alignment'
import { StyleSheet } from 'react-native'
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      color: props !== null ? props.white : 'white'
    },
    topContainer: {
      height: '30%',
      backgroundColor: props !== null ? props.horizontalLine : 'black'
    },
    botContainer: {
      flex: 1,
      marginTop: '4%',
      marginBottom: 70,
      backgroundColor: props !== null ? props.cartContainer : 'white'
    },
    item: {
      height: '10%',
      ...alignment.MBsmall
    },
    spinnerBackgorund: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: props !== null ? props.fontSecondColor : 'black',

      opacity: 1
    },
    rowDisplay: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    online: {
      marginTop: 2,
      ...alignment.MRxSmall
    },
    image: {
      flex: 1,
      justifyContent: 'center'
    },
    opacity: {
      backgroundColor: props !== null ? props.black : 'black',
      opacity: 0.8
    }
  })

export default styles
