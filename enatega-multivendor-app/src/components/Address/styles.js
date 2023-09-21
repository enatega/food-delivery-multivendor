import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    textBtn: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'flex-end',
      ...alignment.PBsmall
    },
    modalContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : '#FAFAFA',
      borderColor: props !== null ? props.tagColor : '#FAFFAA',
      ...alignment.PTmedium,
      ...alignment.PRlarge,
      ...alignment.PLlarge
    },
    modalTextBtn: {
      alignSelf: 'flex-end',
      height: scale(30),
      width: scale(30),
      ...alignment.MTsmall
    }
  })
export default styles
