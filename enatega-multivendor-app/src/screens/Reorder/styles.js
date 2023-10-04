import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    scrollViewStyle: {
      flexGrow: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      justifyContent: 'space-between'
    },
    mainContainer: {
      backgroundColor: props !== null ? props.radioOuterColor : 'transparent',
      margin: scale(8),
      paddingBottom: scale(8),
      borderRadius: scale(15)
    },
    buttonContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.menuBar : 'transparent',
      elevation: 12,
      shadowColor: props !== null ? props.shadowColor : 'black',
      shadowOffset: {
        width: 0,
        height: -3
      },
      shadowOpacity: 0.5,
      shadowRadius: scale(2)
    },
    buttonStyles: {
      margin: scale(10),
      paddingHorizontal: scale(50),
      paddingVertical: scale(15),
      backgroundColor: props !== null ? props.buttonBackgroundPink : '#6FCF97',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(10)
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
