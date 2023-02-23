import { StyleSheet, Dimensions, Platform } from 'react-native'
import { colors } from '../../utilities'
const { height } = Dimensions.get('window')
const styles = StyleSheet.create({
  image: {
    flex: 1,
    marginBottom: Platform === 'ios' ? height * 0.12 : height * 0.08
  },
  topContainer: {
    backgroundColor: '#ffffffab',
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lowerContainer: {
    backgroundColor: '#ffffffab',
    flex: 0.7
  },
  scrollView: {
    backgroundColor: '#ffff'
  },
  barContainer: {
    backgroundColor: '#ffff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  roundedBar: {
    backgroundColor: '#E9E9E9',
    width: '100%',
    alignSelf: 'center',
    height: 80,
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: '#6FCF97',
    width: 60,
    height: 60,
    borderRadius: 50,
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    marginLeft: 15
  },
  borderContainer: {
    borderBottomWidth: 1,
    marginTop: 20,
    paddingBottom: 20,
    borderBottomColor: colors.fontSecondColor,
    width: '90%',
    marginBottom: 30,
    alignSelf: 'center'
  }
})

export default styles
