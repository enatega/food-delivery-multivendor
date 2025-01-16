import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { getZones } from '../apollo/queries'


const GET_ZONES = gql`
  ${getZones}
  `
export const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [cities, setCities] = useState([])
  const { loading, error, data } = useQuery(GET_ZONES)

  useEffect(() => {
    const getActiveLocation = async () => {
      try {
        const locationStr = await AsyncStorage.getItem('location')
        if (locationStr) {
          setLocation(JSON.parse(locationStr))
        }
      } catch (err) {
        console.log(err)
      }
    }

    getActiveLocation()
  }, [])

  useEffect(() => {
    if (location) {
      const saveLocation = async () => {
        await AsyncStorage.setItem('location', JSON.stringify(location))
      }

      saveLocation()
    }
  }, [location])

  // show zones as cities
  useEffect(() => {
    if (!loading && !error && data) {
      const fetchedZones = data.zones || [];

      // Function to calculate centroid of a polygon
      const calculateCentroid = (coordinates) => {
        let x = 0, y = 0, area = 0;

        const points = coordinates[0]; // Assuming the first array contains the coordinates

        for (let i = 0; i < points?.length - 1; i++) {
          const x0 = points[i][0];
          const y0 = points[i][1];
          const x1 = points[i + 1][0];
          const y1 = points[i + 1][1];
          const a = x0 * y1 - x1 * y0;
          area += a;
          x += (x0 + x1) * a;
          y += (y0 + y1) * a;
        }

        area /= 2;
        x = x / (6 * area);
        y = y / (6 * area);

        return { latitude: y, longitude: x };
      };

      // Calculate centroids for each zone
      const centroids = fetchedZones.map(zone => {
        const centroid = calculateCentroid(zone.location.coordinates);
        return {
          id: zone._id,
          name: zone.title,
          ...centroid,
          location: zone.location
        };
      });

      // Calculate the average of the centroids to find the midpoint
      const averageLatitude = centroids.reduce((sum, point) => sum + point.latitude, 0) / centroids?.length;
      const averageLongitude = centroids.reduce((sum, point) => sum + point.longitude, 0) / centroids?.length;

      // Set this as the cities or the midpoint depending on your need
      setCities(centroids);

      // Optionally, you can also save this midpoint as location
      setLocation({ latitude: averageLatitude, longitude: averageLongitude });
    }
  }, [loading, error, data]);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        cities,
        loading
      }}>
      {children}
    </LocationContext.Provider>
  )
}
