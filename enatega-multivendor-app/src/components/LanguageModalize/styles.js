import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 'auto',
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      paddingHorizontal: scale(20),
      paddingTop: scale(20),
      paddingBottom: scale(10),
      borderWidth: scale(1),
      borderColor: props !== null ? props.gray200 : '#E5E7EB'
    },
    subContainer: {
      height: 500,
      width: '80%',
      backgroundColor: 'cyan'
    },
    radioContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      flexDirection: 'row',
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall,
      marginTop: scale(5)
    },
    emptyButton: {
      display: 'flex',
      flexDirection: 'row',
      width: '82%',
      backgroundColor: props !== null ? props.main : 'transparent',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: scale(28),
      height: scale(40),
      margin: scale(10)
    }
  })

export default styles
