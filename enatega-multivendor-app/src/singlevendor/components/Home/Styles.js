import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
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
    overflow: 'hidden',
    marginTop: 10
  }
})

export default styles
