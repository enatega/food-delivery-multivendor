import { useMutation, useQuery } from '@apollo/client'
import { CALCULATE_CHECKOUT, ORDER_DETAILS_PAGE } from '../../apollo/queries'
import { COUPON, PLACE_ORDER } from '../../apollo/mutations'
import { Alert } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'

const useOrderConfirmation = ({ orderId }) => {
  const navigation = useNavigation()

  const variables = {
    orderId
  }

  console.log('Confirmation Variables:', variables)

  const { data, loading, error, refetch } = useQuery(ORDER_DETAILS_PAGE, {
    variables,
    fetchPolicy: 'network-only'
  })

  const confirmation = data?.orderDetailsPage?.data
  const initialOrder = data?.orderDetailsPage?.rawOrder

  console.log('Checkout Data:', data,confirmation?.items, error)
    console.log("🚀 ~ useOrderConfirmation ~ confirmation?.couponDiscount:", confirmation?.couponDiscount)
  return {
    loading,
    error,
    refetch,

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
    tipAmount:confirmation?.tipping,
    orderStatus:confirmation?.orderStatus,
    addressLabel:confirmation?.deliveryAddress?.label,
    address:confirmation?.deliveryAddress?.deliveryAddress,
    customerLocation: {longitude:parseFloat(confirmation?.deliveryAddress?.location?.coordinates[0]),latitude:parseFloat(confirmation?.deliveryAddress?.location?.coordinates[1])},
    orderItems: confirmation?.items ?? [],
    initialOrder: initialOrder,
    orderNo: confirmation?.orderId,
    riderPhone: confirmation?.rider?.phone
    // deliveryDiscount: confirmation?.deliveryDiscount ?? 0,
  }
}

export default useOrderConfirmation
