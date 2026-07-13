import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { myOrders } from '../../apollo/queries'
import gql from 'graphql-tag'
import useEnvVars from '../../../environment'
import { useApolloClient, useSubscription } from '@apollo/client'
import UserContext from '../../context/User'
import analytics from '../../utils/analytics'

import { useTranslation } from 'react-i18next'
import { useVendorModeStore } from '../../singlevendor'
import { CommonActions, useNavigation } from '@react-navigation/native'
import useCartStore from '../../singlevendor/stores/useCartStore'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { paymentSuccess } from '../../singlevendor/apollo/subscriptions'

const MYORDERS = gql`
  ${myOrders}
`

const SUBSCRIPTION_PAYMENT_SUCCESS = gql`
  ${paymentSuccess}
`

function StripeCheckout(props) {
  const Analytics = analytics()

  const { SERVER_REST_URL } = useEnvVars()
  const { t } = useTranslation()
  const [loading, loadingSetter] = useState(true)
  const { clearCart, profile } = useContext(UserContext)
  const client = useApolloClient()
  const { _id, orderId, isPaypal, payment_method } = props?.route.params
  const vendorMode = useVendorModeStore((state) => state.vendorMode)
  const navigation = useNavigation()
  console.log('StripeCheckout props params:')
  const paymentUrl = `${SERVER_REST_URL}stripe/create-checkout-session?id=${_id}&payment_method=${payment_method}`
  const successPostFix = 'stripe/success'
  const cancelPostFix = 'stripe/cancel'
  console.log('paymentUrl:', paymentUrl)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { clearCart: clearSingleVendorCart } = useCartStore()

  // useLayoutEffect(() => {
  //   props?.navigation.setOptions({
  //     headerRight: null,
  //     title: t('stripeCheckout')
  //   })
  // }, [props?.navigation])

  const { data: paymentSuccessData, error } = useSubscription(SUBSCRIPTION_PAYMENT_SUCCESS, {
    variables: { userId: profile?._id },
    shouldResubscribe: true
  })

  useEffect(() => {
    if (paymentSuccessData?.subscriptionPaymentSuccess) {
      const payment = paymentSuccessData?.subscriptionPaymentSuccess

      console.log('✅ Payment Success:', payment.orderId, _id, orderId)

      if (_id == payment?.orderId && vendorMode == 'SINGLE') {
        proceedPaymentSuccess()
      }

      // You can:
      // - update redux state
      // - navigate to success screen
      // - unlock premium features
    }
  }, [paymentSuccessData])

  const proceedPaymentSuccess = () => {
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
            params: { orderId: _id }
          }
        ]
      })
    )
    setTimeout(() => {
      clearSingleVendorCart()
      AsyncStorage.removeItem('selectedVoucher')
    }, 500)
  }

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      title: t('stripeCheckout'),
      headerStyle: {
        backgroundColor: currentTheme.primaryBlue
      },
      headerTintColor: '#fff' // title & back button color
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

  async function handleResponse(data) {
    console.log('WebView navigation state change:', data.url)
    if (data.url.includes(successPostFix)) {
      if (vendorMode == 'SINGLE') {
        if (isPaypal) {
          proceedPaymentSuccess()
        }
      } else {
        const result = await client.query({
          query: MYORDERS,
          fetchPolicy: 'network-only'
        })
        const order = result.data.orders.find((order) => order.orderId === _id)
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
      }
    } else if (data.url.includes(cancelPostFix)) {
      props?.navigation.goBack()
      // goBack on Payment Screen
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        javaScriptEnabled={true}
        // scrollEnabled={false}
        bounces={false}
        onLoad={() => {
          loadingSetter(false)
        }}
        source={{
          uri: paymentUrl
        }}
        scalesPageToFit={true}
        onNavigationStateChange={(data) => {
          handleResponse(data)
        }}
      />
      {loading ? <ActivityIndicator style={{ position: 'absolute', bottom: '50%', left: '50%' }} /> : null}
    </View>
  )
}

export default StripeCheckout
