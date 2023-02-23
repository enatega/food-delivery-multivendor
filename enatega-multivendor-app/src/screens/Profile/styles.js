import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    formContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: props !== null ? props.themeBackground : 'transparent'
    },
    containerInfo: {
      width: '100%',
      ...alignment.MTmedium
    },
    formSubContainer: {
      width: '95%',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      alignSelf: 'center',
      shadowOffset: { width: 2, height: 4 },
      shadowColor: props !== null ? props.shadowColor : 'transparent',
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 15,
      borderWidth:
        props !== null && props.themeBackground !== '#FAFAFA' ? 2 : 0,
      borderColor: props !== null ? props.shadowColor : 'transparent',
      ...alignment.MBlarge,
      ...alignment.MTsmall,
      ...alignment.Pmedium
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    containerHeading: {
      flexDirection: 'row',
      alignContent: 'space-between'
    },
    headingTitle: {
      width: '50%'
    },
    headingLink: {
      width: '50%',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    headingButton: {
      justifyContent: 'center',
      ...alignment.PLmedium
    },
    saveContainer: {
      // width: '30%',
      backgroundColor: props !== null ? props.buttonBackground : 'black',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
      ...alignment.MTmedium,
      ...alignment.PRmedium,
      ...alignment.PLmedium
    },
    // Model for password changing
    modalContainer: {
      backgroundColor: props !== null ? props.cartContainer : '#FFF',
      borderRadius: scale(2),
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTmedium,
      ...alignment.PBsmall
    },
    modalContent: {
      width: '90%'
    },
    titleContainer: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    },
    btnContainer: {
      width: '30%',
      justifyContent: 'center',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      ...alignment.MTlarge,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    }
  })
export default styles
