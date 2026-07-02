import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { WebView } from 'react-native-webview'
import { myOrders } from '../../apollo/queries'
import gql from 'graphql-tag'
import useEnvVars from '../../../environment'
import { useApolloClient, useMutation } from '@apollo/client'
import UserContext from '../../context/User'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { createActivity, orderCreatedAndPaid } from '../../apollo/mutations'
import { HeaderBackButton } from '@react-navigation/elements'
import { AntDesign } from '@expo/vector-icons'
import { alignment } from '../../utils/alignment'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MYORDERS = gql`
  ${myOrders}
`
const ORDER_CREATED_AND_PAID = gql`
  ${orderCreatedAndPaid}
`

const CREATE_ACTIVITY = gql`
  ${createActivity}
`

const isAllowedHost = (url, allowedHosts) => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`))
  } catch {
    return false
  }
}

function HypCheckout(props) {
  const Analytics = analytics()
  const { SERVER_URL } = useEnvVars()
  const { t } = useTranslation()
  const [loading, loadingSetter] = useState(false)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [confirmationTimedOut, setConfirmationTimedOut] = useState(false)
  const { clearCart } = useContext(UserContext)
  const client = useApolloClient()
  const { _id, restaurantId, orderInput } = props?.route.params
  const isHandlingSuccessRef = useRef(false)
  const backendHost = useRef(null)
  const hypAllowedHosts = useRef([])

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useEffect(() => {
    try {
      backendHost.current = new URL(SERVER_URL).hostname.toLowerCase()
      hypAllowedHosts.current = backendHost.current ? [backendHost.current] : []
    } catch {
      backendHost.current = null
      hypAllowedHosts.current = []
    }
  }, [SERVER_URL])

  // Mutations
  const [mutateOrderCreatedAndPaid] = useMutation(ORDER_CREATED_AND_PAID)
  const [createActivityMutation] = useMutation(CREATE_ACTIVITY)

  // Handlers
  const onNotifiyUsers = async () => {
    try {
      // Notification
      await mutateOrderCreatedAndPaid({
        variables: {
          orderId: _id,
          restaurant: restaurantId,
          orderInput: orderInput
        }
      })
      return
    } catch (err) {
      console.log('onNotifiyUsers failed')
      throw new Error(err)
    }
  }

  const onCreateActivityHandler = async (type, details) => {
    try {
      let tries = 0
      let success = false
      while (tries < 3 && !success) {
        try {
          await createActivityMutation({
            variables: {
              groupId: await AsyncStorage.getItem('hyp-session-id'),
              module: 'HypCheckout',
              screenPath: '/Users/umarkhalid/Projects/Yalla/yalla-apps/enatega-multivendor-app/src/screens/Hyp/HypCheckout.js',
              type,
              details
            }
          })
          success = true
        } catch (error) {
          tries++
        }
      }
    } catch (error) {}
  }

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      title: 'Hyp Checkout',
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View style={{ ...alignment.PLxSmall, width: scale(30) }}>
              <AntDesign name='arrowleft' size={22} color={currentTheme.fontFourthColor} />
            </View>
          )}
          onPress={() => {
            props?.navigation.replace('Checkout')
          }}
        />
      )
    })
  }, [props?.navigation])

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_HYP)
    }
    Track()

    //  onNotifiyUsers()
  }, [])

  async function handleResponse(data) {
    await onCreateActivityHandler('handleResponse:HYP', JSON.stringify(data))

    if (data.url.includes('hyp/success') || data.url.includes('hyp/cancel')) {
      loadingSetter(true)
    }
    if (data.url.includes('hyp/success')) {
      if (isHandlingSuccessRef.current) return
      isHandlingSuccessRef.current = true
      setIsConfirmingOrder(true)
      await onNotifiyUsers()

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
            loadingSetter(false)
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
          console.log('Hyp confirmation polling error', error)
        }

        await new Promise((resolve) => setTimeout(resolve, 3000))
      }

      setConfirmationTimedOut(true)
      loadingSetter(false)
    } else if (data.url.includes('hyp/cancel')) {
      FlashMessage({ message: t('PaymentNotSuccessfull'), duration: 2000 })
      loadingSetter(false)
      props?.navigation.goBack()
    }
  }

  const startDate = new Date()
  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={{ opacity: loading || isConfirmingOrder ? 0 : 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        bounces={false}
        originWhitelist={['https://*', 'http://*']}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request
          if (!url) return false
          const allowedHosts = [...hypAllowedHosts.current]
          if (backendHost.current) {
            allowedHosts.push(backendHost.current)
          }
          return isAllowedHost(url, allowedHosts)
        }}
        onLoadStart={async (e) => {
          await onCreateActivityHandler('onLoadStart:HYP', e?.description ?? '-')
          loadingSetter(true)
        }}
        userAgent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        source={{
          uri: `${SERVER_URL}hyp/create-hyp-api-sign?id=${_id}`
        }}
        onHttpError={async (e) => {
          await onCreateActivityHandler('onHttpError:HYP', e?.description ?? '-')
          loadingSetter(false)
        }}
        onError={async (e) => {
          await onCreateActivityHandler('onError:HYP', e?.description ?? '-')
          loadingSetter(false)
        }}
        onLoadEnd={async (e) => {
          await onCreateActivityHandler('onLoadEnd:HYP', e?.description ?? '-')
          loadingSetter(false)

          const endDate = new Date()
          const totalSeconds = (endDate - startDate) / 1000
          console.log(`Total seconds from start date v2: ${totalSeconds}`)
        }}
        scalesPageToFit={true}
        onNavigationStateChange={handleResponse}
      />

      {loading ? <ActivityIndicator style={{ position: 'absolute', bottom: '50%', left: '50%' }} size='large' color='#90E36D' /> : null}
      {isConfirmingOrder ? (
        <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#90E36D" />
          <Text style={{ marginTop: 20, fontSize: 22, fontWeight: '600', textAlign: 'center', color: '#111827' }}>
            {confirmationTimedOut ? 'Payment submitted' : 'Confirming your order'}
          </Text>
          <Text style={{ marginTop: 12, fontSize: 15, lineHeight: 22, textAlign: 'center', color: '#4B5563' }}>
            {confirmationTimedOut
              ? "Your payment was submitted successfully. We're still waiting for the backend to confirm the order."
              : "We're waiting for backend confirmation before opening your order tracking screen."}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

export default HypCheckout
