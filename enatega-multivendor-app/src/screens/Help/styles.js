import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.white : 'transparent'
    },
    backButton: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    mainContainer: {
      ...alignment.Msmall,
      marginTop: scale(5),
      backgroundColor: props !== null ? props.white : 'transparent',
      gap: scale(10)
    },
    itemContainer: {
      margin: scale(4),
      borderWidth: 1,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      borderRadius: scale(8),
      backgroundColor: props !== null ? props.gray100 : '#F3F4F6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
      ...alignment.PLlarge,
      ...alignment.PRlarge
    },
    backImageContainer: {
      backgroundColor: props !== null ? props.white : 'white',
      borderRadius: scale(50),
      width: scale(40),
      alignItems: 'flex-start',
      marginLeft: scale(5)
    },
    topContainer: {
      marginLeft: scale(10),
      marginTop: scale(10)
    }
  })
export default styles
