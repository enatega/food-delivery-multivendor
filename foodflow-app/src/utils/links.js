import { Platform, Linking } from 'react-native'

export function linkToMapsApp({ latitude, longitude }, label) {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
  const latLng = `${latitude},${longitude}`
  // const label = label;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  })

  Linking.openURL(url)
}
