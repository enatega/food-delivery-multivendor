import { scale } from '../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      alignItems: 'center',
      backgroundColor: props !== null ? props.buttonText : 'transparent'
    },
    subContainer: {
      display: 'flex',
      alignSelf: 'center',
      width: '80%',
      paddingBottom: 10,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    whiteColor: {
      backgroundColor: props !== null ? props.buttonText : 'transparent'
    },
    crossIcon: {
      width: scale(14),
      height: scale(14),
      ...alignment.MTlarge,
      ...alignment.MLlarge
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    marginTop5: {
      ...alignment.MTsmall
    },
    marginTop10: {
      ...alignment.MTmedium
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    buttonBackground: {
      width: '100%',
      backgroundColor: props !== null ? props.black : '#000',
      alignItems: 'center'
    },
    appleBtn: {
      width: '100%',
      height: height * 0.07,
      fontSize: 20
    },
    orText: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: props !== null ? props.horizontalLine : '#9B9A9A'
    }
  })
export default styles
