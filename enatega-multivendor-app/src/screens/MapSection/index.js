import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import { mapStyle } from '../../utils/mapStyle'
import styles from './styles'
import { Image } from 'react-native'
import { MapCallout } from './map.callout'
import { useNavigation } from '@react-navigation/native'

export default function MapSection({ location, restaurants }) {
  const navigation = useNavigation()
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
      customMapStyle={mapStyle}
      provider={PROVIDER_GOOGLE}>
      <Marker coordinate={location} title="Current Address">
        <Image source={require('../../assets/images/user.png')} width={20} />
      </Marker>
      {restaurants &&
        restaurants.map((rest, index) => {
          const coord = {
            latitude: parseFloat(rest.location.coordinates[1]),
            longitude: parseFloat(rest.location.coordinates[0])
          }
          return (
            <Marker coordinate={coord} key={index}>
              <Image
                source={require('../../assets/images/res.png')}
                width={20}
              />
              <Callout
                onPress={() => {
                  navigation.navigate('Restaurant', { ...rest })
                }}>
                <MapCallout rest={rest} />
              </Callout>
            </Marker>
          )
        })}
    </MapView>
  )
}
