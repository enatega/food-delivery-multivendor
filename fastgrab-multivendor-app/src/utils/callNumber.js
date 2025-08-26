import { Linking, Alert, Platform } from 'react-native'

export const callNumber = phone => {
  let phoneNumber = phone
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`
  } else {
    phoneNumber = `tel:${phone}`
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available')
      } else {
        return Linking.openURL(phoneNumber)
      }
    })
    .catch(err => console.log(err))
}
