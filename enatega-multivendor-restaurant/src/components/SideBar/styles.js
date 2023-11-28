import { StyleSheet } from 'react-native'
import { colors } from '../../utilities'
const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center'
  },
  item: {
    aspectRatio: 1,
    width: '100%',
    flex: 1
  },
  topContainer: {
    flex: 0.35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000bf'
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '80%',
    alignItems: 'center'
  },
  middleContainer: {
    flex: 0.5,
    backgroundColor: '#000000bf'
  },
  lowerContainer: {
    flex: 0.15,
    backgroundColor: '#000000bf'
  },
  avatar: {
    width: 100,
    height: 100,
    borderWidth: 6,
    borderColor: colors.white,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '10%',
    justifyContent: 'flex-start',
    marginVertical: 10
  },
  icon: {
    width: '15%'
  },
  text: {
    marginLeft: 20,
    color: colors.white
  },
  status: {
    marginBottom: '15%',
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})

export default styles
