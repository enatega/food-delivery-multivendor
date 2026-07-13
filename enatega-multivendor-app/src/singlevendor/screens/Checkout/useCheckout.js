import { useMutation, useQuery } from '@apollo/client'
import { CALCULATE_CHECKOUT } from '../../apollo/queries'
import { COUPON, PLACE_ORDER } from '../../apollo/mutations'
import { Alert } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import useCartStore from '../../stores/useCartStore'
import { useContext } from 'react'
import ConfigurationContext from '../../../context/Configuration'

const ADDRESS_DELIVERY_ERROR = "Sorry! we can't deliver to your address."

const useCheckout = ({ fulfillmentMode, deliveryAddress, selectedVoucher, onPlaceOrderError }) => {
  const navigation = useNavigation()
  const { clearCart } = useCartStore()
  const configuration = useContext(ConfigurationContext)
  const currencySymbol = configuration?.currencySymbol || '€'
  const [placeOrder, { loading: placingOrder }] = useMutation(PLACE_ORDER, {
    onCompleted: (data) => {
      console.log('Order placed successfully', data?.placeOrder?.paymentMethod)
      // navigation.navigate('OrderConfirmation', { data })
      // navigation.replace('OrderConfirmation', { data })

      //empty cart

      const paymentMethod = String(data?.placeOrder?.paymentMethod).trim().toUpperCase()
      console.log('Normalized paymentMethod:', paymentMethod)
      if (paymentMethod.includes('STRIPE') || paymentMethod.includes('PAYPAL') || paymentMethod.includes('GOOGLE_PAY') || paymentMethod.includes('APPLE_PAY')) {
        console.log('Navigating to StripeCheckout with params:')
        setTimeout(() => {
          const paymentPage = paymentMethod.includes('STRIPE') ? 'StripeCheckout' : 'Paypal'
          navigation.navigate('StripeCheckout', {
            _id: data?.placeOrder?.orderId,
            orderId: data?.placeOrder?._id,
            amount: data?.placeOrder?.orderAmount,
            // email: data?.placeOrder?.user.email,
            currency: currencySymbol,
            isPaypal: paymentPage == 'Paypal' ? true : false,
            payment_method: paymentMethod.includes('STRIPE') ? 'card' : paymentMethod.includes('PAYPAL') ? 'paypal' : paymentMethod.includes('GOOGLE_PAY') ? 'googlepay' : paymentMethod.includes('APPLE_PAY') ? 'applepay' : 'card'
          })
        }, 500)
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'Main',
                state: {
                  index: 0,
                  routes: [{ name: 'Discovery' }]
                }
              },
              {
                name: 'OrderConfirmation',
                params: { orderData: data?.placeOrder, orderId: data?.placeOrder?.orderId }
              }
            ]
          })
        )
        setTimeout(() => {
          clearCart()
        }, 500)
      }
    },
    onError: (err) => {
      console.log('Error placing order from useCheckout', err)
      const message = err?.graphQLErrors?.[0]?.message || err?.message || ''
      if (message === ADDRESS_DELIVERY_ERROR && onPlaceOrderError) {
        onPlaceOrderError()
      }
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
    currencySymbol,
    // UI-friendly derived values
    subtotal: checkout?.subtotal ?? 0,
    deliveryFee: checkout?.deliveryCharges ?? 0,
    serviceFee: checkout?.serviceFee ?? 0,
    minimumOrderFee: checkout?.minimumOrderFee ?? 0,
    taxAmount: checkout?.taxAmount ?? 0,
    totalDiscount: checkout?.totalDiscount ?? 0,
    total: checkout?.grandTotal ?? 0,

    minimumOrderAmount: checkout?.minimumOrderAmount ?? 0,
    maximumOrderAmount: checkout?.maximumOrderAmount ?? 0,
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
    creditsUsed: checkout?.creditsUsed ?? 0,
    placeOrder,
    placingOrder,
    recalculateSummary
  }
}

export default useCheckout
