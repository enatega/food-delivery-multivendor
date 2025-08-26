import { Platform, Linking } from 'react-native'

export function linkToMapsApp(
  { latitude, longitude }: { latitude: number; longitude: number },
  label: string,
) {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
  const latLng = `${latitude},${longitude}`
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  })

  if (url) {
    Linking.openURL(url)
  }
}
