import React, { createContext, useState, useEffect, useMemo, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { getZones } from '../apollo/queries'
import NetInfo from '@react-native-community/netinfo'
import ConfigurationContext from './Configuration'
import { buildDemoLocationFromZone, calculateZoneCentroid } from '../utils/demoLocation'
// import * as Network from 'expo-network';

const GET_ZONES = gql`
  ${getZones}
`
export const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const configuration = useContext(ConfigurationContext)
  const [location, setLocation] = useState(null)
  const [isLocationLoaded, setIsLocationLoaded] = useState(false)
  const [cities, setCities] = useState([])
  const [permissionState, setPermissionState] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const {
    loading: zonesLoading,
    error,
    data,
    refetch
  } = useQuery(GET_ZONES)
  const enableCustomerDemoMode = !!configuration?.enableCustomerDemoMode
  const customerDemoZoneId = configuration?.customerDemoZoneId
  const isConfigurationLoaded = configuration?.isConfigurationLoaded

  const sanitizeLocationForStorage = (value) => {
    if (!value) return value

    const latitude = Number(value.latitude)
    const longitude = Number(value.longitude)

    return {
      ...value,
      latitude: Number.isFinite(latitude) ? Number(latitude.toFixed(4)) : value.latitude,
      longitude: Number.isFinite(longitude) ? Number(longitude.toFixed(4)) : value.longitude
    }
  }

  useEffect(() => {
    if (location) {
      const saveLocation = async () => {
        await AsyncStorage.setItem('location', JSON.stringify(sanitizeLocationForStorage(location)))
      }

      saveLocation()
    }
  }, [location])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected) // Update connectivity status
    })

    return () => unsubscribe() // Clean up the listener
  }, [])

  useEffect(() => {
    const loadInitialLocation = async () => {
      if (!isConfigurationLoaded) return
      if (enableCustomerDemoMode && zonesLoading) return

      try {
        const locationStr = await AsyncStorage.getItem('location')
        const storedLocation = locationStr ? JSON.parse(locationStr) : null

        if (enableCustomerDemoMode) {
          const demoZone = data?.zones?.find((zone) => zone?._id === customerDemoZoneId)
          const demoLocation = buildDemoLocationFromZone(demoZone)

          if (demoLocation) {
            setLocation(demoLocation)
            return
          }
        }

        if (storedLocation?.isDemoDefaultLocation && !enableCustomerDemoMode) {
          await AsyncStorage.removeItem('location')
          setLocation(null)
          return
        }

        if (storedLocation) {
          setLocation(storedLocation)
        } else {
          setLocation(null)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setIsLocationLoaded(true)
      }
    }

    loadInitialLocation()
  }, [isConfigurationLoaded, enableCustomerDemoMode, zonesLoading, data?.zones, customerDemoZoneId])

  // show zones as cities
  useEffect(() => {
    if (!zonesLoading && !error && data) {
      const fetchedZones = data.zones || []

      // Calculate centroids for each zone
      const centroids = fetchedZones.map((zone) => {
        const centroid = calculateZoneCentroid(zone.location.coordinates)
        return {
          id: zone._id,
          name: zone.title,
          latitude: centroid?.latitude,
          longitude: centroid?.longitude,
          location: zone.location
        }
      })

      // Set this as the cities or the midpoint
      setCities(centroids)
    }
  }, [zonesLoading, error, data])
  useEffect(() => {
    if (isConnected) {
      refetch() // Refetch the data when the internet is back
    }
  }, [isConnected, refetch])

  const locationContextValue = useMemo(() => ({
    location,
    setLocation,
    isLocationLoaded,
    cities,
    loading: zonesLoading,
    isConnected,
    permissionState,
    setPermissionState
  }), [location, isLocationLoaded, cities, zonesLoading, isConnected, permissionState])

  return (
    <LocationContext.Provider value={locationContextValue}>
      {children}
    </LocationContext.Provider>
  )
}
