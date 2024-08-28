import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useJsApiLoader } from '@react-google-maps/api'

const GoogleMapsLoader = ({ children, GOOGLE_MAPS_KEY }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_KEY,
    libraries: [
      'drawing',
      'places',
      'geometry',
      'localContext',
      'visualization'
    ]
  })

  if (!isLoaded) {
    return (
      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw">
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return <>{children}</>
}
export default GoogleMapsLoader
