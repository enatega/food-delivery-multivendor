// packages
import { BackHandler, Alert } from 'react-native'
/**
 * Attaches an event listener that handles the android-only hardware
 * back button
 * @param  {Function} callback The function to call on click
 */
const handleAndroidBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback()
    return true
  })
}
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress')
}
const exitAlert = () => {
  Alert.alert('Confirm exit', 'Do you want to quit the app?', [
    { text: 'CANCEL', style: 'cancel' },
    {
      text: 'OK',
      onPress: () => {
        BackHandler.exitApp()
      }
    }
  ])
  return true
}

export { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert }
