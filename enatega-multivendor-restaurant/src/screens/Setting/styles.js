import { StyleSheet } from 'react-native'
import { colors } from '../../utilities'

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollContainer: {
    justifyContent: 'center'
  },
  topContainer: {
    backgroundColor: colors.white,
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bgColor: {
    backgroundColor: colors.white
  },
  lowerContainer: {
    backgroundColor: colors.green,
    flex: 7,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around'
  },
  headingText: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputStyle: {
    borderBottomWidth: 0,
    borderRadius: 8,
    height: 50,
    width: '90%',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 140,
  },
  languageContainer: {
    backgroundColor: colors.green,
    flex: 7,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%'
  },
  languageText: {
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.black
  },
  goBackContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    width: '40%',
    borderRadius: 5,
    marginTop: -50
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
export default styles