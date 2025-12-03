import axios from 'axios'
import useEnvVars from '../../../environment'
import { extractCity, findBestResult } from '../../utils/customFunctions'

const useGeocoding = () => {
  const { GOOGLE_MAPS_KEY } = useEnvVars()

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_KEY}&language=en`
      )

      // Check if the response is successful and contains results
      if (
        response.data.status === 'OK' && response.data.results.length > 0
      ) {
        const bestResult = findBestResult(response.data.results)

        if (!bestResult) {
          throw new Error('No valid address found')
        }
        // Extract the formatted address from the first result
        const formattedAddress = bestResult.formatted_address || 'Address not available'

        // Extract the city from the address components
        const city = extractCity(bestResult.address_components)

        console.log('✅ Extracted address:', {
          formattedAddress,
          city,
          resultType: bestResult.types?.[0]
        })

        return { formattedAddress, city }

      } else {
        throw new Error('No address found for the given coordinates.')
      }
    } catch (error) {
      console.error('Error fetching address:', error.message)
      throw error
    }
  }
  return { getAddress }
}

export default useGeocoding
