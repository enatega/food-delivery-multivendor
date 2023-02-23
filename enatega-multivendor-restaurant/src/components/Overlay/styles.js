import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../utilities'
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 30,
    alignItems: 'center'
  },
  header: {
    backgroundColor: colors.green,
    width: 220,
    height: 100,
    marginTop: -60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  time: {
    display: 'flex',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  },
  timeBtn: {
    flexGrow: 1,
    width: '25%',
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black'
  },
  btn: {
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '70%',
    borderRadius: 10
  }
})
export default styles
