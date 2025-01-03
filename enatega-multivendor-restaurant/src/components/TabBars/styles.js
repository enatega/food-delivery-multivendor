import { StyleSheet } from 'react-native'
import { colors } from '../../utilities'
const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: '#ffffffab',
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: -30
  },
  barContent: {
    padding: 15,
    borderRadius: 10
  }
})

export default styles
