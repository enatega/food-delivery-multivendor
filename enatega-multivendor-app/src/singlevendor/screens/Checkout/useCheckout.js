import { useMutation, useQuery } from '@apollo/client'
import { CALCULATE_CHECKOUT } from '../../apollo/queries'
import { PLACE_ORDER } from '../../apollo/mutations'
import { CommonActions, useNavigation } from '@react-navigation/native'
import useCartStore from '../../stores/useCartStore'
import { useContext, useRef } from 'react'
import ConfigurationContext from '../../../context/Configuration'
import { APP_MODES } from '../../../mode/constants'
import { recordOrderOrigin } from '../../../mode/orderOrigin'
import { useModeSensitiveOperation } from '../../../mode/AppModeContext'
import LiveActivityService from '../../../utils/liveActivityService'

const ADDRESS_DELIVERY_ERROR = "Sorry! we can't deliver to your address."

const toCheckoutCoordinate = (value) => {
  if (value === null || value === undefined || value === '') return null
  const coordinate = Number(value)
  return Number.isFinite(coordinate) ? coordinate : null
}

const useCheckout = ({ fulfillmentMode, deliveryAddress, selectedVoucher, onPlaceOrderError }) => {
  const navigation = useNavigation()
  const { clearCart } = useCartStore()
  const configuration = useContext(ConfigurationContext)
  const currencySymbol = configuration?.currencySymbol || '€'
  const idempotencyKeyRef = useRef(`sv-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const [placeOrder, { loading: placingOrder }] = useMutation(PLACE_ORDER, {
    onCompleted: (data) => {
      recordOrderOrigin(data?.placeOrder, APP_MODES.SINGLE).catch(() => {})
      console.log('Order placed successfully', data?.placeOrder?.paymentMethod)
      // navigation.navigate('OrderConfirmation', { data })
      // navigation.replace('OrderConfirmation', { data })

      // Empty cart

      const paymentMethod = String(data?.placeOrder?.paymentMethod).trim().toUpperCase()
      console.log('Normalized paymentMethod:', paymentMethod)
      if (paymentMethod.includes('STRIPE') || paymentMethod.includes('PAYPAL') || paymentMethod.includes('GOOGLE_PAY') || paymentMethod.includes('APPLE_PAY')) {
        console.log('Navigating to StripeCheckout with params:')
        setTimeout(() => {
          navigation.navigate('SVPaymentCheckout', {
            _id: data?.placeOrder?.orderId,
            orderId: data?.placeOrder?._id,
            isPickedUp: Boolean(data?.placeOrder?.isPickedUp),
            amount: data?.placeOrder?.orderAmount,
            // email: data?.placeOrder?.user.email,
            currency: currencySymbol,
            payment_method: paymentMethod.includes('STRIPE') ? 'card' : paymentMethod.includes('PAYPAL') ? 'paypal' : paymentMethod.includes('GOOGLE_PAY') ? 'googlepay' : paymentMethod.includes('APPLE_PAY') ? 'applepay' : 'card'
          })
        }, 500)
      } else {
        if (data?.placeOrder?._id && !data?.placeOrder?.isPickedUp) {
          LiveActivityService.initiateForOrder({
            orderId: data.placeOrder._id,
            displayOrderId: data.placeOrder.orderId,
            mode: APP_MODES.SINGLE
          }).catch((error) => console.warn('Unable to start delivery Live Activity', error?.message))
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'SVRoot',
                state: {
                  index: 0,
                  routes: [{ name: 'SVDiscovery' }]
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
  useModeSensitiveOperation(placingOrder)

  const isPickup = fulfillmentMode === 'collection'

  console.log('Fulfillment Mode:', fulfillmentMode)
  console.log('deliveryAddress:', deliveryAddress)

  const latDestination = toCheckoutCoordinate(deliveryAddress?.latitude)
  const longDestination = toCheckoutCoordinate(deliveryAddress?.longitude)

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
    dealDiscount: checkout?.discountDetails?.dealDiscount ?? 0,
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
    checkoutQuoteId: checkout?.checkoutQuoteId,
    idempotencyKey: idempotencyKeyRef.current,
    placeOrder,
    placingOrder,
    recalculateSummary
  }
}

export default useCheckout
