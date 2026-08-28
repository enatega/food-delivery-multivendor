import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps'
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'
import { scale } from '../../../../utils/scaling'
import { mapStyle } from '../../../../utils/mapStyle'
import darkMapStyle from '../../../../utils/DarkMapStyles'
import { decodePolyline, trimPolylineToRider } from '../../../../utils/polyline'

const DeliveryMap = ({
  riderLocation,
  customerLocation,
  restaurantLocation,
  encodedPolyline,
  showRoute = true,
  isPickUpOrder = false
}) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const isDarkTheme = themeContext.ThemeValue === 'Dark'
  const mapRef = useRef(null)

  const initialRegion = {
    latitude: customerLocation?.latitude ?? 25.2854,
    longitude: customerLocation?.longitude ?? 51.531,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  }

  const hasValidCoords = riderLocation?.latitude != null && riderLocation?.longitude != null && riderLocation.latitude !== '' && riderLocation.longitude !== ''

  const markerCoordinate = hasValidCoords
    ? {
        latitude: Number(riderLocation?.latitude),
        longitude: Number(riderLocation?.longitude)
      }
    : null
  const routeCoordinates = useMemo(
    () => trimPolylineToRider(decodePolyline(encodedPolyline), markerCoordinate),
    [encodedPolyline, markerCoordinate?.latitude, markerCoordinate?.longitude]
  )
  const displayedRouteCoordinates = routeCoordinates.length > 1
    ? routeCoordinates
    : [markerCoordinate, customerLocation].filter(Boolean)

  useEffect(() => {
    if (displayedRouteCoordinates.length > 1) {
      mapRef.current?.fitToCoordinates(displayedRouteCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true
      })
    }
  }, [routeCoordinates, markerCoordinate?.latitude, markerCoordinate?.longitude, customerLocation?.latitude, customerLocation?.longitude])

  return (
    <View style={styles().container}>
      <MapView
        ref={mapRef}
        style={styles().map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        customMapStyle={isDarkTheme ? darkMapStyle : mapStyle}
        userInterfaceStyle={isDarkTheme ? 'dark' : 'light'}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={false}
        legalLabelInsets={{ bottom: -100, right: -100 }}
      >
        {/* Customer Marker */}
        {customerLocation && (
          <Marker coordinate={customerLocation}>
            <View style={styles().customerMarker}>
              <Image
                source={require('../../../../singlevendor/assets/images/location-icon.png')}
                style={styles().customerIcon}
                resizeMode="contain"
              />
              <View style={styles(currentTheme).customerMarkerCircleWrapper}>
                <View style={styles(currentTheme).customerMarkerArea} />
                <View style={styles(currentTheme).customerMarkerCircle} />
              </View>
            </View>
          </Marker>
        )}

        {/* Rider Marker */}
        {markerCoordinate && <Marker coordinate={markerCoordinate}>
          <View style={styles().riderMarker}>
            <Image
              source={isPickUpOrder ? require('../../../../assets/images/location.png') : require('../../../assets/images/rider-icon.png')}
              style={styles().riderIcon}
              resizeMode="contain"
            />
          </View>
        </Marker>}

        {/* Route */}
        {showRoute && displayedRouteCoordinates.length > 1 && (
          <Polyline coordinates={displayedRouteCoordinates} strokeWidth={4} strokeColor={currentTheme.singleVendorBrandForeground || '#397A20'} />
        )}
      </MapView>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: scale(12),
      overflow: 'hidden'
    },
    map: {
      flex: 1,
      minHeight: scale(180)
    },
    customerMarker: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    customerIcon: {
      width: scale(42),
      height: scale(42),
      zIndex: 2
    },
    customerMarkerCircleWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: scale(-10)
    },
    customerMarkerCircle: {
      width: scale(18),
      height: scale(18),
      borderRadius: 50,
      backgroundColor: props?.singleVendorBrandForeground || '#397A20',
      borderWidth: 2,
      borderColor: '#fff',
      position: 'absolute',
      zIndex: 1,
      bottom: scale(-16)
    },
    customerMarkerArea: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(28),
      backgroundColor: props?.singleVendorBrandSubtle || '#F3FFEE',
      position: 'absolute',
      top: scale(-20)
    },
    riderMarker: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    riderIcon: {
      width: scale(32),
      height: scale(32)
    }
  })

export default DeliveryMap
