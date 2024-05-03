import { scale } from '../../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
import { Dimensions } from 'react-native'
const {height} = Dimensions.get('screen')

const styles = (props = null) =>
  StyleSheet.create({
    leftContainer: {
      // height: scale(35),
      // width: scale(35),
      // flexDirection: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: props !== null ? props.gray100 : 'transparent',
      // borderRadius: 25
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scale(5)
    },
    // rightContainer: {
    //   flex: '1',
    //   height: '80%',
    //   width: '75%',
    //   justifyContent: 'center',
    // },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: scale(10)
    },
    linkContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // ...alignment.MLxSmall
      ...alignment.MTsmall,
      ...alignment.MBsmall
    },
    mainLeftContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props.color6 : '#9B9A9A',
      paddingTop: scale(1)
    },
  })
export default styles
