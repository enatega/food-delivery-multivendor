import React, { useContext } from'react'
import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'

const styles = (props = null) => {
    const themeContext = useContext(ThemeContext)
    const currentTheme = theme[themeContext.ThemeValue]

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.customizeOpacityBtn
    },
    modalContent: {
      backgroundColor: currentTheme.themeBackground,
      padding: scale(20),
      borderRadius: scale(10)
    },
    modalText: {
      fontSize: scale(15),
      marginBottom: scale(10),
      color: currentTheme.secondaryText
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: scale(10)
    },
    modalHeader: {
      fontSize: scale(20),
      marginBottom: scale(10),
      fontWeight: 'bold',
      color: currentTheme.secondaryText
    }
  })
}
export default styles
