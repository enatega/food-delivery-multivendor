import { useContext, useState, useEffect } from 'react'
import UserContext from '../../../context/user'
import { gql, useQuery, useMutation, useSubscription } from '@apollo/client'
import { configuration, riderOrders } from '../../../apollo/queries'
import { assignOrder, updateOrderStatusRider } from '../../../apollo/mutations'
import { TabsContext } from '../../../context/tabs'
import { FlashMessage } from '../../FlashMessage/FlashMessage'
import { subscriptionOrder } from '../../../apollo/subscriptions'
import { useTranslation } from 'react-i18next'

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
  const { assignedOrders, loadingAssigned,dataProfile} = useContext(UserContext)

  const [order, setOrder] = useState(orderData)
  const { t } = useTranslation()
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
      onCompleted: onCompleteAssign,
      onError: onErrorAssign,
      update: onUpdateAssign
    }
  )

  const [
    mutateOrderStatus,
    { loading: loadingOrderStatus }
  ] = useMutation(UPDATE_ORDER_STATUS, { onCompleted: onCompletedStatus, onError: onErrorStatus, update: onUpdateStatus })

  async function onCompletedStatus(result) {
    console.log("result---",result)
    if (result?.updateOrderStatusRider) {
      FlashMessage({
        message: `${t('orderMarkedAs')} ${t(
          result?.updateOrderStatusRider?.orderStatus
        )}`
      })
    }
    if (result?.assignOrder) {
      FlashMessage({
        message: t('orderAssingnedFlash')
      })
      setActive('MyOrders')
    }
  }
  async function onCompleteAssign(result) {
    console.log("onCompleteAssign")
    
  }
  async function onErrorAssign(result) {
    console.log("onErrorAssign")
    
  }

  async function onUpdateAssign(result) {
    console.log("onUpdateAssign")
    
  }
  function onErrorStatus({ graphQLErrors, networkError }) {
    console.log('graphQLErrors=>>', graphQLErrors)
    let message = t('errorOccured') 
    console.log("message",message)
    if (networkError) message = 'Internal Server Error'
    console.log("message",message)
    if (graphQLErrors) message = graphQLErrors.map(o => o.message).join(', ')
      console.log("message",message)
    FlashMessage({ message: message })
  }

  async function onUpdateStatus(cache, { data: result }) {
    console.log("update status",result?.assignOrder)
    if (result?.assignOrder) {
      const data = cache.readQuery({ query: ORDERS })
      console.log("data-->>",data)
      if (data) {
        const index = data?.riderOrders?.findIndex(
          o => o._id === result.assignOrder._id
        )
        console.log("index-->>",index)
        if (index > -1) {
          data.riderOrders[index].rider = result?.assignOrder?.rider
          console.log("ridersOrder-rider->>",data.riderOrders[index].rider)
          data.riderOrders[index].orderStatus = result?.assignOrder?.orderStatus
          console.log("ridersOrder-orderstatus->>",data.riderOrders[index].orderStatus)
          cache.writeQuery({
            query: ORDERS,
            data: { riderOrders: [...data.riderOrders] }
          })
          console.log("Initial writeQuery executed with data:", data.riderOrders);
        }
      }
    }
    if (result?.updateOrderStatusRider) {
      console.log("updateOrderStatusRider exists:", result?.updateOrderStatusRider);
      const data = cache.readQuery({ query: ORDERS })
      console.log("Read data from cache:", data);
      if (data) {
        const index = data?.riderOrders?.findIndex(
          o => o._id === result?.updateOrderStatusRider?._id   
        )
        console.log("Found index of updated order:", index);
        
        if (index > -1) {
          console.log("Before updating order status:", data?.riderOrders[index]);
          data.riderOrders[index].orderStatus =
            result?.updateOrderStatusRider?.orderStatus
            console.log("After updating order status:", data?.riderOrders[index]);
          cache.writeQuery({
            query: ORDERS,
            data: { riderOrders: [...data?.riderOrders] }
          })
          console.log("Updated cache with new order status:", data.riderOrders);
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
    loadingOrderStatus,
    dataProfile
  }
}

export default useDetails
