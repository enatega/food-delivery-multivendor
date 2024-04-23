import axios from 'axios'

// Function to fetch address from coordinates using the Google Maps Geocoding API
export async function fetchAddressFromCoordinates(latitude, longitude) {
  try {
    const apiKey = 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA'
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`
    )

    // Check if the response is successful and contains results
    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      // Extract the formatted address from the first result
      const formattedAddress = response.data.results[0].formatted_address

      // Extract the city from the address components
      const cityComponent = response.data.results[0].address_components.find(
        component =>
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_2')
      )
      const city = cityComponent ? cityComponent.long_name : null
      return { formattedAddress, city }
    } else {
      throw new Error('No address found for the given coordinates.')
    }
  } catch (error) {
    console.error('Error fetching address:', error.message)
    throw error
  }
}

// import axios from 'axios'

// // Function to fetch address from coordinates using the Google Maps Geocoding API
// export async function fetchAddressFromCoordinates(latitude, longitude) {
//   try {
//     const apiKey = 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA'
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//     )

//     // Check if the response is successful and contains results
//     if (
//       response.data &&
//       response.data.results &&
//       response.data.results.length > 0
//     ) {
//       console.log('city info', JSON.stringify(response.data.results, null, 2))
//       // Extract the formatted address from the first result
//       const formattedAddress = response.data.results[0].formatted_address
//       return formattedAddress
//     } else {
//       throw new Error('No address found for the given coordinates.')
//     }
//   } catch (error) {
//     console.error('Error fetching address:', error.message)
//     throw error
//   }
// }
