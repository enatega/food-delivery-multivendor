import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { getZones } from '../apollo/queries'
import NetInfo from '@react-native-community/netinfo'
import { useLocation } from '../ui/hooks'

// import * as Network from 'expo-network';

const GET_ZONES = gql`
  ${getZones}
`
export const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [cities, setCities] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const { loading, error, data, refetch } = useQuery(GET_ZONES)
  const { getCurrentLocation, getLocationPermission } = useLocation()

  useEffect(() => {
    async function initLocation() {
      try {
        const locationStr = await AsyncStorage.getItem('location')
        if (locationStr) {
          const storedLocation = JSON.parse(locationStr)
          setLocation(storedLocation)
          return
        }

        const { status } = await getLocationPermission()
        if (status !== 'granted') {
          return
        }

        const { error, coords } = await getCurrentLocation()
        if (error) {
          return
        }

        const userLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude
        }

        const response = await getAddress(userLocation.latitude, userLocation.longitude)

        const locationData = {
          label: 'Location',
          deliveryAddress: response.formattedAddress,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          city: response.city
        }

        setLocation(locationData)
        await AsyncStorage.setItem('location', JSON.stringify(locationData))
      } catch (err) {
        // Error silently ignored or optionally handle error silently here
      }
    }

    initLocation()
  }, [])

  useEffect(() => {
    if (location) {
      const saveLocation = async () => {
        await AsyncStorage.setItem('location', JSON.stringify(location))
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

  // show zones as cities
  useEffect(() => {
    if (!loading && !error && data) {
      const fetchedZones = data.zones || []

      // Function to calculate centroid of a polygon
      const calculateCentroid = (coordinates) => {
        let x = 0,
          y = 0,
          area = 0

        const points = coordinates[0] // Assuming the first array contains the coordinates

        for (let i = 0; i < points?.length - 1; i++) {
          const x0 = points[i][0]
          const y0 = points[i][1]
          const x1 = points[i + 1][0]
          const y1 = points[i + 1][1]
          const a = x0 * y1 - x1 * y0
          area += a
          x += (x0 + x1) * a
          y += (y0 + y1) * a
        }

        area /= 2
        x = x / (6 * area)
        y = y / (6 * area)

        return { latitude: y, longitude: x }
      }

      // Calculate centroids for each zone
      const centroids = fetchedZones.map((zone) => {
        const centroid = calculateCentroid(zone.location.coordinates)
        return {
          id: zone._id,
          name: zone.title,
          ...centroid,
          location: zone.location
        }
      })

      // Set this as the cities or the midpoint
      setCities(centroids)
    }
  }, [loading, error, data])
  useEffect(() => {
    if (isConnected) {
      refetch() // Refetch the data when the internet is back
    }
  }, [isConnected, refetch])
  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        cities,
        loading,
        isConnected
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}
