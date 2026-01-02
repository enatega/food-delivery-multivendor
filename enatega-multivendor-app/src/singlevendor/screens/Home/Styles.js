import { StyleSheet } from 'react-native'

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#F5F5F5'
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'contain'
    },
    sliderContainer: {
      width: '95%',
      height: 'auto',
      resizeMode: 'cover',
      alignSelf: 'center',
      borderRadius: 10,
      overflow: 'hidden'
    }
  })

export default styles
