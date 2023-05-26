import { scale } from '../../utils/scaling'
import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
const { height } = Dimensions.get('window')
const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    formContainer: {
      flex: 1,
      width: '100%',
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent'
    },
    containerInfo: {
      width: '100%',
      ...alignment.MTmedium
    },
    upperContainer: {
      height: height * 0.3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        props !== null ? props.secondaryBackground : 'transparent'
    },
    lowerContainer: {
      height: height * 0.7,
      ...alignment.Psmall
    },
    avatar: {
      backgroundColor: props !== null ? props.tagColor : 'transparent',
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: props !== null ? props.themeBackground : 'transparent'
    },
    backgroundImage: {
      width: 180,
      height: 180,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formSubContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      alignSelf: 'center',
      width: '100%',
      borderRadius: 20,
      height: '100%',
      borderWidth:
        props !== null && props.themeBackground !== '#FAFAFA' ? 2 : 0,
      borderColor: props !== null ? props.shadowColor : 'transparent',
      ...alignment.MBlarge,
      ...alignment.MTsmall,
      ...alignment.Pmedium
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      ...alignment.MTsmall
    },
    icon: {
      padding: 8,
      width: '20%',
      alignItems: 'center'
    },
    details: {
      backgroundColor: '#ECECEC',
      ...alignment.Psmall,
      width: '60%',
      borderRadius: 10
    },

    phoneDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ECECEC',
      ...alignment.Psmall,
      width: '60%',
      borderRadius: 10
    },
    containerHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props !== null ? props.tagColor : 'black',
      ...alignment.Plarge,
      borderRadius: 20
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
      backgroundColor: props !== null ? props.secondaryBackground : 'black',
      alignItems: 'center',
      borderRadius: 5,
      ...alignment.PxSmall
    },
    saveContainer: {
      backgroundColor: props !== null ? props.buttonBackground : 'black',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      ...alignment.MTlarge,
      ...alignment.PRmedium,
      ...alignment.PLmedium,
      borderRadius: 10,
      width: 100
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
