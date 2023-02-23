import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { myOrders } from '../../apollo/queries'
import gql from 'graphql-tag'
import getEnvVars from '../../../environment'
import { useApolloClient } from '@apollo/client'
import UserContext from '../../context/User'
import Analytics from '../../utils/analytics'
const { SERVER_URL } = getEnvVars()
const MYORDERS = gql`
  ${myOrders}
`

function StripeCheckout(props) {
  const [loading, loadingSetter] = useState(true)
  const { clearCart } = useContext(UserContext)
  const client = useApolloClient()
  const { _id } = props.route.params

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: 'Stripe Checkout'
    })
  }, [props.navigation])

  function onClose(flag) {
    // showMessage here
    props.navigation.goBack()
  }
  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_STRIPE)
  }, [])
  async function onPaymentSuccess() {
    const result = await client.query({
      query: MYORDERS,
      fetchPolicy: 'network-only'
    })
    const order = result.data.orders.find(order => order.orderId === _id)
    await clearCart()
    props.navigation.reset({
      routes: [
        { name: 'Main' },
        {
          name: 'OrderDetail',
          params: { _id: order._id }
        }
      ]
    })
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
          uri: SERVER_URL + 'stripe/create-checkout-session?id=' + _id
        }}
        scalesPageToFit={true}
        onNavigationStateChange={data => {
          if (data.title === 'cancel') onClose(true)
          if (data.title === 'failed') onClose(false)
          if (data.title === 'success') onPaymentSuccess()
        }}
      />
      {loading ? (
        <ActivityIndicator
          style={{ position: 'absolute', bottom: '50%', left: '50%' }}
        />
      ) : null}
    </View>
  )
}

export default StripeCheckout
