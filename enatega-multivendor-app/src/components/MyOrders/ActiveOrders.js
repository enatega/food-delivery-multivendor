import React, { useContext } from 'react'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { useSubscription } from '@apollo/client'
import gql from 'graphql-tag'
import { subscriptionOrder } from '../../apollo/subscriptions'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextDefault from '../Text/TextDefault/TextDefault'
import TextError from '../Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import ConfigurationContext from '../../context/Configuration'
import { FontAwesome } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
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
const ActiveOrders = ({ navigation, loading, error, order }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)
  const checkStatus = status => {
    const obj = orderStatuses.filter(x => {
      return x.key === status
    })
    return obj[0]
  }

  if (loading) {
    return <></>
  }
  if (error) return <TextError text={error.message} />

  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: order?._id } }
  )
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('OrderDetail', { _id: order?._id })}>
      <View style={styles(currentTheme).container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <View style={styles().leftContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginTop: scale(8),
                marginBottom: scale(8)
              }}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                medium
                bold
                style={alignment.MBxSmall}>
                {order?.restaurant.name}
              </TextDefault>
              <View style={{ marginLeft: 15, flexDirection: 'row' }}>
                {Array(checkStatus(order.orderStatus).status)
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
                {Array(4 - checkStatus(order.orderStatus).status)
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
            <TextDefault
              textColor={currentTheme.fontSecondColor}
              small
              bold
              style={alignment.MBxSmall}>
              {`${order?.items.length} Items | ${
                configuration.currencySymbol
              } ${order?.orderAmount.toFixed(2)}`}
            </TextDefault>
            <TextDefault
              line={3}
              textColor={currentTheme.fontSecondColor}
              small
              bold>
              {order?.orderStatus === 'PENDING'
                ? "We're asking the restaurant how long it will take to deliver your food."
                : 'The restaurant rider will be at your place around.'}
            </TextDefault>
          </View>
          <View style={styles().rightContainer}>
            <TextDefault textColor={currentTheme.iconColorPink} bold center>
              {' '}
              {order?.orderStatus}
            </TextDefault>
          </View>
        </View>
        <View style={styles(currentTheme).line} />
        <Pressable style={styles(currentTheme).btn}>
          <TextDefault bold textColor={currentTheme.orderComplete}>
            {order?.orderStatus}
          </TextDefault>
        </Pressable>
      </View>
    </TouchableOpacity>
  )
}

export default ActiveOrders
