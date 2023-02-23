import * as Location from 'expo-location'

export default function useLocation() {
  const getLocationPermission = async() => {
    const {
      status,
      canAskAgain
    } = await Location.getForegroundPermissionsAsync()
    return { status, canAskAgain }
  }

  const askLocationPermission = async() => {
    let finalStatus = null
    let finalCanAskAgain = null
    const {
      status: currentStatus,
      canAskAgain: currentCanAskAgain
    } = await Location.getForegroundPermissionsAsync()
    finalStatus = currentStatus === 'granted' ? 'granted' : 'denied'
    finalCanAskAgain = currentCanAskAgain
    if (currentStatus === 'granted') {
      return { status: finalStatus, canAskAgain: finalCanAskAgain }
    }
    if (currentCanAskAgain) {
      const {
        status,
        canAskAgain
      } = await Location.requestForegroundPermissionsAsync()
      finalStatus = status === 'granted' ? 'granted' : 'denied'
      finalCanAskAgain = canAskAgain
      if (status === 'granted') {
        return { status: finalStatus, canAskAgain: finalCanAskAgain }
      }
    }
    return { status: finalStatus, canAskAgain: finalCanAskAgain }
  }

  const getCurrentLocation = async() => {
    const { status } = await askLocationPermission()
    if (status === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        })
        return { ...location, error: false }
      } catch (e) {
        return { error: true, message: e.message }
      }
    }
    return { error: true, message: 'Location permission was not granted' }
  }

  return { getCurrentLocation, getLocationPermission }
}
