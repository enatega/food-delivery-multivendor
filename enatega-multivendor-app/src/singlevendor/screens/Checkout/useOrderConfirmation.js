import { useEffect, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { ORDER_DETAILS_PAGE, Recent_ActiveOrder } from '../../apollo/queries'
import useNetworkStatus from '../../../utils/useNetworkStatus'

const useOrderConfirmation = ({ orderId, isHome = false } = {}) => {
  const { isConnected } = useNetworkStatus()
  const wasOfflineRef = useRef(false)

  const variables = {
    orderId
  }

  console.log('Confirmation Variables:', variables)

  const queryDocument = isHome ? Recent_ActiveOrder : ORDER_DETAILS_PAGE
  const shouldSkip = !isConnected || (!isHome && !orderId)

  const { data, loading, error, refetch } = useQuery(queryDocument, {
    variables: isHome ? undefined : variables,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: shouldSkip
  })

  useEffect(() => {
    if (!isConnected) {
      wasOfflineRef.current = true
      return
    }

    if (wasOfflineRef.current) {
      wasOfflineRef.current = false
      refetch?.()
    }
  }, [isConnected, refetch])

  const orderQueryResponse = isHome ? data?.recentActiveOrder : data?.orderDetailsPage
  const confirmation = orderQueryResponse?.data
  const initialOrder = orderQueryResponse?.rawOrder

  const toNumber = (value) => {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  console.log('Checkout Data:', data, confirmation?.items, error)
  console.log('🚀 ~ useOrderConfirmation ~ confirmation?.couponDiscount:', confirmation)
  return {
    loading,
    error,
    refetch,

    hasActiveOrder: Boolean(orderQueryResponse?.success && (confirmation || initialOrder)),
    recentActiveOrderMessage: orderQueryResponse?.message,

    // Raw

    // UI-friendly derived values
    subtotal: confirmation?.itemsSubTotal ?? 0,
    deliveryFee: confirmation?.deliveryCharges ?? 0,
    serviceFee: confirmation?.taxationAmount ?? 0,
    minimumOrderFee: confirmation?.minimumOrderFee ?? 0,
    taxAmount: confirmation?.taxationAmount ?? 0,

    total: confirmation?.orderAmount ?? 0,

    minimumOrderAmount: confirmation?.minimumOrderAmount ?? 0,
    isBelowMinimumOrder: confirmation?.isBelowMinimumOrder ?? false,
    isBelowMaximumOrder: confirmation?.isBelowMaximumOrder ?? false,
    deliveryDiscount: confirmation?.deliveryDiscount ?? 0,

    // deliveryCharges: confirmation?.deliveryCharges ?? 0,
    originalDeliveryCharges: confirmation?.deliveryCharges ?? 0,
    freeDeliveriesRemaining: confirmation?.freeDeliveriesRemaining ?? 0,
    couponDiscountAmount: confirmation?.couponDiscount ?? 0,
    couponApplied: confirmation?.couponDiscountApplied ?? false,
    priorityDeliveryFee: confirmation?.priorityDeliveryFees,
    isPriority: confirmation?.isPriority,
    tipAmount: confirmation?.tipping,
    orderStatus: confirmation?.orderStatus ?? initialOrder?.orderStatus,
    addressLabel: confirmation?.deliveryAddress?.label,
    address:confirmation?.deliveryAddress?.deliveryAddress ?? initialOrder?.deliveryAddress?.deliveryAddress,
    customerLocation: {
      longitude: toNumber(confirmation?.deliveryAddress?.location?.coordinates?.[0] ?? initialOrder?.deliveryAddress?.location?.coordinates?.[0]),
      latitude: toNumber(confirmation?.deliveryAddress?.location?.coordinates?.[1] ?? initialOrder?.deliveryAddress?.location?.coordinates?.[1])
    },
    orderItems: confirmation?.items ?? [],
    initialOrder,
    orderNo: confirmation?.orderId ?? initialOrder?.orderId,
    creditsUsed: confirmation?.creditsApplied ?? 0,
    // riderPhone: confirmation?.rider?.phone
    // deliveryDiscount: confirmation?.deliveryDiscount ?? 0,
  }
}

export default useOrderConfirmation
