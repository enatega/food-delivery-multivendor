import React from 'react'
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps'
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
        provider={PROVIDER_DEFAULT}
        showsTraffic={false}
        maxZoomLevel={16}
        customMapStyle={customMapStyle}
        onRegionChangeComplete={onRegionChangeComplete}
        showsBuildings={true}
        showsScale={true}
        showsPointsOfInterest={true}
        showsIndoor={true}
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