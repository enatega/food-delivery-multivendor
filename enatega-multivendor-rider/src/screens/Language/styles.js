import { verticalScale, scale } from '../../utilities/scaling'
import { alignment } from '../../utilities/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    headingLanguage: {
      width: '85%',
      justifyContent: 'center'
    },
    languageContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : 'white',

      ...alignment.PRmedium,
      ...alignment.PTsmall,
      ...alignment.PBlarge,
      ...alignment.PLmedium
    },
    shadow: {
      shadowOffset: { width: 0, height: scale(2) },
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: scale(1),
      elevation: 5,
      borderWidth: 0.4,
      borderColor: '#e1e1e1'
    },
    changeLanguage: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: verticalScale(40)
    },
    button: {
      width: '15%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalContainer: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: verticalScale(4),
      ...alignment.Plarge
    },
    radioContainer: {
      width: '100%',
      backgroundColor: props !== null ? props.cartContainer : 'white',
      flexDirection: 'row',
      alignItems: 'center',
      ...alignment.PTxSmall,
      ...alignment.PBxSmall
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    modalButtons: {
      ...alignment.Msmall,
      marginBottom: 0
    }
  })
export default styles
