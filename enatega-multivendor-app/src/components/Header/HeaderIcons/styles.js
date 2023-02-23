import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { verticalScale, scale } from '../../../utils/scaling'

const styles = backColor =>
  StyleSheet.create({
    leftIconPadding: {
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    rightContainer: {
      position: 'relative',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent'
    },
    favContainer: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      ...alignment.PLxSmall
    },
    imgContainer: {
      width: verticalScale(20),
      height: verticalScale(20)
    },
    absoluteContainer: {
      width: verticalScale(10),
      height: verticalScale(10),
      backgroundColor: backColor !== null ? backColor : 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: verticalScale(5),
      position: 'absolute',
      right: scale(5),
      top: scale(5)
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
      borderRadius: scale(2),
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
    }
  })

export default styles
