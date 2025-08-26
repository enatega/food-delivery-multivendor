import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  leftContainer: {
    height: '100%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: '100%',
    height: '100%'
  },
  rightContainer: {
    height: '80%',
    width: '75%',
    justifyContent: 'center'
  },
  drawerContainer: {
    alignSelf: 'flex-start'
  }
})
export default styles
