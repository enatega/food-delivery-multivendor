import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
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

function HypCheckout(props) {
  const Analytics = analytics()

  const { SERVER_URL } = useEnvVars()
  const { t } = useTranslation()
  const [loading, loadingSetter] = useState(true)
  const { clearCart } = useContext(UserContext)
  const client = useApolloClient()
  const { _id } = props.route.params
  console.log('_id => ', JSON.stringify(props.route, null, 3))

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: 'Hyp Checkout'
    })
  }, [props.navigation])

  function onClose(flag) {
    // showMessage here
    props.navigation.goBack()
  }
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_STRIPE)
    }
    Track()
  }, [])

  async function handleResponse(data) {
    if (data.url.includes('hyp/success')) {
      const result = await client.query({
        query: MYORDERS,
        fetchPolicy: 'network-only'
      })
      const order = result.data.orders.find(order => order.orderId === _id)
      console.log('ORDERS => ', JSON.stringify(order, null, 2))
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
    } else if (data.url.includes('hyp/cancel')) {
      console.log('BACK')
      props.navigation.goBack()
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
          uri: `${SERVER_URL}hyp/create-hyp-api-sign?id=${_id}`
        }}
        scalesPageToFit={true}
        onNavigationStateChange={data => {
          handleResponse(data)
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

export default HypCheckout