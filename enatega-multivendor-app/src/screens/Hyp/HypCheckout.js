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
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'

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

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: 'Hyp Checkout'
    })
  }, [props.navigation])

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_HYP)
    }
    Track()
  }, [])

  async function handleResponse(data) {
    console.log('DATA => ', JSON.stringify(data, null,3 ))
    if(data.url.includes('hyp/success') || data.url.includes('hyp/cancel')){
      loadingSetter(true)
    } 
    if (data.url.includes('hyp/success')) {
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
    } else if (data.url.includes('hyp/cancel')) {
      FlashMessage({ message: t('PaymentNotSuccessfull'), duration: 2000 })
      props.navigation.goBack()
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
          size='large'
          color='#90E36D'
        />
       ) : null}
    </View>
  )
}

export default HypCheckout
