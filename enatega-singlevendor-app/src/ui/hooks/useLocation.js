import * as Location from 'expo-location'
import { getLocationFromStorage } from './useWatchLocation'

export default function useLocation() {
  const getLocationPermission = async () => {
    const {
      status,
      canAskAgain
    } = await Location.getForegroundPermissionsAsync()
    return { status, canAskAgain }
  }

  const askLocationPermission = async () => {
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

  const getCurrentLocation = async () => {
    const location = await getLocationFromStorage()
    if (location) return { coords: location }
    const { status } = await askLocationPermission()

    
    if (status === 'granted') {
      try {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        })
        return { ...location, error: false }
      } catch (e) {
        console.log("location error", e)
        return { error: true, message: e.message }
      }
    }
    return { error: true, message: 'Location permission was not granted' }
  }

  return { getCurrentLocation, getLocationPermission }
}
