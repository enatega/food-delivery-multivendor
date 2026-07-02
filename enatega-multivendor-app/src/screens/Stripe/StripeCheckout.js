import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { myOrders } from '../../apollo/queries'
import gql from 'graphql-tag'
import useEnvVars from '../../../environment'
import { useApolloClient } from '@apollo/client'
import UserContext from '../../context/User'
import analytics from '../../utils/analytics'

import { useTranslation } from 'react-i18next'

const MYORDERS = gql`
  ${myOrders}
`

const isAllowedHost = (url, allowedHosts) => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`))
  } catch {
    return false
  }
}

function StripeCheckout(props) {
  const Analytics = analytics()

  const { SERVER_REST_URL } = useEnvVars()
  const { t } = useTranslation()
  const [loading, loadingSetter] = useState(true)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [confirmationTimedOut, setConfirmationTimedOut] = useState(false)
  const { clearCart } = useContext(UserContext)
  const client = useApolloClient()
  const { _id } = props?.route.params
  const isHandlingSuccessRef = useRef(false)
  const backendHost = useRef(null)
  const stripeAllowedHosts = useRef([
    'checkout.stripe.com',
    'js.stripe.com',
    'api.stripe.com',
    'hooks.stripe.com',
    'stripe.com',
    'stripe.network',
    'm.stripe.network',
    'q.stripe.com',
    'b.stripecdn.com'
  ])

  useEffect(() => {
    try {
      backendHost.current = new URL(SERVER_REST_URL).hostname.toLowerCase()
    } catch {
      backendHost.current = null
    }
  }, [SERVER_REST_URL])

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      title: t('stripeCheckout')
    })
  }, [props?.navigation])

  function onClose(flag) {
    // showMessage here
    props?.navigation.goBack()
  }
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_STRIPE)
    }
    Track()
  }, [])

  async function waitForConfirmedOrder() {
    const maxAttempts = 20

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await client.query({
          query: MYORDERS,
          fetchPolicy: 'network-only'
        })
        const order = result.data.orders.find(
          (item) => item.orderId === _id
        )

        const isPaidOrder =
          order &&
          (String(order.paymentStatus).toUpperCase() === 'PAID' || Number(order.paidAmount || 0) > 0)

        if (isPaidOrder) {
          await clearCart()
          props?.navigation.reset({
            routes: [
              { name: 'Main' },
              {
                name: 'OrderDetail',
                params: { _id: order._id }
              }
            ]
          })
          return
        }
      } catch (error) {
        console.log('Stripe confirmation polling error', error)
      }

      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    setConfirmationTimedOut(true)
  }

  async function handleResponse(data) {
    if (data.url.includes('stripe/success')) {
      if (isHandlingSuccessRef.current) return
      isHandlingSuccessRef.current = true
      setIsConfirmingOrder(true)
      loadingSetter(false)
      await waitForConfirmedOrder()
    } else if (data.url.includes('stripe/cancel')) {
      props?.navigation.goBack()
      // goBack on Payment Screen
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ display: isConfirmingOrder ? 'none' : 'flex' }}
        javaScriptEnabled={true}
        // scrollEnabled={false}
        bounces={false}
        originWhitelist={['https://*', 'http://*']}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request
          if (!url) return false
          const allowedHosts = [...stripeAllowedHosts.current]
          if (backendHost.current) {
            allowedHosts.push(backendHost.current)
          }
          return isAllowedHost(url, allowedHosts)
        }}
        onLoad={() => {
          loadingSetter(false)
        }}
        source={{
          uri: `${SERVER_REST_URL}stripe/create-checkout-session?id=${_id}`
        }}
        scalesPageToFit={true}
        onNavigationStateChange={(data) => {
          handleResponse(data)
        }}
      />
      {loading ? <ActivityIndicator style={{ position: 'absolute', bottom: '50%', left: '50%' }} /> : null}
      {isConfirmingOrder ? (
        <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 20, fontSize: 22, fontWeight: '600', textAlign: 'center', color: '#111827' }}>
            {confirmationTimedOut ? 'Payment submitted' : 'Confirming your order'}
          </Text>
          <Text style={{ marginTop: 12, fontSize: 15, lineHeight: 22, textAlign: 'center', color: '#4B5563' }}>
            {confirmationTimedOut
              ? "Your payment was submitted successfully. We're still waiting for the backend to confirm the order, so it may appear shortly in My Orders."
              : "Your card payment was submitted. We're waiting for backend confirmation before opening your order tracking screen."}
          </Text>
          {confirmationTimedOut ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props?.navigation.reset({
                  routes: [{ name: 'Main' }]
                })
              }}
              style={{ marginTop: 24, borderRadius: 999, backgroundColor: '#7AC943', paddingHorizontal: 20, paddingVertical: 12 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Go to home</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

export default StripeCheckout
