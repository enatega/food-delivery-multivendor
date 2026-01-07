import { useContext, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createAddress, editAddress } from '../../../apollo/mutations'
import { LocationContext } from '../../../context/Location'
import gql from 'graphql-tag'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import { useMutation } from '@apollo/client'
import useEnvVars from '../../../../environment'
import axios from 'axios'
import { useLocation } from '../../../ui/hooks'
import useGeocoding from '../../../ui/hooks/useGeocoding'
import { useDebounce } from '../../../utils/useDebounce'
import { useNavigation } from '@react-navigation/native'

const CREATE_ADDRESS = gql`
  ${createAddress}
`

const EDIT_ADDRESS = gql`
  ${editAddress}
`

const useAddAddress = () => {
  const { t, i18n } = useTranslation()
  const insets = useSafeAreaInsets()
  const themeContext = useContext(ThemeContext)
  const { setLocation } = useContext(LocationContext)
  const navigation = useNavigation()
  const { GOOGLE_MAPS_KEY } = useEnvVars()
  const { getCurrentLocation } = useLocation()
  const { getAddress } = useGeocoding()
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])

  // Map constants
  const DEFAULT_LATITUDE = 33.95
  const DEFAULT_LONGITUDE = 73.56
  const LATITUDE_DELTA = 0.035
  const LONGITUDE_DELTA = 0.035

  // Existing states
  const [activeState, setactiveState] = useState('searching')
  const [addressDetail, setAddressDetail] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [editingAddress, seteditingAddress] = useState(null)
  const [selectedAddressCoordinates, setSelectedAddressCoordinates] = useState({
    lat: null,
    lng: null
  })
  const [loading, setLoading] = useState(false)
  const [otherAddressDetails, setOtherAddressDetails] = useState(null)

  // Search-related states
  const [searchText, setSearchText] = useState('')
  const [predictions, setPredictions] = useState([])
  const [searchError, setSearchError] = useState(null)
  const [isSearched, setisSearched] = useState(false)

  // Map-related states
  const [initialLocation, setInitialLocation] = useState({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latDelta: LATITUDE_DELTA,
    lngDelta: LONGITUDE_DELTA
  })

  // Refs
  const debounceTimerRef = useRef(null)
  const requestCancelTokenRef = useRef(null)
  const mapRef = useRef(null)

  const [mutate, { loading: mutateLoading }] = useMutation(editingAddress ? EDIT_ADDRESS : CREATE_ADDRESS, {
    onCompleted,
    onError
  })

  function onCompleted({ createAddress, editAddress }) {
    FlashMessage({
      message: t('Address Created')
    })

    const address = (createAddress || editAddress)?.addresses.find((a) => a.selected) || console.log('here in address')
    setLocation({
      _id: address._id,
      label: selectedType,
      deliveryAddress: addressDetail,
      latitude: selectedAddressCoordinates?.lat,
      longitude: selectedAddressCoordinates?.lng
    })

    navigation.goBack()
  }

  function onError(error) {
    FlashMessage({
      message: `${t('errorOccured')} ${error.message}`
    })
  }

  // Map functions
  const updateAddress = useCallback(
    (result) => {
      console.log('🚀 ~ useAddAddress ~ result:', result)
      if (result?.formattedAddress) {
        setAddressDetail(result.formattedAddress)
      }
    },
    [setAddressDetail]
  )

  const debouncedFetchAddress = useDebounce(async (lat, lng) => {
    try {
      const response = await getAddress(lat, lng)
      updateAddress(response)
    } catch (error) {
      console.error('Geocoding error:', error)
    } finally {
      setLoading(false)
    }
  }, 1500)

  const onRegionChangeComplete = useCallback(
    async (region) => {
      setLoading(true)
      setInitialLocation({
        latitude: region?.latitude,
        longitude: region?.longitude,
        latDelta: region?.latitudeDelta,
        lngDelta: region?.longitudeDelta
      })
      setSelectedAddressCoordinates({
        lat: region?.latitude,
        lng: region?.longitude
      })
      debouncedFetchAddress(region?.latitude, region?.longitude)
    },
    [debouncedFetchAddress]
  )

  const setCurrentLocation = useCallback(async () => {
    try {
      const { coords, error } = await getCurrentLocation()
      if (!error && coords) {
        setInitialLocation({
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          latDelta: LATITUDE_DELTA,
          lngDelta: LONGITUDE_DELTA
        })
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            },
            1000
          )
        }
      } else {
        Alert.alert(t('locationError'), t('unableToGetLocation'), [{ text: t('ok') }])
      }
    } catch (error) {
      console.error('Error setting current location:', error)
      Alert.alert(t('locationError'), t('unableToGetLocation'), [{ text: t('ok') }])
    }
  }, [getCurrentLocation, t])

  // Search places function
  const searchPlaces = useCallback(
    async (query) => {
      console.log('🔍 SearchModal: searchPlaces called with query:', query)

      if (!query || query.length < 2) {
        setPredictions([])
        setLoading(false)
        setSearchError(null)
        return
      }

      if (!GOOGLE_MAPS_KEY) {
        console.error('❌ GOOGLE_MAPS_KEY is missing!')
        setSearchError('Google Maps API key is not configured')
        setLoading(false)
        return
      }

      // Cancel previous request if exists
      if (requestCancelTokenRef.current) {
        requestCancelTokenRef.current.cancel('New search initiated')
      }

      // Create new cancel token
      const cancelToken = axios.CancelToken.source()
      requestCancelTokenRef.current = cancelToken

      setLoading(true)
      setSearchError(null)

      try {
        console.log('🌐 Making API request for query:', query)

        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input: query,
            key: GOOGLE_MAPS_KEY,
            language: 'en',
            types: 'geocode'
          },
          timeout: 10000,
          cancelToken: cancelToken.token
        })

        console.log('📍 API Response status:', response.data.status)

        if (response.data.status === 'OK') {
          const formattedPredictions = response.data.predictions.map((prediction) => {
            console.log('🚀 ~ SearchingAddress ~ prediction:', JSON.stringify(prediction, null, 2))
            return {
              id: prediction.place_id,
              description: prediction.description,
              placeId: prediction.place_id,
              mainText: prediction.structured_formatting?.main_text || prediction.description,
              secondaryText: prediction.structured_formatting?.secondary_text || ''
            }
          })

          console.log('✅ Found predictions:', formattedPredictions.length)
          setPredictions(formattedPredictions)
          setSearchError(null)
        } else if (response.data.status === 'ZERO_RESULTS') {
          console.log('🔍 No results found for query:', query)
          setPredictions([])
          setSearchError(null)
        } else {
          console.error('❌ API Error:', response.data.status, response.data.error_message)
          setPredictions([])
          setSearchError(response.data.error_message || 'Search failed')

          if (response.data.status === 'REQUEST_DENIED') {
            Alert.alert('API Error', 'Google Places API access denied. Please check your API key configuration.')
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('🔄 Request cancelled:', error.message)
          return
        }

        console.error('🚨 Error searching places:', error)
        setPredictions([])

        if (error.code === 'ECONNABORTED') {
          setSearchError('Request timed out')
        } else if (error.response) {
          console.error('API Error Response:', error.response.data)
          setSearchError('Search service unavailable')
        } else if (error.request) {
          setSearchError('Network error - check your connection')
        } else {
          setSearchError('Search failed')
        }
      } finally {
        setisSearched(true)
        setLoading(false)
        if (requestCancelTokenRef.current === cancelToken) {
          requestCancelTokenRef.current = null
        }
      }
    },
    [GOOGLE_MAPS_KEY]
  )

  // Handle text change with debounce
  const handleTextChange = useCallback(
    (text) => {
      console.log('⌨️ Text changed:', text)
      setSearchText(text)

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        searchPlaces(text)
      }, 1000)
    },
    [searchPlaces]
  )

  // Get place details
  const getPlaceDetails = useCallback(
    async (placeId) => {
      console.log('📍 Getting place details for placeId:', placeId)

      if (!GOOGLE_MAPS_KEY) {
        console.error('❌ GOOGLE_MAPS_KEY is missing!')
        return null
      }

      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_KEY,
            fields: 'geometry,formatted_address,name'
          },
          timeout: 10000
        })

        if (response.data.status === 'OK' && response.data.result) {
          const result = response.data.result
          console.log('✅ Got place details successfully')

          return {
            geometry: {
              location: {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng
              }
            },
            formatted_address: result.formatted_address,
            name: result.name
          }
        } else {
          console.error('❌ Place details error:', response.data.status)
          return null
        }
      } catch (error) {
        console.error('🚨 Error getting place details:', error)
        return null
      }
    },
    [GOOGLE_MAPS_KEY]
  )

  // Handle place selection
  const handlePlaceSelect = useCallback(
    async (place) => {
      setLoading(true)

      try {
        const details = await getPlaceDetails(place.placeId)

        if (details && details.geometry && details.geometry.location) {
          setAddressDetail(details?.formatted_address)
          setSelectedAddressCoordinates({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng
          })
          setactiveState('searched')
          console.log('🚀 ~ SearchingAddress ~ details?.geometry:', details?.geometry)
          console.log('✅ Successfully got place coordinates:', details.geometry.location)
        } else {
          console.error('❌ Failed to get place coordinates')
          Alert.alert('Error', 'Unable to get coordinates for this location')
          setLoading(false)
        }
      } catch (error) {
        console.error('🚨 Error handling place selection:', error)
        Alert.alert('Error', 'Unable to select this location')
        setLoading(false)
      }
      setLoading(false)
    },
    [getPlaceDetails, setAddressDetail, setSelectedAddressCoordinates, setactiveState]
  )

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchText('')
    setPredictions([])
    setSearchError(null)
  }, [])

  const confirmationButtonHandler = () => {
    if (activeState === 'map') {
      setactiveState('searched')
      return
    }
    if (!selectedType) {
      Alert.alert('Alert', t('alertLocation'))
      return
    }

    const addressInput = {
      longitude: `${selectedAddressCoordinates.lng}`,
      latitude: `${selectedAddressCoordinates.lat}`,
      deliveryAddress: addressDetail,
      details: otherAddressDetails ?? addressDetail,
      label: selectedType
    }
    if (editingAddress) {
      addressInput._id = editingAddress
    }

    mutate({ variables: { addressInput } })
  }

  // Initialize current location on mount
  useEffect(() => {
    if (activeState === 'map') {
      setCurrentLocation()
    }
  }, [activeState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (requestCancelTokenRef.current) {
        requestCancelTokenRef.current.cancel('Component unmounted')
      }
    }
  }, [])

  return {
    t,
    i18n,
    themeContext,
    currentTheme,
    activeState,
    setactiveState,
    addressDetail,
    setAddressDetail,
    insets,
    confirmationButtonHandler,
    selectedType,
    setSelectedType,
    selectedAddressCoordinates,
    setSelectedAddressCoordinates,
    seteditingAddress,
    loading: loading || mutateLoading,
    setLoading,
    // Search-related exports
    searchText,
    setSearchText,
    predictions,
    searchError,
    handleTextChange,
    handlePlaceSelect,
    handleClearSearch,
    isSearched,
    // Map-related exports
    mapRef,
    initialLocation,
    setInitialLocation,
    onRegionChangeComplete,
    setCurrentLocation,
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
    otherAddressDetails,
    setOtherAddressDetails
  }
}

export default useAddAddress
