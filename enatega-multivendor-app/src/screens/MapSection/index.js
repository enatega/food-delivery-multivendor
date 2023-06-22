import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { MapStyles } from '../../utils/mapStyle'
import styles from './styles'
import { Image } from 'react-native'

export default function MapSection({ location, restaurants }) {
  return (
    <MapView
      style={styles().map}
      showsUserLocation
      zoomEnabled={true}
      zoomControlEnabled={true}
      rotateEnabled={false}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
      customMapStyle={MapStyles}
      provider={PROVIDER_GOOGLE}>
      <Marker coordinate={location} title="Current Address">
        <Image
          source={require('../../assets/images/user.png')}
          width={20}
        />
      </Marker>
      {restaurants &&
        restaurants.map((rest, index) => {
          const coord = {
            latitude: parseFloat(rest.location.coordinates[0]),
            longitude: parseFloat(rest.location.coordinates[1])
          }
          return (
            <Marker coordinate={coord} title={rest.name} key={index}>
              <Image
                source={require('../../assets/images/res.png')}
                width={20}
              />
            </Marker>
          )
        })}
    </MapView>
  )
}
