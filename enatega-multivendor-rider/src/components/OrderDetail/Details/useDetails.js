import { useContext, useState, useEffect } from 'react'
import UserContext from '../../../context/user'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import { configuration, riderOrders } from '../../../apollo/queries'
import { assignOrder, updateOrderStatusRider } from '../../../apollo/mutations'
import { TabsContext } from '../../../context/tabs'
import { FlashMessage } from '../../FlashMessage/FlashMessage'
import { subscriptionOrder } from '../../../apollo/subscriptions'
import {useTranslation} from 'react-i18next'

const CONFIGURATION = gql`
  ${configuration}
`
const ASSIGN_ORDER = gql`
  ${assignOrder}
`
const ORDERS = gql`
  ${riderOrders}
`
const UPDATE_ORDER_STATUS = gql`
  ${updateOrderStatusRider}
`

const useDetails = orderData => {
  const { active, setActive } = useContext(TabsContext)
  const { assignedOrders, loadingAssigned } = useContext(UserContext)
  const [order, setOrder] = useState(orderData)
  const {t} = useTranslation()
  useEffect(() => {
    if (!loadingAssigned && order) {
      setOrder(assignedOrders.find(o => o._id === order?._id))
    }
  }, [assignedOrders, order])

  const preparationTime = {
    hours: new Date(order?.preparationTime).getHours(),
    minutes: new Date(order?.preparationTime).getMinutes(),
    seconds: new Date(order?.preparationTime).getSeconds()
  }

  const currentTime = {
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
    seconds: new Date().getSeconds()
  }

  const preparationSeconds =
    preparationTime.hours * 3600 +
    preparationTime.minutes * 60 +
    preparationTime.seconds
  const currentSeconds =
    currentTime.hours * 3600 + currentTime.minutes * 60 + currentTime.seconds

  useSubscription(
    gql`
      ${subscriptionOrder}
    `,
    { variables: { id: order?._id }, skip: !order }
  )

  const {
    data: dataConfig,
    loading: loadingConfig,
    error: errorConfig
  } = useQuery(CONFIGURATION)

  const [mutateAssignOrder, { loading: loadingAssignOrder }] = useMutation(
    ASSIGN_ORDER,
    {
      onCompleted,
      onError,
      update
    }
  )

  const [
    mutateOrderStatus,
    { loading: loadingOrderStatus }
  ] = useMutation(UPDATE_ORDER_STATUS, { onCompleted, onError, update })

  async function onCompleted(result) {
    if (result.updateOrderStatusRider) {
      FlashMessage({
        message: `${t('orderMarkedAs')} ${t(result.updateOrderStatusRider.orderStatus)}`
      })
    }
    if (result.assignOrder) {
      FlashMessage({
        message: t('orderAssingnedFlash')
      })
      setActive('MyOrders')
    }
  }

  function onError({ graphQLErrors, networkError }) {
    let message = t('errorOccured')
    if (networkError) message = 'Internal Server Error'
    if (graphQLErrors) message = graphQLErrors.map(o => o.message).join(', ')

    FlashMessage({ message: message })
  }

  async function update(cache, { data: result }) {
    if (result.assignOrder) {
      const data = cache.readQuery({ query: ORDERS })
      if (data) {
        const index = data.riderOrders.findIndex(
          o => o._id === result.assignOrder._id
        )
        if (index > -1) {
          data.riderOrders[index].rider = result.assignOrder.rider
          data.riderOrders[index].orderStatus = result.assignOrder.orderStatus
          cache.writeQuery({
            query: ORDERS,
            data: { riderOrders: [...data.riderOrders] }
          })
        }
      }
    }
    if (result.updateOrderStatusRider) {
      const data = cache.readQuery({ query: ORDERS })
      if (data) {
        const index = data.riderOrders.findIndex(
          o => o._id === result.updateOrderStatusRider._id
        )
        if (index > -1) {
          data.riderOrders[index].orderStatus =
            result.updateOrderStatusRider.orderStatus
          cache.writeQuery({
            query: ORDERS,
            data: { riderOrders: [...data.riderOrders] }
          })
        }
      }
    }
  }
  return {
    active,
    order,
    dataConfig,
    currentSeconds,
    preparationSeconds,
    loadingConfig,
    errorConfig,
    mutateAssignOrder,
    mutateOrderStatus,
    loadingAssignOrder,
    loadingOrderStatus
  }
}

export default useDetails
