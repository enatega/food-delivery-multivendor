import React, { useContext, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
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
  const activeOrders = orders.filter(o =>
    orderStatusActive.includes(o.orderStatus)
  )

  const currentTheme = theme[themeContext.ThemeValue]
  const [showAll, setShowAll] = useState(false)

  const displayOrders = showAll ? activeOrders : activeOrders.slice(0, 2)

  if (loadingOrders) return <Spinner />
  if (errorOrders && !orders) return <TextError text={errorOrders.message} />
  return (
    <>
      <FlatList
        contentContainerStyle={{ paddingRight: scale(10) }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={displayOrders}
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
      <View style={styles().viewAllButton}>
        {activeOrders.length > 2 && (
          <>
            <View style={styles().btncontainer}>
              <TouchableOpacity
                onPress={() => setShowAll(!showAll)}
                style={styles().button}>
                <Text style={styles().buttonText}>
                  {showAll ? 'View Less' : 'View All'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
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
      <View>
        <View style={styles(currentTheme).statusContainer}>
          <View style={styles().randomShapeContainer}>
            <RandomShape width={scale(300)} height={scale(300)} />
          </View>
          <View style={styles().textContainer}>
            <View style={styles().textInnerContainer}>
              <MaterialIcons
                name="radio-button-checked"
                size={30}
                color="black"
              />
              <Text style={styles(currentTheme).description}>
                {item.restaurant.name}
              </Text>
            </View>
            <View style={styles().activeOrdersContainer}>
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
            <Text numberOfLines={1} style={styles(currentTheme).statusText}>
              {checkStatus(item.orderStatus).statusText}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
export default ActiveOrders
