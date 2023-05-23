import { scale, verticalScale } from '../../../utils/scaling'
import { Dimensions, StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
import { textStyles } from '../../../utils/textStyles'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      height: height * 0.07,
      elevation: 1,
      shadowColor: props !== null ? props.shadowColor : '#fefefe',
      shadowOffset: {
        width: 0,
        height: -verticalScale(2)
      },
      shadowOpacity: 0.8,
      shadowRadius: verticalScale(2),
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      justifyContent: 'center',
      alignItems: 'center'
    },
    subContainer: {
      width: '90%',
      height: '70%',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row'
    },
    icon: {
      width: '10%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnContainer: {
      width: '60%',
      height: '80%',
      backgroundColor: props !== null ? props.horizontalLine : 'black',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: 'transparent'
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props != null ? props.themeBackground : 'red',
      height: '100%',
      width: '100%',
      ...alignment.PTmedium,
      ...alignment.PLsmall,
      ...alignment.PRsmall,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: verticalScale(2)
      },
      borderTopLeftRadius: scale(10),
      borderTopRightRadius: scale(10),
      shadowOpacity: 0.6,
      shadowRadius: verticalScale(2),
      zIndex: 1
    },
    buttonText: {
      width: '60%',
      ...alignment.MBmedium,
      ...alignment.PTmedium,
      ...alignment.PBmedium,
      borderRadius: scale(10)
    },
    buttontLeft: {
      width: '40%',
      justifyContent: 'center',
      ...alignment.MBmedium,
      alignItems: 'center'
    },
    buttonLeftCircle: {
      backgroundColor: props != null ? props.buttonTextPink : 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTextLeft: {
      ...textStyles.Bold,
      ...textStyles.Center,
      ...textStyles.Smaller,
      fontSize: 20,
      ...alignment.MLxSmall,
      ...alignment.MRxSmall,
      backgroundColor: 'transparent',
      color: props != null ? props.backIconBackground : 'black'
    },
    two: {
      borderWidth: 1,
      borderColor: props != null ? props.backIconBackground : 'black',
      ...alignment.Psmall,
      borderRadius: scale(5)
    },
    round: {
      backgroundColor: props != null ? props.backIconBackground : 'black',
      padding: 2,
      borderRadius: 20
    }
  })
export default styles
