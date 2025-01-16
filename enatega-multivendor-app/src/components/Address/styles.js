import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'flex-start',
    },
    textBtn: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'flex-end',
      ...alignment.PBsmall
    },
  
    modalContainer: {
      flex: 1,
      backgroundColor: props !== null ? props?.cardBackground : '#FAFAFA',
      borderColor: props !== null ? props?.customBorder : 'transparent',
      ...alignment.PTmedium,
      ...alignment.PRlarge,
      ...alignment.PLlarge
    },
    modalTextBtn: {
      // alignSelf: 'flex-end',
      height: scale(30),
      width: scale(30),
      ...alignment.MTsmall
    },
    locationIcon:{
      backgroundColor: props != null ? props?.themeBackground : '#E5E7EB',
      width: 28,
      height: 28,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
export default styles
