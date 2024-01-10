import colors from '../../utilities/colors'
import { verticalScale, scale } from '../../utilities/scaling'
import { alignment } from '../../utilities/alignment'

export default {
  flex: {
    flex: 1
  },
  headingLanguage: {
    width: '70%',
    justifyContent: 'center'
  },
  languageContainer: {
    width: '100%',
    backgroundColor: colors.cartContainer,
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
    width: '25%',
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
    backgroundColor: colors.cartContainer,
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
}
