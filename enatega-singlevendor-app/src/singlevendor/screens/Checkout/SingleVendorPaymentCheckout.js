import { gql, useSubscription } from '@apollo/client'
import { CommonActions, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

import useEnvVars from '../../../../environment'
import UserContext from '../../../context/User'
import { useModeSensitiveOperation } from '../../../mode/AppModeContext'
import { APP_MODES } from '../../../mode/constants'
import { removeModeItem } from '../../../mode/storage'
import { getToken } from '../../../utils/secureToken'
import { paymentSuccess } from '../../apollo/subscriptions'
import useCartStore from '../../stores/useCartStore'
import LiveActivityService from '../../../utils/liveActivityService'

const PAYMENT_SUCCESS = gql`
  ${paymentSuccess}
`

const allowedPaymentHosts = [
  'checkout.stripe.com',
  'js.stripe.com',
  'api.stripe.com',
  'stripe.com',
  'stripe.network',
  'stripecdn.com',
  'paypal.com',
  'paypalobjects.com'
]

const isAllowedHost = (url, backendHost) => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return (
      host === backendHost ||
      allowedPaymentHosts.some(
        allowedHost =>
          host === allowedHost || host.endsWith(`.${allowedHost}`)
      )
    )
  } catch {
    return false
  }
}

const SingleVendorPaymentCheckout = ({ route }) => {
  const navigation = useNavigation()
  const { SERVER_REST_URL } = useEnvVars()
  const { profile } = useContext(UserContext)
  const clearCart = useCartStore(state => state.clearCart)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)
  const completed = useRef(false)
  const {
    _id: displayOrderId,
    orderId,
    isPickedUp = false,
    payment_method: paymentMethod = 'card'
  } = route?.params || {}

  useModeSensitiveOperation(true)

  const backendHost = useMemo(() => {
    try {
      return new URL(SERVER_REST_URL).hostname.toLowerCase()
    } catch {
      return ''
    }
  }, [SERVER_REST_URL])
  const paymentUrl = useMemo(() => {
    const url = new URL('stripe/create-checkout-session', SERVER_REST_URL)
    url.searchParams.set('id', displayOrderId || '')
    url.searchParams.set('payment_method', paymentMethod)
    return url.toString()
  }, [SERVER_REST_URL, displayOrderId, paymentMethod])

  useEffect(() => {
    let mounted = true
    getToken(APP_MODES.SINGLE).then(token => {
      if (mounted) setAccessToken(token || '')
    })
    return () => { mounted = false }
  }, [])

  const completePayment = async() => {
    if (completed.current) return
    completed.current = true
    if (orderId && !isPickedUp) {
      LiveActivityService.initiateForOrder({
        orderId,
        displayOrderId,
        mode: APP_MODES.SINGLE
      }).catch(error => console.warn('Unable to start delivery Live Activity', error?.message))
    }
    clearCart()
    await removeModeItem('selectedVoucher', APP_MODES.SINGLE)
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
            params: {
              orderId: displayOrderId
            }
          }
        ]
      })
    )
  }

  const { data } = useSubscription(PAYMENT_SUCCESS, {
    variables: { userId: profile?._id },
    skip: !profile?._id
  })

  useEffect(() => {
    const payment = data?.subscriptionPaymentSuccess
    if (
      payment &&
      String(payment.orderId) === String(displayOrderId)
    ) {
      completePayment().catch(() => {})
    }
  }, [data, displayOrderId])

  const handleNavigation = state => {
    if (state.url.includes('stripe/cancel')) {
      navigation.goBack()
      return
    }
    if (state.url.includes('stripe/success')) {
      completePayment().catch(() => {})
    }
  }

  if (!displayOrderId || !SERVER_REST_URL || accessToken === '') {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text>Payment could not be started. Please return to your order.</Text>
      </View>
    )
  }

  if (accessToken === null) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        bounces={false}
        javaScriptEnabled
        onLoad={() => setLoading(false)}
        onNavigationStateChange={handleNavigation}
        onShouldStartLoadWithRequest={({ url }) =>
          isAllowedHost(url, backendHost)
        }
        originWhitelist={['https://*']}
        source={{
          uri: paymentUrl,
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        }}
      />
      {loading
        ? (
          <ActivityIndicator
            style={{ bottom: '50%', left: '50%', position: 'absolute' }}
          />
          )
        : null}
    </View>
  )
}

export default SingleVendorPaymentCheckout
