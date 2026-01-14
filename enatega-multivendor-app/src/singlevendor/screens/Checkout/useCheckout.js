import { useMutation, useQuery } from '@apollo/client'
import { CALCULATE_CHECKOUT } from '../../apollo/queries'
import { COUPON, PLACE_ORDER } from '../../apollo/mutations'
import { Alert } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'

const useCheckout = ({ fulfillmentMode, deliveryAddress, selectedVoucher }) => {
  const navigation = useNavigation()
  const [placeOrder, { loading: placingOrder }] = useMutation(PLACE_ORDER, {
    onCompleted: (data) => {
      console.log('Order placed successfully', data?.placeOrder?._id)
      // navigation.navigate('OrderConfirmation', { data })
      // navigation.replace('OrderConfirmation', { data })
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'OrderConfirmation',
              params: { orderData: data?.placeOrder, orderId: data?.placeOrder?._id }
            }
          ]
        })
      )
    },
    onError: (err) => {
      console.log('Error placing order', err)
    }
  })

  const isPickup = fulfillmentMode === 'collection'

  console.log('Fulfillment Mode:', fulfillmentMode)
  console.log('deliveryAddress:', deliveryAddress)

  const latDestination = deliveryAddress?.latitude ?? null
  const longDestination = deliveryAddress?.longitude ?? null

  const variables = {
    isPickup,
    latDestination,
    longDestination,
    coupon: selectedVoucher ? selectedVoucher?._id : ''
  }

  console.log('Checkout Variables:', variables)

  const { data, loading, error, refetch } = useQuery(CALCULATE_CHECKOUT, {
    variables,
    fetchPolicy: 'network-only'
  })

  const recalculateSummary = (newVariables = {}) => {
    refetch(variables)
  }

  const checkout = data?.calculateCheckout

  console.log('Checkout Data:', checkout, error)
  return {
    loading,
    error,
    refetch,

    // Raw
    checkout,

    // UI-friendly derived values
    subtotal: checkout?.subtotal ?? 0,
    deliveryFee: checkout?.deliveryCharges ?? 0,
    serviceFee: checkout?.serviceFee ?? 0,
    minimumOrderFee: checkout?.minimumOrderFee ?? 0,
    taxAmount: checkout?.taxAmount ?? 0,
    totalDiscount: checkout?.totalDiscount ?? 0,
    total: checkout?.grandTotal ?? 0,

    minimumOrderAmount: checkout?.minimumOrderAmount ?? 0,
    isBelowMinimumOrder: checkout?.isBelowMinimumOrder ?? false,
    isBelowMaximumOrder: checkout?.isBelowMaximumOrder ?? false,
    deliveryDiscount: checkout?.deliveryDiscount ?? 0,
    items: checkout?.items ?? [],

    // deliveryCharges: checkout?.deliveryCharges ?? 0,
    originalDeliveryCharges: checkout?.originalDeliveryCharges ?? 0,
    freeDeliveriesRemaining: checkout?.freeDeliveriesRemaining ?? 0,
    couponDiscountAmount: checkout?.couponDiscountAmount ?? 0,
    couponApplied: checkout?.couponApplied ?? false,
    priorityDeliveryFee: checkout?.priorityDeliveryFees,
    // deliveryDiscount: checkout?.deliveryDiscount ?? 0,
    placeOrder,
    placingOrder,
    recalculateSummary
  }
}

export default useCheckout
