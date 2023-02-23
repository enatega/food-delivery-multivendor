import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'
import colors from '../../utilities/colors'
const { width } = Dimensions.get('window')

export default StyleSheet.create({
  inputView: {
    ...alignment.Pmedium
  },
  textInput: {
    width: width * 0.8,
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
    ...alignment.MBsmall
  },
  errorInput: {
    borderColor: colors.textErrorColor,
    borderWidth: 1
  },
  btnView: {
    alignItems: 'center',
    ...alignment.MTlarge
  },
  btn: {
    width: width * 0.8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    ...alignment.MBmedium,
    ...alignment.Pmedium,
    ...alignment.MTlarge
  },
  sentView: {
    ...alignment.Plarge
  },
  imageView: {
    alignItems: 'center',
    ...alignment.Mlarge
  },
  image: {
    height: 110,
    width: 140,
    ...alignment.MBlarge
  },
  inputText: {
    marginLeft: 22
  }
})
