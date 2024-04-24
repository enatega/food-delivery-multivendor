import { Platform, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { verticalScale, scale } from '../../../utils/scaling'

const styles = (backColor) =>
  StyleSheet.create({
    leftIconPadding: {
      ...alignment.MLsmall
      // ...alignment.PTxSmall,
      // ...alignment.PBxSmall
    },
    rightContainer: {
      position: 'relative',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PRsmall
    },
    favContainer: {
      height: '100%',
      justifyContent: 'center',
      marginRight: Platform.OS === 'ios' && scale(15)
    },
    imgContainer: {
      width: verticalScale(20),
      height: verticalScale(20)
    },
    absoluteContainer: {
      width: verticalScale(15),
      height: verticalScale(15),
      backgroundColor: '#111827',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(15),
      position: 'absolute',
      right: scale(5),
      bottom: scale(2)
    },
    touchAreaPassword: {
      width: '40%',
      height: '70%',
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    titlePasswordText: {
      backgroundColor: backColor !== null ? backColor : 'white',
      height: '75%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderRadius: scale(10),
      ...alignment.PLmedium
    },
    passwordContainer: {
      width: scale(150),
      ...alignment.PRxSmall
    },
    darkBackArrow: {
      ...alignment.PLxSmall,
      ...alignment.PRxSmall,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    rightButtonContainer: {
      padding: scale(5),
      width: scale(60)
    }
  })

export default styles
