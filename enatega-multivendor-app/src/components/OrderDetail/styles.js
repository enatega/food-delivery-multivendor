import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'
export default StyleSheet.create({
  cancelButtonContainer: theme => ({
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.red600,
    borderWidth: 1,
    borderRadius: scale(25),
    width: scale(200)
  }),
  dismissButtonContainer: theme => ({
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: scale(25),
    width: scale(200),
    borderColor: theme.newIconColor
  }),
  modalContainer: theme => ({
    borderWidth:scale(1),
    borderColor:theme.white,
    margin: 10,
    backgroundColor: theme.themeBackground,
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }),
  container: theme => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  })
})
