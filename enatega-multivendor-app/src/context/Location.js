import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { cities } from '../apollo/queries'

const GET_CITIES = gql`
  ${cities}
`

export const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [country, setCountry] = useState('IL')
  const [cities, setCities] = useState([])
  const [loadingCountry, setLoadingCountry] = useState(true)
  const [errorCountry, setErrorCountry] = useState('')

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

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await axios.get('https://api.ipify.org/?format=json')
        const data = response.data

        const ipResponse = await axios.get(`https://ipinfo.io/${data.ip}/json`)
        const countryName = ipResponse.data.country // missing 'US'
        setCountry(countryName)
      } catch (error) {
        setErrorCountry(error.message)
        console.error('Error fetching user location:', error)
      } finally {
        setLoadingCountry(false)
      }
    }
    fetchCountry()
  }, [])

  const { loading, error, data } = useQuery(GET_CITIES, {
    variables: { iso: country || 'US' },
    skip: !country // Skip the query if country is not provided
  })
  //console.log('cities Data inside context', cities)
  // useEffect(() => {
  //   if (!loading && !error && data) {
  //     setCities(data.getCountryByIso.cities || [])
  //   }
  // }, [loading, error, data])
  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        cities: data?.getCountryByIso?.cities || []
      }}>
      {children}
    </LocationContext.Provider>
  )
}
