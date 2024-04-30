import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'
import { Dimensions } from 'react-native'
const {height} = Dimensions.get('screen')

const styles = (props = null) =>
  StyleSheet.create({
    linkContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      // ...alignment.MLxSmall
    },
    leftContainer: {
      height: scale(35),
      width: scale(35),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props !== null ? props.gray100 : 'transparent',
      backgroundColor: 'red',
      borderRadius: 25
    },
    rightContainer: {
      flex: '1',
      height: '80%',
      width: '75%',
      justifyContent: 'center',
      backgroundColor: 'blue'
    },
    drawerContainer: {
      alignSelf: 'flex-start',
      backgroundColor: 'cyan'
    }
  })
export default styles
