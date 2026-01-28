import React, { useContext, useRef } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import ThemeContext from '../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../utils/themeColors'
import { scale } from '../../../../utils/scaling'
import { mapStyle } from '../../../../utils/mapStyle'
import useEnvVars from '../../../../../environment'

const DeliveryMap = ({ 
  riderLocation,
  customerLocation,
  restaurantLocation,
  showRoute = true
}) => {
  const { GOOGLE_MAPS_KEY } = useEnvVars();
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: customerLocation?.latitude ?? 25.2854,
    longitude: customerLocation?.longitude ?? 51.531,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  }

  const fitToMarkers = (coordinates) => {
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    })
  }

  const DEFAULT_COORDINATE = {
    latitude: 0,
    longitude: 0
  }

  const hasValidCoords = riderLocation?.latitude != null && riderLocation?.longitude != null && riderLocation.latitude !== '' && riderLocation.longitude !== ''

  const markerCoordinate = hasValidCoords
    ? {
        latitude: Number(riderLocation?.latitude),
        longitude: Number(riderLocation?.longitude)
      }
    : DEFAULT_COORDINATE
  const markerOpacity = hasValidCoords ? 1 : 0

  return (
    <View style={styles().container}>
      <MapView
        ref={mapRef}
        style={styles().map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
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
        <Marker coordinate={markerCoordinate}>
          <View style={[styles().riderMarker, { opacity: markerOpacity }]}>
            <Image
              source={require('../../../assets/images/rider-icon.png')}
              style={styles().riderIcon}
              resizeMode="contain"
            />
          </View>
        </Marker>

        {/* Route */}
        {showRoute && riderLocation && customerLocation && GOOGLE_MAPS_KEY && (
          <MapViewDirections
            origin={riderLocation}
            destination={customerLocation}
            apikey={GOOGLE_MAPS_KEY}
            strokeWidth={4}
            strokeColor={currentTheme.headerMainFontColor || '#006189'}
            optimizeWaypoints={true}
            onReady={(result) => fitToMarkers(result.coordinates)}
          />
        )}
      </MapView>
    </View>
  );
};

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
      backgroundColor: props?.headerMainFontColor || '#006189',
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
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
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
  });

export default DeliveryMap;
