import React, { useContext } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import TextError from '../../Text/TextError/TextError'
import { useSubscription } from '@apollo/client'
import { subscriptionOrder } from '../../../apollo/subscriptions'
import gql from 'graphql-tag'
import RandomShape from '../../../assets/SVG/RandomShape'
import Analytics from '../../../utils/analytics'
import OrdersContext from '../../../context/Orders'
import Spinner from '../../Spinner/Spinner'
import TextDefault from '../../Text/TextDefault/TextDefault'

const orderStatuses = [
  {
    key: 'PENDING',
    status: 1,
    statusText: 'Your order is still pending.'
  },
  {
    key: 'ACCEPTED',
    status: 2,
    statusText: 'Restaurant is preparing Food.'
  },
  {
    key: 'ASSIGNED',
    status: 3,
    statusText: 'Assigned a rider.'
  },
  {
    key: 'PICKED',
    status: 4,
    statusText: 'Rider is on the way.'
  },
  {
    key: 'DELIVERED',
    status: 5,
    statusText: 'Order is delivered.'
  },
  {
    key: 'COMPLETED',
    status: 6,
    statusText: 'Order is completed.'
  }
]

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']

const ActiveOrders = () => {
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  if (loadingOrders) return <Spinner />
  if (errorOrders && !orders) return <TextError text={errorOrders.message} />
  return (
    <FlatList
      contentContainerStyle={{ paddingRight: scale(10) }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={orders.filter(o => orderStatusActive.includes(o.orderStatus))}
      keyExtractor={item => item._id}
      renderItem={({ item, index }) => (
        <Item
          key={index}
          navigation={navigation}
          configuration={configuration}
          currentTheme={currentTheme}
          item={item}
        />
      )}
    />
  )
}
const Item = ({ navigation, configuration, currentTheme, item }) => {
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: item._id } }
  )

  const checkStatus = status => {
    const obj = orderStatuses.filter(x => {
      return x.key === status
    })
    return obj[0]
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
          orderId: item._id
        })
        navigation.navigate('OrderDetail', {
          _id: item._id,
          currencySymbol: configuration.currencySymbol
        })
      }}>
      <View style={styles(currentTheme).statusContainer}>
        <View style={styles().randomShapeContainer}>
          <RandomShape width={scale(300)} height={scale(300)} />
        </View>
        <View style={styles().textContainer}>
          <View>
            <TextDefault style={styles(currentTheme).title}>
              Your order from:
            </TextDefault>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginTop: scale(8),
                marginBottom: scale(8)
              }}>
              <TextDefault style={styles(currentTheme).description}>
                {item.restaurant.name}
              </TextDefault>
              <View style={{ marginLeft: 15, flexDirection: 'row' }}>
                {Array(checkStatus(item.orderStatus).status)
                  .fill(0)
                  .map((item, index) => (
                    <FontAwesome
                      key={index}
                      name="circle"
                      size={15}
                      color={currentTheme.iconColorPink}
                      style={styles().statusCircle}
                    />
                  ))}
                {Array(4 - checkStatus(item.orderStatus).status)
                  .fill(0)
                  .map((item, index) => (
                    <FontAwesome
                      key={index}
                      name="circle"
                      size={15}
                      color={currentTheme.radioOuterColor}
                      style={styles().statusCircle}
                    />
                  ))}
              </View>
            </View>
          </View>

          <TextDefault
            numberOfLines={1}
            style={styles(currentTheme).statusText}>
            {checkStatus(item.orderStatus).status}.{' '}
            {checkStatus(item.orderStatus).statusText}
          </TextDefault>
          <TextDefault style={styles(currentTheme).timeText} bolder>
            {item.orderStatus}
          </TextDefault>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default ActiveOrders
