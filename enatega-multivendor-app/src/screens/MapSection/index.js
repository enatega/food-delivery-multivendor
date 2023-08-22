import React from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps'
import { mapStyle } from '../../utils/mapStyle'
import styles from './styles'
import { Image, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { scale } from '../../utils/scaling'

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
            <Marker
              coordinate={coord}
              key={index}
              onPress={() => {
                navigation.navigate('Restaurant', { ...rest })
              }}
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Image
                source={require('../../assets/images/res.png')}
                width={20}
              />
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: scale(8)
                }}>
                <Text>{rest.name}</Text>
              </View>
            </Marker>
          )
        })}
    </MapView>
  )
}
