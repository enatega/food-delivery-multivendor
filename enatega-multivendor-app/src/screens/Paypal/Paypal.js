import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from 'react'
import { WebView } from 'react-native-webview'
import { ActivityIndicator, View, Text } from 'react-native'
import gql from 'graphql-tag'
import { myOrders } from '../../apollo/queries'

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

function Paypal(props) {
  const Analytics = analytics()

  const { SERVER_URL } = useEnvVars()

  const { t } = useTranslation()
  const [loading, loadingSetter] = useState(true)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [confirmationTimedOut, setConfirmationTimedOut] = useState(false)
  const { clearCart } = useContext(UserContext)
  const client = useApolloClient()
  const [_id] = useState(props?.route.params._id ?? null)
  const isHandlingSuccessRef = useRef(false)
  const backendHost = useRef(null)
  const paypalAllowedHosts = useRef([
    'paypal.com',
    'www.paypal.com',
    'sandbox.paypal.com',
    'www.sandbox.paypal.com',
    'paypalobjects.com',
    'www.paypalobjects.com'
  ])

  useEffect(() => {
    try {
      backendHost.current = new URL(SERVER_URL).hostname.toLowerCase()
    } catch {
      backendHost.current = null
    }
  }, [SERVER_URL])

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PAYPAL)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      title: t('paypalCheckout')
    })
  }, [props?.navigation])

  async function waitForConfirmedOrder() {
    const maxAttempts = 20

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await client.query({
          query: MYORDERS,
          fetchPolicy: 'network-only'
        })
        const order = result.data.orders.find((item) => item.orderId === _id)
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
        console.log('PayPal confirmation polling error', error)
      }

      await new Promise((resolve) => setTimeout(resolve, 3000))
    }

    setConfirmationTimedOut(true)
  }

  async function handleResponse(data) {
    if (data.url.includes('paypal/success')) {
      if (isHandlingSuccessRef.current) return
      isHandlingSuccessRef.current = true
      setIsConfirmingOrder(true)
      loadingSetter(false)
      await waitForConfirmedOrder()
    } else if (data.url.includes('paypal/cancel')) {
      props?.navigation.goBack()
      // goBack on Payment Screen
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ display: isConfirmingOrder ? 'none' : 'flex' }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        bounces={false}
        originWhitelist={['https://*', 'http://*']}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request
          if (!url) return false
          const allowedHosts = [...paypalAllowedHosts.current]
          if (backendHost.current) {
            allowedHosts.push(backendHost.current)
          }
          return isAllowedHost(url, allowedHosts)
        }}
        source={{ uri: `${SERVER_URL}paypal?id=${_id}` }}
        onNavigationStateChange={data => {
          handleResponse(data)
        }}
        onLoad={() => {
          loadingSetter(false)
        }}
      />
      {loading ? (
        <ActivityIndicator
          style={{ position: 'absolute', bottom: '50%', left: '50%' }}
        />
      ) : null}
      {isConfirmingOrder ? (
        <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" />
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: '600', textAlign: 'center', color: '#111827' }}>
              {confirmationTimedOut ? 'Payment submitted' : 'Confirming your order'}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  )
}

export default Paypal
