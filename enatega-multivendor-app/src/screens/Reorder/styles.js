import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    scrollViewStyle: {
      flexGrow: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      justifyContent: 'space-between'
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      paddingBottom: scale(8),
      borderRadius: scale(15),
      gap: 8,
      ...alignment.PLmedium,
      ...alignment.PRmedium,
      ...alignment.PTsmall
    },
    buttonContainer: {
      width: '100%'
    },
    buttonStyles: {
      margin: scale(10),
      paddingHorizontal: scale(50),
      paddingVertical: scale(15),
      backgroundColor: props !== null ? props.main : '#6FCF97',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(40)
    },
    backButton: {
      backgroundColor: theme.Pink.white,
      borderRadius: scale(50),
      marginLeft: scale(10),
      width: scale(55),
      alignItems: 'center'
    },
    priceContainer: {
      flex: 1,
      alignItems: 'flex-end'
    }
  })

export default styles
