import { StyleSheet } from 'react-native'

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#F5F5F5'
    }
  })

export default styles

