import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { theme } from '../../utils/themeColors'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    formContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: props !== null ? props.white : 'transparent'
    },
    containerInfo: {
      width: '100%',
      ...alignment.MTmedium
    },
    formSubContainer: {
      borderRadius: scale(8),
      flexDirection: 'row',
      width: '92%',
      backgroundColor: props !== null ? props.gray100 : 'transparent',
      alignSelf: 'center',
      elevation: 1,
      borderWidth: props !== null && props.gray200 !== '#E5E7EB' ? 2 : 0,
      borderColor: props !== null ? props.gray200 : '#E5E7EB',
      ...alignment.MTsmall,
      ...alignment.Psmall
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    containerHeading: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    headingTitle: {
      width: '50%'
    },

    headingLink: {
      flex: 1,
      ...alignment.MRxSmall,
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    headingButton: {
      marginLeft: scale(5),
      justifyContent: 'center',
      ...alignment.PLmedium
    },
    saveContainer: {
      backgroundColor: props !== null ? props.main : '#90E36D',
      padding: scale(8),
      borderRadius: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(120)
    },
    bacKButton: {
      backgroundColor: 'white',
      borderRadius: scale(50),
      width: scale(40),
      alignItems: 'flex-start',
      marginLeft: scale(5)
    },
    verifiedButton: {
      padding: scale(8),
      borderRadius: scale(16),
      marginTop: scale(10),
      justifyContent: 'center',
      alignItems: 'center',
      width: scale(120)
    },

    // Model for password changing
    modalContainer: {
      backgroundColor: props !== null ? props.themeBackground : '#FFF',
      borderRadius: scale(14),
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
      alignItems: 'flex-start',
      backgroundColor: props !== null ? props.radioOuterColor : 'white'
    },
    btnContainer: {
      width: '30%',
      justifyContent: 'center',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      ...alignment.MTlarge,
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    titleContainer: {
      backgroundColor: props !== null ? props.themeBackground : 'white',
      color: props !== null ? props.darkBgFont : 'white',
      padding: scale(25),
      fontSize: scale(20),
      fontWeight: '600'
    },
    phoneDetailsContainer: {
      display: 'flex',
      flexDirection: 'row'
    }
  })
export default styles
