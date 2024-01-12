import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utilities/alignment'
const { width } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    inputView: {
      ...alignment.Pmedium
    },
    textInput: {
      width: width * 0.8,
      alignSelf: 'center',
      padding: 15,
      backgroundColor: props !== null ? props.white : 'white',
      borderColor: props != null ? props.themeBackground : '#FFF',
      borderWidth: 1,
      borderRadius: 10,
      shadowColor: props != null ? props.fontSecondColor : '#FFF',

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
      borderColor: props != null ? props.textErrorColor : 'red',

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
      backgroundColor: props != null ? props.black : '#000',
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
export default styles
