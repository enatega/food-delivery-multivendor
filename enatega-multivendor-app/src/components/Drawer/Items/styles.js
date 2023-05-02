import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftContainer: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: '100%',
    height: '100%'
  },
  rightContainer: {
    height: '80%',
    width: '60%',
    justifyContent: 'center'
  }
})
export default styles
