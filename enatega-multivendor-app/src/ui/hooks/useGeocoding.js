import axios from 'axios'
import useEnvVars from '../../../environment'

const useGeocoding = () => {
  const { GOOGLE_MAPS_KEY } = useEnvVars()

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_KEY}&language=en`
      )

      // Check if the response is successful and contains results
      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        // Extract the formatted address from the first result
        const formattedAddress = response.data.results[0].formatted_address
        // Search through all results to find the best city match
        let city = null

        for (const result of response.data.results) {
          const cityComponent = result.address_components.find((component) => component.types.includes('locality') || component.types.includes('administrative_area_level_2') || component.types.includes('administrative_area_level_1'))

          if (cityComponent) {
            city = cityComponent.long_name
            break
          }
        }
        return { formattedAddress, city }
        
      } else {
        throw new Error('No address found for the given coordinates.')
      }
    } catch (error) {
      console.error('Error fetching address:', error.message)
      throw error
    }
  }
  return {getAddress}
}

export default useGeocoding
