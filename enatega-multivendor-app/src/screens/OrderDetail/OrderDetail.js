import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import React, { useContext, useEffect } from 'react'
import { View, ScrollView, Dimensions } from 'react-native'
import Spinner from '../../components/Spinner/Spinner'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import TextError from '../../components/Text/TextError/TextError'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import analytics from '../../utils/analytics'
import Status from '../../components/OrderDetail/Status/Status'
import Detail from '../../components/OrderDetail/Detail/Detail'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import CustomerMarker from '../../assets/SVG/customer-marker'
import TrackingRider from '../../components/OrderDetail/TrackingRider/TrackingRider'
import OrdersContext from '../../context/Orders'
import { mapStyle } from '../../utils/mapStyle'
const { height: HEIGHT } = Dimensions.get('screen')
import {useTranslation} from 'react-i18next'

function OrderDetail(props) {
  const Analytics = analytics()

  const id = props.route.params ? props.route.params._id : null
  const user = props.route.params ? props.route.params.user : null
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const {t} = useTranslation()
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
        orderId: id
      })
    }
    Track()
  }, [])

  const order = orders.find(o => o._id === id)

  if (loadingOrders || !order) return <Spinner />
  if (errorOrders) return <TextError text={JSON.stringify(errorOrders)} />

  const {
    _id,
    restaurant,
    deliveryAddress,
    items,
    tipping: tip,
    taxationAmount: tax,
    orderAmount: total,
    deliveryCharges
  } = order
  const subTotal = total - tip - tax - deliveryCharges

  return (
    <SafeAreaView style={styles().flex}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <MapView
          style={{ height: HEIGHT * 0.75 }}
          showsUserLocation={false}
          initialRegion={{
            latitude: +deliveryAddress.location.coordinates[1],
            longitude: +deliveryAddress.location.coordinates[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          zoomEnabled={true}
          zoomControlEnabled={true}
          rotateEnabled={false}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}>
          <Marker
            coordinate={{
              longitude: +restaurant.location.coordinates[0],
              latitude: +restaurant.location.coordinates[1]
            }}>
            <RestaurantMarker />
          </Marker>
          <Marker
            coordinate={{
              latitude: +deliveryAddress.location.coordinates[1],
              longitude: +deliveryAddress.location.coordinates[0]
            }}>
            <CustomerMarker />
          </Marker>
          {order.rider && <TrackingRider id={order.rider._id} />}
        </MapView>

        <Status
          orderStatus={order.orderStatus}
          createdAt={order.createdAt}
          acceptedAt={order.acceptedAt}
          pickedAt={order.pickedAt}
          deliveredAt={order.deliveredAt}
          cancelledAt={order.cancelledAt}
          assignedAt={order.assignedAt}
          theme={currentTheme}
        />

        {order.orderStatus === 'DELIVERED' && !order.review && (
          <View style={styles().review}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles().floatView, { justifyContent: 'center' }]}
              onPress={() =>
                props.navigation.navigate('RateAndReview', {
                  _id: order._id,
                  restaurant: restaurant,
                  user: user
                })
              }>
              <MaterialIcons
                name="rate-review"
                size={scale(20)}
                color={currentTheme.iconColorPink}
              />
              <TextDefault
                textColor={currentTheme.iconColorPink}
                style={[alignment.MBsmall, alignment.MTsmall, alignment.ML10]}
                bolder
                center>
                {t('writeAReview')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        )}
        <Detail
          navigation={props.navigation}
          currencySymbol={configuration.currencySymbol}
          items={items}
          from={restaurant.name}
          orderNo={order.orderId}
          deliveryAddress={deliveryAddress.deliveryAddress}
          subTotal={subTotal}
          tip={tip}
          tax={tax}
          deliveryCharges={deliveryCharges}
          total={total}
          theme={currentTheme}
          id={_id}
          rider={order.rider}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetail
