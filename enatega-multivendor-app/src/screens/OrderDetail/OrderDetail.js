import { View, ScrollView, Dimensions } from 'react-native'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import React, { useContext, useEffect, useState, useRef } from 'react'
import Spinner from '../../components/Spinner/Spinner'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import TextError from '../../components/Text/TextError/TextError'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
// import analytics from '../../utils/analytics'
import Detail from '../../components/OrderDetail/Detail/Detail'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import CustomerMarker from '../../assets/SVG/customer-marker'
import TrackingRider from '../../components/OrderDetail/TrackingRider/TrackingRider'
import OrdersContext from '../../context/Orders'
import { mapStyle } from '../../utils/mapStyle'
import { useTranslation } from 'react-i18next'
import { HelpButton } from '../../components/Header/HeaderIcons/HeaderIcons'

import { ProgressBar, checkStatus } from '../../components/Main/ActiveOrders/ProgressBar'
import { useNavigation } from '@react-navigation/native'
import { PriceRow } from '../../components/OrderDetail/PriceRow'
import { ORDER_STATUS_ENUM } from '../../utils/enums'
import { CancelModal } from '../../components/OrderDetail/CancelModal'
import Button from '../../components/Button/Button'
import { gql, useMutation } from '@apollo/client'
import { cancelOrder as cancelOrderMutation } from '../../apollo/mutations'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { calulateRemainingTime } from '../../utils/customFunctions'
import { Instructions } from '../../components/Checkout/Instructions'

import MapViewDirections from 'react-native-maps-directions'
import useEnvVars from '../../../environment'
import LottieView from 'lottie-react-native'
import { clearLogEntriesAsync } from 'expo-updates'
import Taxes from './Taxes'
const { height: HEIGHT, width: WIDTH } = Dimensions.get('screen')

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

const CANCEL_ORDER = gql`
  ${cancelOrderMutation}
`

