import React, { useContext, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
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
import analytics from '../../../utils/analytics'
import OrdersContext from '../../../context/Orders'
import Spinner from '../../Spinner/Spinner'
import { useTranslation } from 'react-i18next'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { Modalize } from 'react-native-modalize'

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MODAL_HEIGHT = Math.floor(SCREEN_HEIGHT / 4)

const orderStatuses = [
  {
    key: 'PENDING',
    status: 1,
    statusText: 'pendingOrder'
  },
  {
    key: 'ACCEPTED',
    status: 2,
    statusText: 'acceptedOrder'
  },
  {
    key: 'ASSIGNED',
    status: 3,
    statusText: 'assignedOrder'
  },
  {
    key: 'PICKED',
    status: 4,
    statusText: 'pickedOrder'
  },
  {
    key: 'DELIVERED',
    status: 5,
    statusText: 'deliveredOrder'
  },
  {
    key: 'COMPLETED',
    status: 6,
    statusText: 'completedOrder'
  }
]

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']

const ActiveOrders = () => {
  const { t } = useTranslation()
  const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const activeOrders = orders.filter(o =>
    orderStatusActive.includes(o.orderStatus)
  )

  const [showAll, setShowAll] = useState(false)

  const displayOrders = showAll ? activeOrders : activeOrders.slice(0, 2)

  if (loadingOrders) return <Spinner />
  if (errorOrders && !orders) return <TextError text={errorOrders.message} />
  if (!displayOrders.length) return null
  const order = displayOrders[0]
  const remainingTime = Math.floor((order.completionTime - Date.now()) / 1000 / 60)
  console.log(order, remainingTime)
  return (
    <Modalize alwaysOpen={MODAL_HEIGHT} withHandle={false} modalHeight={MODAL_HEIGHT} modalStyle={{ borderWidth: StyleSheet.hairlineWidth }}>
      <View style={{ marginTop: scale(20), marginHorizontal: scale(10) }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <TextDefault Regular textColor={currentTheme.gray600}>Estimated delivery time</TextDefault>
          <TouchableOpacity>
            <TextDefault textColor={currentTheme.gray700} bolder>Details</TextDefault>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: scale(10) }}>
          <TextDefault Regular textColor={currentTheme.gray900} H1 bolder>15-25 mins</TextDefault>
        </View>
        <View>
          <Item
            configuration={configuration}
            currentTheme={currentTheme}
            item={order}
            navigation={navigation}
          />
        </View>
        <View></View>
      </View>
    </Modalize>
  )
}
const Item = ({ navigation, configuration, currentTheme, item }) => {
  const Analytics = analytics()
  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: item._id } }
  )
  const { t } = useTranslation()
  const checkStatus = status => {
    const obj = orderStatuses.filter(x => {
      return x.key === status
    })
    return obj[0]
  }
  return (
    <View style={{ marginTop: scale(20) }}>
      <View style={{ flexDirection: 'row' }}>
        {Array(checkStatus(item.orderStatus).status)
          .fill(0)
          .map((item, index) => (
            <View key={index} style={{ height: scale(4), backgroundColor: currentTheme.primary, width: scale(50), marginRight: scale(10) }}/>
          ))}
        {Array(4 - checkStatus(item.orderStatus).status)
          .fill(0)
          .map((item, index) => (
            <View key={index} style={{ height: scale(4), backgroundColor: currentTheme.gray200, width: scale(50), marginRight: scale(10) }}/>
          ))}
      </View>
      <View style={{ marginTop: scale(10) }}>
        <Text numberOfLines={1} style={styles(currentTheme).statusText}>
          {t(checkStatus(item.orderStatus).statusText)}
        </Text>
      </View>
    </View>
  )
}
export default ActiveOrders
