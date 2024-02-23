import React from 'react'
import { View } from 'react-native'
import { scale } from '../../../utils/scaling'
import { useSubscription } from '@apollo/client'
import { subscriptionOrder } from '../../../apollo/subscriptions'
import gql from 'graphql-tag'

export const orderStatuses = [
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

export const checkStatus = status => {
  const obj = orderStatuses.filter(x => {
    return x.key === status
  })
  return obj[0]
}

export const ProgressBar = ({ navigation, configuration, currentTheme, item }) => {
  useSubscription(
    gql`
        ${subscriptionOrder}
      `,
    { variables: { id: item._id } }
  )
  return (
    <View style={{ marginTop: scale(10) }}>
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
    </View>
  )
}
