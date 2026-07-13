import { useState, useEffect, useCallback, useContext } from 'react'
import { Alert, Linking, Platform } from 'react-native'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocation } from '../ui/hooks'
import useGeocoding from '../ui/hooks/useGeocoding'
import { checkLocationInCities } from '../utils/locationUtil'
import { LocationContext } from '../context/Location'

const useLocationPermission = (options = {}) => {
  const { autoStart = true, cities = [], onLocationUpdate, onPermissionUpdate } = options

  const [state, setState] = useState({
    isLoading: false,
    isPermissionGranted: false,
    permissionStatus: null,
    canAskAgain: true,
    currentLocation: null,
    error: null
  })

  const { setLocation } = useContext(LocationContext)

  const { getAddress } = useGeocoding()
  const { getCurrentLocation: fetchCurrentLocation } = useLocation()

  /**
   * Request location permission from user
   */
  const requestPermission = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if the function exists
      if (!Location.requestForegroundPermissionsAsync) {
        throw new Error('Location.requestForegroundPermissionsAsync is not available')
      }

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync()
      console.log('🚀 ~ useLocationPermission ~ status:', status)

      const permissionGranted = status === 'granted'
      const permissionState = {
        granted: permissionGranted,
        status,
        canAskAgain: canAskAgain ?? true
      }

      setState((prev) => ({
        ...prev,
        isPermissionGranted: permissionGranted,
        permissionStatus: status,
        canAskAgain: canAskAgain ?? true,
        isLoading: false
      }))

      onPermissionUpdate?.(permissionState)

      if (permissionGranted) {
        // const location = await fetchAndSaveCurrentLocation()
        return { ...permissionState }
      }

      return permissionState
    } catch (error) {
      console.error('Permission request error:', error)
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false
      }))
      return {
        granted: false,
        status: 'error',
        canAskAgain: false,
        error: error.message
      }
    }
  }, [onPermissionUpdate])

  /**
   * Get current location and save it
   */
  const fetchAndSaveCurrentLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Get current position
      const location = await fetchCurrentLocation()

      if (location.error) {
        throw new Error(location.error)
      }

      const { latitude, longitude } = location.coords

      // Get address from coordinates
      const addressResponse = await getAddress(latitude, longitude)
      console.log('🚀 ~ useLocationPermission ~ addressResponse:', addressResponse)
      setLocation({
        label: 'Location',
        deliveryAddress: addressResponse.formattedAddress,
        latitude: latitude,
        longitude: longitude,
        city: addressResponse.city
      })
      // Check if location is within serviceable cities
      const filteredCities = cities.filter((city) => !isNaN(city.latitude) && !isNaN(city.longitude))
      const matchingCity = checkLocationInCities({ latitude, longitude }, filteredCities)

      // Prepare location data
      const locationData = {
        label: 'Location',
        deliveryAddress: addressResponse?.formattedAddress || 'Current Location',
        latitude,
        longitude,
        city: addressResponse?.city || matchingCity?.name,
        isWithinServiceArea: !!matchingCity
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('location', JSON.stringify(locationData))

      // Update state
      setState((prev) => ({
        ...prev,
        currentLocation: locationData,
        isLoading: false
      }))

      // Call callback
      onLocationUpdate?.(locationData)

      return locationData
    } catch (error) {
      console.error('Error fetching location:', error)
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false
      }))
      return null
    }
  }, [cities, fetchCurrentLocation, getAddress, onLocationUpdate])

  /**
   * Handle permission denied scenario
   */
  const handlePermanentDenial = useCallback(() => {
    Alert.alert('Location Access Required', 'Location permission is permanently denied. Please enable it in settings to use location-based features.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => {
          Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings()
        }
      }
    ])
  }, [])

  /**
   * Complete location initialization process
   */
  const initializeLocation = useCallback(async () => {
    const permissionResult = await requestPermission()

    if (!permissionResult.granted && !permissionResult.canAskAgain) {
      handlePermanentDenial()
    }

    return permissionResult
  }, [requestPermission, handlePermanentDenial])

  /**
   * Check existing permission status
   */
  const checkExistingPermission = useCallback(async () => {
    try {
      // Check if Location.getForegroundPermissionsAsync exists
      if (!Location.getForegroundPermissionsAsync) {
        console.error('Location.getForegroundPermissionsAsync is not available')
        return null
      }

      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync()

      const permissionState = {
        granted: status === 'granted',
        status,
        canAskAgain: canAskAgain ?? true
      }

      setState((prev) => ({
        ...prev,
        isPermissionGranted: status === 'granted',
        permissionStatus: status,
        canAskAgain: canAskAgain ?? true
      }))

      return permissionState
    } catch (error) {
      console.error('Error checking permission:', error)
      return null
    }
  }, [])

  /**
   * Get location without requesting permission (if already granted)
   */
  const getLocationOnly = useCallback(async () => {
    if (!state.isPermissionGranted) {
      console.warn('Location permission not granted')
      return null
    }

    return await fetchAndSaveCurrentLocation()
  }, [state.isPermissionGranted, fetchAndSaveCurrentLocation])

  /**
   * Manually trigger location update
   */
  const refreshLocation = useCallback(async () => {
    if (state.isPermissionGranted) {
      return await fetchAndSaveCurrentLocation()
    }
    return await initializeLocation()
  }, [state.isPermissionGranted, fetchAndSaveCurrentLocation, initializeLocation])

  // Auto-start on mount if enabled
  useEffect(() => {
    if (autoStart) {
      const init = async () => {
        await checkExistingPermission()
        if (state.isPermissionGranted) {
          await fetchAndSaveCurrentLocation()
        }
      }
      init()
    }
  }, [autoStart])

  return {
    // State
    isLoading: state.isLoading,
    isPermissionGranted: state.isPermissionGranted,
    permissionStatus: state.permissionStatus,
    canAskAgain: state.canAskAgain,
    currentLocation: state.currentLocation,
    error: state.error,

    // Methods
    requestPermission,
    fetchAndSaveCurrentLocation,
    initializeLocation,
    checkExistingPermission,
    getLocationOnly,
    refreshLocation,
    handlePermanentDenial
  }
}

export default useLocationPermission
