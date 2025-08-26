import { StyleSheet } from 'react-native'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'
import { alignment } from '../../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      ...alignment.MLxSmall
    },
    leftContainer: {
      height: scale(35),
      width: scale(35),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props?.gray100 : 'transparent',
      borderRadius: 25
    },
    img: {
      width: '100%',
      height: '100%'
    },
    rightContainer: {
      height: '80%',
      width: '75%',
      justifyContent: 'center'
    },
    drawerContainer: {
      alignSelf: 'flex-start'
    }
  })
export default styles
