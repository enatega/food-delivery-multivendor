import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.secondaryBackground : '#FFF',
      borderRadius: scale(5),
      elevation: 3,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(1),
      ...alignment.PTsmall,
      ...alignment.PBsmall,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
      ...alignment.MRsmall,
      ...alignment.MLsmall,
      ...alignment.MTsmall
    },
    leftContainer: {
      width: '75%',
      ...alignment.PRxSmall,
      ...alignment.PLxSmall
    },
    rightContainer: {
      width: '25%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headingContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTlarge,
      ...alignment.PBlarge
    },
    line: {
      height: StyleSheet.hairlineWidth + 1,
      backgroundColor: props !== null ? props.fontMainColor : 'grey',
      marginVertical: scale(8)
    },
    headingLine: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: props !== null ? props.fontMainColor : 'grey'
    },
    card: {
      display: 'flex',
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      padding: 20,
      borderRadius: 15,
      shadowColor: 'gray',
      shadowOffset: {
        width: 0,
        height: 7
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,

      elevation: 15
    },
    heading: {
      flex: 0.45
    },
    text: {
      flex: 0.55
    },
    itemRowBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 5
    },
    btn: {
      padding: scale(6),
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderWidth: 0.5,
      borderColor: props !== null ? props.fontMainColor : '#FFF'
    },
    subBtn: {
      padding: scale(6),
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderWidth: 0.5,
      backgroundColor: props !== null ? props.menuBar : '#FFF',
      borderColor: props !== null ? props.menuBar : '#FFF'
    },
    subContainer: {
      backgroundColor: props !== null ? props.tagColor : '#FFF',
      borderRadius: scale(5),
      elevation: 3,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(1),
      ...alignment.MRsmall,
      ...alignment.MLsmall,
      ...alignment.MTsmall,
      ...alignment.PTsmall,
      ...alignment.PBsmall,
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    subContainerLeft: {
      width: '60%',
      ...alignment.PRxSmall,
      ...alignment.PLxSmall
    },
    subContainerRight: {
      width: '40%',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    subContainerButton: {
      backgroundColor: props !== null ? props.fontSecondColor : 'grey',
      ...alignment.MTxSmall,
      width: scale(65),
      height: verticalScale(30),
      alignSelf: 'flex-end',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5
    },
    statusCircle: {
      marginRight: scale(5),
      marginBottom: scale(5),
      color: 'white'
    }
  })

export default styles
