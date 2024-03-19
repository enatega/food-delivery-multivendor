import React from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

const CustomMapView = React.memo(
  React.forwardRef(function CustomMapView(
    { initialRegion, customMapStyle, onRegionChangeComplete },
    ref
  ) {
    return (
      <MapView
        ref={ref}
        initialRegion={initialRegion}
        region={initialRegion}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsTraffic={false}
        maxZoomLevel={15}
        customMapStyle={customMapStyle}
        onRegionChangeComplete={onRegionChangeComplete}
      />
    )
  }),
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.initialRegion) ===
      JSON.stringify(nextProps.initialRegion)
    )
  }
)

export default CustomMapView
