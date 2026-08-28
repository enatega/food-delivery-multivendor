import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: scale(46),
      marginTop: scale(10)
    },
    ovalContainer: {
      backgroundColor: theme?.colors?.surfaceSubtle || theme?.gray200,
      flex: 1,
      borderRadius: scale(14),
      flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
      padding: scale(3),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme?.colors?.borderSubtle
    },
    ovalButton: {
      flex: 1,
      borderRadius: scale(11),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    instructionContainer: {
      paddingVertical: scale(12),
      flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme?.colors?.borderSubtle
    },
    leftContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    middleContainer: { flex: 6, justifyContent: 'space-evenly' },

    navigateButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.main,
      borderColor: theme.main,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: scale(25),
      width: scale(200)
    },
    dismissButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: scale(25),
      width: scale(200),
      borderColor: theme.newIconColor
    },
    modalContainer: {
      backgroundColor: theme?.themeBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme?.colors?.borderSubtle || theme.newIconColor,
      borderRadius: scale(20),
      padding: scale(20),
      width: '90%', // Adjust width as needed
      alignSelf: 'center', // Horizontal centering
      justifyContent: 'center', // Vertical centering
      alignItems: 'center', // Ensure content is centered
      height: 'auto', // Auto height
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      justifyContent: 'center', // Vertical centering of modal
      alignItems: 'center', // Horizontal centering of modal
    }
  })
