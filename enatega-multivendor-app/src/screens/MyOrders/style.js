import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor: props !== null ? props.headerBackground : 'transparent'
    },
    container: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    contentContainer: {
      flexGrow: 1,
      ...alignment.PBsmall
    },
    subContainerImage: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      ...alignment.PBlarge
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.MBxSmall
    },
    image: {
      width: scale(130),
      height: scale(130)
    },
    descriptionEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.Plarge
    },
    emptyButton: {
      padding: scale(10),
      backgroundColor: props !== null ? props.buttonBackground : 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    subContainer: {
      flex: 1,
      backgroundColor: props !== null ? props.cartContainer : '#FFF',
      borderRadius: scale(5),
      elevation: 3,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: verticalScale(1)
      },
      shadowOpacity: 0.5,
      shadowRadius: verticalScale(1),
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...alignment.MRsmall,
      ...alignment.MLsmall,
      ...alignment.MTsmall,
      ...alignment.PTsmall,
      ...alignment.PBsmall,
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    subContainerLeft: {
      width: '60%'
    },
    subContainerRight: {
      width: '40%',
      justifyContent: 'space-between'
    },
    subContainerButton: {
      backgroundColor: props !== null ? props.buttonBackground : 'grey',
      ...alignment.MTxSmall,
      width: scale(65),
      height: verticalScale(20),
      alignSelf: 'flex-end',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })

export default styles
