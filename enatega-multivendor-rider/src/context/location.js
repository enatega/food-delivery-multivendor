import React, { useState, useEffect, useContext, useRef } from 'react'
import * as Location from 'expo-location'
import { LocationAccuracy } from 'expo-location'

const locationContext = React.createContext({
  locationPermission: false,
  setLocationPermission: () => {}
})

export const LocationProvider = ({ children }) => {
  const locationListener = useRef(null)
  const [locationPermission, setLocationPermission] = useState(false)
  const [location, setLocation] = useState(null)

  const getLocationPermission = async() => {
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status === 'granted') {
      setLocationPermission(true)
    }
    const currentLocation = await Location.getCurrentPositionAsync({})
    setLocation(currentLocation.coords)
  }

  useEffect(() => {
    getLocationPermission()
  }, [])

  useEffect(() => {
    if (!locationPermission) return
    const trackRiderLocation = async() => {
      locationListener.current = await Location.watchPositionAsync(
        { accuracy: LocationAccuracy.BestForNavigation, timeInterval: 10000 },
        location => {
          setLocation({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString()
          })
        }
      )
    }
    trackRiderLocation()
    return () => {
      locationListener.current && locationListener.current.remove()
    }
  }, [locationPermission])
  return (
    <locationContext.Provider
      value={{ locationPermission, setLocationPermission, location }}>
      {children}
    </locationContext.Provider>
  )
}

export const LocationConsumer = locationContext.Consumer
export const useLocationContext = () => useContext(locationContext)
export default locationContext
