import { useSubscription, gql } from '@apollo/client'
import { subscribeOrderStatus, orders } from '../../apollo'

export default function useOrderStatus(_id) {
  // remove this later
  // if (!_id) return { loading: false, error: false, data: null }
  // if (['1', '2', '3', '5', '6', '7', '8', '9', '10'].includes(_id)) return { loading: false, error: false, data: null }

  const { loading, error, data } = useSubscription(
    gql`
      ${subscribeOrderStatus}
    `,
    { variables: { _id }, onSubscriptionData }
  )

  function onSubscriptionData({
    client,
    subscriptionData: {
      data: { subscribeOrderStatus: order }
    }
  }) {
    if (!order) return
    const pending = client.readQuery({
      query: gql`
        ${orders}
      `,
      variables: { orderStatus: 'PENDING' }
    })
    const accepted = client.readQuery({
      query: gql`
        ${orders}
      `,
      variables: { orderStatus: 'ACCEPTED' }
    })
    const delivered = client.readQuery({
      query: gql`
        ${orders}
      `,
      variables: { orderStatus: 'DELIVERED' }
    })

    if (order.orderStatus === 'CANCELLED') {
      client.writeQuery({
        query: gql`
          ${orders}
        `,
        variables: { orderStatus: 'PENDING' },
        data: {
          restaurantOrders: pending.restaurantOrders.filter(
            o => o._id !== order._id
          )
        }
      })
      client.writeQuery({
        query: gql`
          ${orders}
        `,
        variables: { orderStatus: 'ACCEPTED' },
        data: {
          restaurantOrders: accepted.restaurantOrders.filter(
            o => o._id !== order._id
          )
        }
      })
      client.writeQuery({
        query: gql`
          ${orders}
        `,
        variables: { orderStatus: 'DELIVERED' },
        data: {
          restaurantOrders: delivered.restaurantOrders.filter(
            o => o._id !== order._id
          )
        }
      })
    }
    if (order.orderStatus === 'ACCEPTED') {
      client.writeQuery({
        query: gql`
          ${orders}
        `,
        variables: { orderStatus: 'PENDING' },
        data: {
          restaurantOrders: pending.restaurantOrders.filter(
            o => o._id !== order._id
          )
        }
      })
      const index = accepted.restaurantOrders.findIndex(
        o => o._id === order._id
      )
      if (index < 0) {
        client.writeQuery({
          query: gql`
            ${orders}
          `,
          variables: { orderStatus: 'ACCEPTED' },
          data: { restaurantOrders: [order, ...accepted.restaurantOrders] }
        })
      } else {
        accepted.restaurantOrders[index] = order
        client.writeQuery({
          query: gql`
            ${orders}
          `,
          variables: { orderStatus: 'ACCEPTED' },
          data: { restaurantOrders: [...accepted.restaurantOrders] }
        })
      }
    }
    if (order.orderStatus === 'DELIVERED') {
      client.writeQuery({
        query: gql`
          ${orders}
        `,
        variables: { orderStatus: 'PENDING' },
        data: {
          restaurantOrders: pending.restaurantOrders.filter(
            o => o._id !== order._id
          )
        }
      })
      client.writeQuery({
        query: gql`
          ${orders}
        `,
        variables: { orderStatus: 'ACCEPTED' },
        data: {
          restaurantOrders: accepted.restaurantOrders.filter(
            o => o._id !== order._id
          )
        }
      })
      const index = delivered.restaurantOrders.findIndex(
        o => o._id === order._id
      )
      if (index < 0) {
        client.writeQuery({
          query: gql`
            ${orders}
          `,
          variables: { orderStatus: 'DELIVERED' },
          data: { restaurantOrders: [order, ...delivered.restaurantOrders] }
        })
      } else {
        delivered.restaurantOrders[index] = order
        client.writeQuery({
          query: gql`
            ${orders}
          `,
          variables: { orderStatus: 'DELIVERED' },
          data: { restaurantOrders: [...delivered.restaurantOrders] }
        })
      }
    }
  }
  return { loading, error, data }
}
