import { useCallback, useContext, useRef, useState } from 'react'
import { LocationContext } from '../../context/Location'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import axios from 'axios'
import getEnvVars from '../../../environment'
import { useDebounce } from '../../ui/hooks/useDebounce'

const constants = getEnvVars()

const useSelectLocation = ({ navigation }) => {
  const mapRef = useRef()
  const [search, setSearch] = useState({ term: '', fetchPredictions: false })
  const [predictions, setPredictions] = useState([])
  const [showPredictions, setShowPredictions] = useState(true)
  const { location } = useContext(LocationContext)
  const [selectedLocation, setSelectedLocation] = useState(location)
  const onRegionChange = useCallback(region => {
    setSelectedLocation(region)
  }, [])
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const onConfirmLocation = useCallback(() => {
    navigation.navigate('NewAddress')
  }, [])
  const onChangeText = async() => {
    if (search.term.trim() === '') {
      setShowPredictions(false)
      return
    }
    if (!search.fetchPredictions) return
    const apiUrl = `${constants.GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${constants.GOOGLE_MAPS_KEY}&input=${search.term}`
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl
      })
      if (result) {
        const {
          data: { predictions }
        } = result
        setPredictions(predictions)
        setShowPredictions(true)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useDebounce(onChangeText, 1000, [search.term])
  const onPredictionTapped = async(placeId, description) => {
    const apiUrl = `${constants.GOOGLE_PACES_API_BASE_URL}/details/json?key=${constants.GOOGLE_MAPS_KEY}&place_id=${placeId}`
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl
      })
      if (result) {
        const {
          data: {
            result: {
              geometry: { location }
            }
          }
        } = result
        const { lat, lng } = location
        setSelectedLocation({
          latitude: lat,
          longitude: lng,
          deliveryAddress: description,
          label: 'Selected Location'
        })
        setShowPredictions(false)
        setSearch({ term: description })
        mapRef.current.fitToCoordinates([
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
        ])
      }
    } catch (e) {
      console.log(e)
    }
  }
  return {
    theme: currentTheme,
    selectedLocation,
    onRegionChange,
    onConfirmLocation,
    search,
    setSearch,
    onChangeText,
    showPredictions,
    predictions,
    onPredictionTapped,
    mapRef
  }
}
export default useSelectLocation
