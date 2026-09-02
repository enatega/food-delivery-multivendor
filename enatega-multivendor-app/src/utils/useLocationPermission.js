import { useCallback, useState } from 'react'
import * as Location from 'expo-location'

const useLocationPermission = () => {
  const [isLoading, setIsLoading] = useState(false)

  const requestPermission = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await Location.requestForegroundPermissionsAsync()
      return {
        canAskAgain: result.canAskAgain ?? true,
        granted: result.status === Location.PermissionStatus.GRANTED,
        status: result.status
      }
    } catch (error) {
      return {
        canAskAgain: false,
        error: error?.message,
        granted: false,
        status: 'error'
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, requestPermission }
}

export default useLocationPermission

