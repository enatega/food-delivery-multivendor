import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {
  ScrollView,
  View,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native'
import Spinner from '../../components/Spinner/Spinner'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextError from '../../components/Text/TextError/TextError'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import TrackingRider from '../../components/OrderDetail/TrackingRider/TrackingRider'
import PickUpMap from '../../components/OrderDetail/PickUpMap'
import UserContext from '../../context/User'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import styles from './styles'
import { useFocusEffect } from '@react-navigation/native'
import analytics from '../../utils/analytics'

import { useTranslation } from 'react-i18next'

function calculatePrice(food) {
  var foodPrice = food.variation.price
  food.addons.forEach(addons => {
    addons.options.forEach(addon => {
      foodPrice += addon.price
    })
  })
  return foodPrice
}

function OrderDetail(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const id = props.route.params ? props.route.params._id : null
  const restaurant = props.route.params ? props.route.params.restaurant : null
  const user = props.route.params ? props.route.params.user : null
  const inset = useSafeAreaInsets()

  const { loadingOrders, errorOrders, orders } = useContext(UserContext)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const [remainingTime, setRemainingTime] = useState(0)
  const currentTheme = theme[themeContext.ThemeValue]
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
        orderId: id
      })
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions(screenOptions(currentTheme.headerText))
  }, [props.navigation])

  let secTimer = null
  useEffect(() => {
    if (!loadingOrders && order) {
      setRemainingTime(
        Math.floor((order.expectedTime - Date.now()) / 1000 / 60)
      )
      if (!secTimer) {
        secTimer = setInterval(() => {
          setRemainingTime(
            Math.floor((order.expectedTime - Date.now()) / 1000 / 60)
          )
        }, 60000)
      }
    }
    return () => {
      if (secTimer) clearInterval(secTimer)
    }
  }, [orders])

  const order = orders.find(o => o._id === id)

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  function timeConvert(n) {
    var num = n
    var hours = num / 60
    var rhours = Math.floor(hours)
    var minutes = (hours - rhours) * 60
    var rminutes = Math.round(minutes)
    return (rhours > 0 ? rhours + ' hr(s) ' + rminutes : rminutes) + ' min(s) '
  }
  function lastTime() {
    const finalTime = parseInt(order.expectedTime) + remainingTime * 60000 // time in millisecond with remainingTime added
    const time =
      new Date(finalTime).toLocaleTimeString() +
      ' - ' +
      new Date().toDateString()
    return time
  }

  function squareLine() {
    return (
      <View
        style={[
          styles().marginBottom10,
          { flexDirection: 'row', justifyContent: 'flex-start' }
        ]}>
        <MaterialCommunityIcons
          name="square-medium"
          size={15}
          color={currentTheme.iconColorPink}
        />
        <MaterialCommunityIcons
          name="square-medium"
          size={15}
          color={currentTheme.iconColorPink}
        />
        <MaterialCommunityIcons
          name="square-medium"
          size={15}
          color={currentTheme.iconColorPink}
        />
      </View>
    )
  }
  if (loadingOrders || !order) return <Spinner />
  if (errorOrders) return <TextError text={t('error')} />
  // const remainingTime = Math.floor((order.completionTime - Date.now()) / 1000 / 60)
  return (
    <>
      <ScrollView
        style={[
          styles().flex,
          { backgroundColor: currentTheme.themeBackground }
        ]}>
        <View>
          {order.orderStatus === 'PICKED' && order.rider && (
            <TrackingRider
              deliveryAddress={order.deliveryAddress}
              id={order.rider._id}
            />
          )}
        </View>
        <View style={styles().container}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            H3
            style={(alignment.MBsmall, { alignSelf: 'center' })}>
            {t('thankYou')}!
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontSecondColor}
            bold
            style={[alignment.MBsmall, alignment.MTsmall]}>
            Your order status is:
          </TextDefault>
          <TextDefault
            textColor={currentTheme.iconColorPink}
            H2
            bolder
            B700
            style={[alignment.MBsmall, alignment.MTsmall]}>
            {order.orderStatus}
          </TextDefault>
          {['ACCEPTED'].includes(order.orderStatus) && order.isPickedUp && (
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              style={[alignment.MBsmall, alignment.MTsmall]}>
              You can pick your order up at:
            </TextDefault>
          )}
          {['ACCEPTED'].includes(order.orderStatus) && (
            <TextDefault
              textColor={currentTheme.iconColorPink}
              H3
              bolder
              B700
              style={[alignment.MBsmall, alignment.MTsmall]}>
              {remainingTime <= 0 ? lastTime() : timeConvert(remainingTime)}
              {order.isPickedUp ? '' : 'remaining'}
            </TextDefault>
          )}
          <TextDefault
            textColor={currentTheme.fontMainColor}
            H4
            bolder
            style={alignment.MTsmall}>
            Order Detail
          </TextDefault>
          {squareLine()}
          <TextDefault textColor={currentTheme.fontSecondColor} bold>
            Your order from:
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            B700
            style={alignment.MBsmall}>
            {order.restaurant.name}
          </TextDefault>
          <TextDefault textColor={currentTheme.fontSecondColor} bold>
            Your order number:
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            bolder
            B700
            style={alignment.MBsmall}>
            {order.orderId}
          </TextDefault>
          {order.isPickedUp ? (
            <>
              <TextDefault textColor={currentTheme.fontSecondColor} bold>
                Pickup address:
              </TextDefault>
              <PickUpMap
                deliveryAddress={order.deliveryAddress}
                pickupAddress={order.restaurant}
              />
            </>
          ) : (
            <>
              <TextDefault textColor={currentTheme.fontSecondColor} bold>
                Delivery address:
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} H5 bolder>
                {order.deliveryAddress.deliveryAddress}
              </TextDefault>
              <TextDefault textColor={currentTheme.fontMainColor} bolder B700>
                {order.deliveryAddress.details}
              </TextDefault>
            </>
          )}
          {squareLine()}
        </View>
        <View style={[styles().marginBottom10, styles().orderReceipt]}>
          {order.items.map((item, index) => (
            <View
              style={[styles().marginBottom10, styles().floatView]}
              key={index}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                bolder
                B700
                style={{ width: '10%' }}>
                {item.quantity}x
              </TextDefault>
              <View style={{ width: '65%' }}>
                <TextDefault textColor={currentTheme.fontSecondColor}>
                  {item.title}
                </TextDefault>
                {item.addons.map(addon =>
                  addon.options.map((option, index) => (
                    <TextDefault
                      textColor={currentTheme.fontSecondColor}
                      small
                      key={option._id + index}>
                      +{option.title}
                    </TextDefault>
                  ))
                )}
              </View>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                bold
                small
                style={{ width: '25%' }}
                right>
                {configuration.currencySymbol}
                {parseFloat(calculatePrice(item)).toFixed(2)}
              </TextDefault>
            </View>
          ))}
          <View
            style={[
              styles(currentTheme).horizontalLine,
              styles().marginBottom10
            ]}
          />
          <View style={[styles().marginBottom10, styles().floatView]}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '40%' }}>
              {t('subTotal')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '60%' }}
              right>
              {configuration.currencySymbol}
              {parseFloat(
                order.orderAmount -
                  (order.isPickedUp ? 0 : order.deliveryCharges) -
                  order.tipping -
                  order.taxationAmount
              ).toFixed(2)}
            </TextDefault>
          </View>
          <View style={[styles().marginBottom10, styles().floatView]}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '40%' }}>
              {t('tip')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '60%' }}
              right>
              {configuration.currencySymbol}
              {parseFloat(order.tipping).toFixed(2)}
            </TextDefault>
          </View>
          <View style={[styles().marginBottom10, styles().floatView]}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '40%' }}>
              {t('taxFee')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '60%' }}
              right>
              {configuration.currencySymbol}
              {parseFloat(order.taxationAmount).toFixed(2)}
            </TextDefault>
          </View>
          {!order.isPickedUp && (
            <View style={[styles().marginBottom20, styles().floatView]}>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                bold
                small
                style={{ width: '40%' }}>
                {t('delvieryCharges')}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                bold
                small
                style={{ width: '60%' }}
                right>
                {configuration.currencySymbol}
                {parseFloat(order.deliveryCharges).toFixed(2)}
              </TextDefault>
            </View>
          )}
          <View style={[styles().floatView]}>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '40%' }}>
              {t('total')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={{ width: '60%' }}
              right>
              {configuration.currencySymbol}
              {parseFloat(order.orderAmount).toFixed(2)}
            </TextDefault>
          </View>
        </View>
        {order.orderStatus === 'DELIVERED' && !order.review && (
          <View style={styles().orderReceipt}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              H4
              bolder
              style={alignment.MBsmall}>
              {t('anySuggestion')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              bold
              small
              style={[alignment.MBsmall, alignment.MTsmall]}>
              {t('reviewRegardingOrder')}
            </TextDefault>
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
                size={scale(15)}
                color={currentTheme.iconColorPink}
              />
              <TextDefault
                textColor={currentTheme.iconColorPink}
                style={[alignment.MBsmall, alignment.MTsmall, alignment.ML10]}
                bold
                center>
                {t('writeAReview')}
              </TextDefault>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default OrderDetail
