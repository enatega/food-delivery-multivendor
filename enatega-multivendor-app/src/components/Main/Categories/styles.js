import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    categoryContainer: {
      width: '100%'
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...alignment.MTmedium,
      ...alignment.MBmedium
    },
    options: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },

    box: {
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Pmedium,
      borderRadius: 20,
      height: 50
    },
    label: {
      ...alignment.MTsmall
    }
  })
export default styles
