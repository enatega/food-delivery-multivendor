import { ScrollView, View, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import styles from './styles'
import colors from '../../utilities/colors'
import Status from '../../components/OrderDetail/Status/Status'
import Details from '../../components/OrderDetail/Details/Details'
import RestIcon from '../../assets/rest_icon.png'
import HomeIcon from '../../assets/home_icon.png'
import RiderIcon from '../../assets/rider_icon.png'
import { linkToMapsApp } from '../../utilities/links'
import { MapStyles } from '../../utilities/mapStyles'
import useOrderDetail from './useOrderDetail'

const OrderDetail = () => {
  const {
    locationPin,
    restaurantAddressPin,
    deliveryAddressPin,
    GOOGLE_MAPS_KEY,
    distance,
    setDistance,
    duration,
    setDuration,
    order,
    route,
    navigation,
    orderID
  } = useOrderDetail()

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.mapView}>
          {locationPin && (
            <MapView
              style={styles.map}
              showsUserLocation
              zoomEnabled={true}
              zoomControlEnabled={true}
              rotateEnabled={false}
              initialRegion={{
                latitude: locationPin.location.latitude,
                longitude: locationPin.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
              customMapStyle={MapStyles}
              provider={PROVIDER_GOOGLE}>
              {deliveryAddressPin && (
                <Marker
                  coordinate={deliveryAddressPin.location}
                  title="Delivery Address"
                  onPress={() => {
                    linkToMapsApp(
                      deliveryAddressPin.location,
                      deliveryAddressPin.label
                    )
                  }}>
                  <Image source={HomeIcon} style={{ height: 35, width: 32 }} />
                </Marker>
              )}
              {restaurantAddressPin && (
                <Marker
                  coordinate={restaurantAddressPin.location}
                  title="Restaurant"
                  onPress={() => {
                    linkToMapsApp(
                      restaurantAddressPin.location,
                      restaurantAddressPin.label
                    )
                  }}>
                  <Image source={RestIcon} style={{ height: 35, width: 32 }} />
                </Marker>
              )}
              {locationPin && (
                <Marker
                  coordinate={locationPin.location}
                  title="Rider"
                  onPress={() => {
                    linkToMapsApp(locationPin.location, locationPin.label)
                  }}>
                  <Image source={RiderIcon} style={{ height: 35, width: 32 }} />
                </Marker>
              )}
              {order?.orderStatus === 'ACCEPTED' ? (
                <MapViewDirections
                  origin={locationPin.location}
                  destination={restaurantAddressPin.location}
                  apikey={GOOGLE_MAPS_KEY}
                  strokeWidth={4}
                  strokeColor={colors.black}
                  onReady={result => {
                    setDistance(result.distance)
                    setDuration(result.duration)
                  }}
                />
              ) : order?.orderStatus === 'PICKED' ? (
                <MapViewDirections
                  origin={locationPin.location}
                  destination={deliveryAddressPin.location}
                  apikey={GOOGLE_MAPS_KEY}
                  strokeWidth={4}
                  strokeColor={colors.black}
                  onReady={result => {
                    setDistance(result.distance)
                    setDuration(result.duration)
                  }}
                />
              ) : (
                <MapViewDirections
                  origin={restaurantAddressPin.location}
                  destination={deliveryAddressPin.location}
                  apikey={GOOGLE_MAPS_KEY}
                  strokeWidth={4}
                  strokeColor={colors.black}
                  onReady={result => {
                    setDistance(result.distance)
                    setDuration(result.duration)
                  }}
                />
              )}
            </MapView>
          )}
        </View>
        <View style={styles.iconView}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="chevron-back"
            size={26}
            color={colors.white}
            style={styles.icon}
          />
        </View>
        <View style={styles.status}>
          <Status
            orderData={route.params?.order}
            itemId={orderID}
            pickedAt={order?.pickedAt}
            deliveredAt={order?.deliveredAt}
            assignedAt={order?.assignedAt}
          />
        </View>
        <View>
          <Details
            orderData={route.params?.order}
            itemId={orderID}
            distance={distance}
            duration={duration}
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetail
