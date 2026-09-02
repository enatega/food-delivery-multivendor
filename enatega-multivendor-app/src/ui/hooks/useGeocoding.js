import useEnvVars from '../../../environment'
import { fetchReverseGeocode } from '../../api/googleMapsProxy'

const useGeocoding = () => {
  const { SERVER_REST_URL } = useEnvVars()

  const getAddress = async (latitude, longitude) => {
    try {

      console.log(`Fetching address for coordinates: (${latitude}, ${longitude})`)
      const data = await fetchReverseGeocode({
        baseUrl: SERVER_REST_URL,
        latitude,
        longitude,
        language: 'en'
      }).catch((error) => {
        console.error('Error fetching reverse geocode data:', error)
        throw error
      })
      console.log('Reverse geocode data:', data)
      if (data?.status === 'OK' && data?.formattedAddress) {
        return {
          formattedAddress: data.formattedAddress,
          city: data.city
        }
      }

      if (data?.status === 'ZERO_RESULTS') {
        throw new Error('No address found for the given coordinates.')
      }

      throw new Error(data?.errorMessage || 'Unable to fetch address.')
    } catch (error) {
      console.error('Error fetching address:', error.message)
      throw error
    }
  }
  return {getAddress}
}

export default useGeocoding
