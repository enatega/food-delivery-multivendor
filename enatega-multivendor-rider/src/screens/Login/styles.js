import colors from '../../utilities/colors'
import { Dimensions, Platform } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { height } = Dimensions.get('window')
export default {
  flex: {
    flex: 1
  },
  bgColor: {
    backgroundColor: colors.themeBackground
  },
  scrollContainer: {
    justifyContent: 'top',
    ...alignment.PTlarge
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    height: height * 1.2
  },
  image: {
    alignSelf: 'center',
    height: 150,
    width: 250,
    ...alignment.MBlarge,
    ...alignment.MTmedium
  },
  innerContainer: {
    height: height * 1,
    backgroundColor: colors.themeBackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: colors.headerText,
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 13.0,
    elevation: 24,
    ...alignment.MTlarge
  },
  signInText: {
    marginTop: 50,
    marginBottom: 50
  },
  textInput: {
    width: '80%',
    alignSelf: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderColor: colors.themeBackground,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: colors.fontSecondColor,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    ...alignment.MTlarge
  },
  passwordField: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginLeft: '10%'
  },
  eyeBtn: {
    position: 'relative',
    display: 'flex',
    zIndex: 1,
    elevation: 999,
    marginTop: Platform.OS === 'ios' ? 33 : 40,
    marginLeft: -40,
    color: colors.primary
  },
  btn: {
    width: '70%',
    height: height * 0.06,
    alignItems: 'center',
    backgroundColor: colors.black,
    color: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: height * 0.15
  },
  pt5: {
    paddingTop: 5
  },
  pt15: {
    paddingTop: 12
  },
  error: {
    marginLeft: '10%',
    ...alignment.MTxSmall
  },
  errorInput: {
    borderColor: colors.textErrorColor
  }
}