function OrderDetail(props) {
  // console.log("propsdata",props?.route.params)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  //const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const id = props?.route.params ? props?.route.params?._id : null
  const orderData = props?.route.params ? props?.route.params?.order : null
  // console.log('orderData',orderData)
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const navigation = useNavigation()
  const { GOOGLE_MAPS_KEY } = useEnvVars()
  const mapView = useRef(null)
  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  const [cancelOrder, { loading: loadingCancel }] = useMutation(CANCEL_ORDER, {
    onError,
    onCompleted: (data) => {
      setCancelModalVisible(false)
      navigation.navigate('Main')
    },
    variables: { abortOrderId: id }
  })
  // useEffect(() => {
  //   /* async function Track() {
  //     await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
  //       orderId: id
  //     })
  //   }
  //   Track() */
  // }, [])

  const cancelModalToggle = () => {
    setCancelModalVisible(!cancelModalVisible)
  }
  function onError(error) {
    setCancelModalVisible(false)
    FlashMessage({
      message: error.message
    })
  }
  let order = orders?.find((o) => {
    return o?._id === id
  })

  if (!order) {
    order = orderData
  }

  useEffect(() => {
    props?.navigation.setOptions({
      headerRight: () => HelpButton({ iconBackground: currentTheme.main, navigation, t }),
      headerTitle: `${order ? order?.deliveryAddress?.deliveryAddress?.substr(0, 15) : ''}...`,
      headerTitleStyle: { color: currentTheme.newFontcolor },
      headerStyle: { backgroundColor: currentTheme.newheaderBG }
    })
  }, [orders])

  const [remainingTimeState, setRemainingTimeState] = useState(0)
  
  useEffect(() => {
    if (order && ![ORDER_STATUS_ENUM.DELIVERED, ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(order.orderStatus)) {
      const initialTime = calulateRemainingTime(order)
      setRemainingTimeState(initialTime)
 
    
      const intervalId = setInterval(() => {
        const updatedTime = calulateRemainingTime(order)
        setRemainingTimeState(updatedTime)
        
        if (updatedTime <= 0 || [ORDER_STATUS_ENUM.DELIVERED, ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(order.orderStatus)) {
          clearInterval(intervalId)
        }
      }, 5000)
      
      return () => clearInterval(intervalId)
    }
  }, [order])

  if (loadingOrders) {
    return <Spinner backColor={currentTheme.themeBackground} spinnerColor={currentTheme.main} />
  }
  if (errorOrders) {
    return <TextError text={JSON.stringify(errorOrders)} />
  }

  const { _id, id: orderId, restaurant, deliveryAddress, items, tipping: tip, taxationAmount: tax, orderAmount: total, deliveryCharges } = order

  const subTotal = total - tip - tax - deliveryCharges
  
  const isOrderPending = order?.orderStatus === ORDER_STATUS_ENUM.PENDING
  const isOrderCancelable = isOrderPending
  
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: currentTheme.themeBackground,
          paddingBottom: scale(150)
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode='never'
      >
        {order?.rider && order?.orderStatus === ORDER_STATUS_ENUM.PICKED && (
          <MapView
            ref={(c) => (mapView.current = c)}
            style={{ flex: 1, height: HEIGHT * 0.6 }}
            showsUserLocation={false}
            initialRegion={{
              latitude: +deliveryAddress?.location?.coordinates[1],
              longitude: +deliveryAddress?.location?.coordinates[0],
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            zoomEnabled={true}
            zoomControlEnabled={true}
            rotateEnabled={false}
            customMapStyle={mapStyle}
            provider={PROVIDER_DEFAULT}
          >
            <Marker
              coordinate={{
                longitude: +restaurant?.location?.coordinates[0],
                latitude: +restaurant?.location?.coordinates[1]
              }}
            >
              <RestaurantMarker />
            </Marker>
            <Marker
              coordinate={{
                latitude: +deliveryAddress?.location?.coordinates[1],
                longitude: +deliveryAddress?.location?.coordinates[0]
              }}
            >
              <CustomerMarker />
            </Marker>
            <MapViewDirections
              origin={{
                longitude: +restaurant?.location?.coordinates[0],
                latitude: +restaurant?.location?.coordinates[1]
              }}
              destination={{
                latitude: +deliveryAddress?.location?.coordinates[1],
                longitude: +deliveryAddress?.location?.coordinates[0]
              }}
              apikey={GOOGLE_MAPS_KEY}
              strokeWidth={6}
              strokeColor={currentTheme.main}
              optimizeWaypoints={true}
              onReady={(result) => {
                //result.distance} km
                //Duration: ${result.duration} min.

                mapView?.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: WIDTH / 20,
                    bottom: HEIGHT / 20,
                    left: WIDTH / 20,
                    top: HEIGHT / 20
                  }
                })
              }}
              onError={(error) => {
                console.log('onerror', error)
              }}
            />
            {order?.rider && <TrackingRider id={order?.rider?._id} />}
          </MapView>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            ...alignment.Pmedium
          }}
        >
          <OrderStatusImage status={order?.orderStatus} />
          {order?.orderStatus !== ORDER_STATUS_ENUM.DELIVERED && (
            <View
              style={{
                ...alignment.MTxSmall,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {![ORDER_STATUS_ENUM.PENDING, ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.CANCELLEDBYREST].includes(order?.orderStatus) && (
                <>
                  <TextDefault style={{ ...alignment.MTxSmall }} textColor={currentTheme.gray500} H5>
                    {t('estimatedDeliveryTime')}
                  </TextDefault>
                  <TextDefault style={{ ...alignment.MTxSmall }} Regular textColor={currentTheme.gray900} H1 bolder>
                    {remainingTimeState}-{remainingTimeState + 5} {t('mins')}
                  </TextDefault>
                  <ProgressBar configuration={configuration} currentTheme={currentTheme} item={order} navigation={navigation} isPicked={order?.isPickedUp} />
                </>
              )}
              <TextDefault H5 style={{ ...alignment.Mmedium }} textColor={currentTheme.gray600} bold center>
                {' '}
                {t(checkStatus(order?.orderStatus)?.statusText)}
              </TextDefault>
            </View>
          )}
        </View>
        <Instructions title={'Instructions'} theme={currentTheme} message={order?.instructions} />
        <Detail navigation={props?.navigation} currencySymbol={configuration.currencySymbol} items={items} from={restaurant?.name} orderNo={order?.orderId} deliveryAddress={deliveryAddress?.deliveryAddress} subTotal={subTotal} tip={tip} tax={tax} deliveryCharges={deliveryCharges} total={total} theme={currentTheme} id={id} rider={order?.rider} orderStatus={order?.orderStatus} />
        <Taxes tax={tax} deliveryCharges={deliveryCharges} currency={configuration.currencySymbol} />
      </ScrollView>
      <View style={styles().bottomContainer(currentTheme)}>
        <PriceRow theme={currentTheme} title={t('total')} currency={configuration.currencySymbol} price={total.toFixed(2)} />
        
          <View style={{ margin: scale(20) }}>
            <Button disabled={isOrderCancelable ? false : true} text={t('cancelOrder')} buttonProps={{ onPress: cancelModalToggle }} buttonStyles={styles().cancelButtonContainer(currentTheme)} textProps={{ textColor: currentTheme.red600 }} textStyles={{ ...alignment.Pmedium }} />
          </View>
        
      </View>
      <CancelModal theme={currentTheme} modalVisible={cancelModalVisible} setModalVisible={cancelModalToggle} cancelOrder={cancelOrder} loading={loadingCancel} orderStatus={order?.orderStatus} />
    </View>
  )
}

export const OrderStatusImage = ({ status }) => {
  let imagePath = null
  switch (status) {
    case ORDER_STATUS_ENUM.PENDING:
      imagePath = require('../../assets/SVG/order-placed.json')
      break
    case ORDER_STATUS_ENUM.ACCEPTED:
      imagePath = require('../../assets/SVG/order-tracking-preparing.json')
      break
    case ORDER_STATUS_ENUM.ASSIGNED:
      imagePath = require('../../assets/SVG/food-picked.json')
      break
    case ORDER_STATUS_ENUM.COMPLETED:
      imagePath = require('../../assets/SVG/place-order.json')
      break
    case ORDER_STATUS_ENUM.DELIVERED:
      imagePath = require('../../assets/SVG/place-order.json')
      break
  }

  if (!imagePath) return null

  return (
    <LottieView
      style={{
        width: 250,
        height: 250
      }}
      source={imagePath}
      autoPlay
      loop
    />
  )
}

export default OrderDetail
