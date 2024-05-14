import React, { useEffect, useState } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
import GoogleMapsLoader from './components/GoogleMapsLoader/GoogleMapsLoader.js'
import { Box, CircularProgress } from '@mui/material'
import AdminLayout from './layouts/Admin.jsx'
import RestaurantLayout from './layouts/Restaurant.jsx'
import AuthLayout from './layouts/Auth.jsx'
import SuperAdminLayout from './layouts/SuperAdmin.jsx'
import { PrivateRoute } from './views/PrivateRoute'
import { AdminPrivateRoute } from './views/AdminPrivateRoute'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { isFirebaseSupported, initialize } from './firebase.js'
import { uploadToken } from './apollo'
import { gql, useApolloClient } from '@apollo/client'
import ConfigurableValues from './config/constants.js'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'

require('./i18n')

const UPLOAD_TOKEN = gql`
  ${uploadToken}
`

const App = () => {
  const {
    VAPID_KEY,
    FIREBASE_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MSG_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    GOOGLE_MAPS_KEY
  } = ConfigurableValues()
  console.log('GOOGLE_MAPS_KEY_App', GOOGLE_MAPS_KEY)
  // const [mapsKey, setMapsKey] = useState(null)
  // useEffect(() => {
  //   if (GOOGLE_MAPS_KEY) {
  //     setMapsKey(GOOGLE_MAPS_KEY)
  //   }
  // }, [GOOGLE_MAPS_KEY])
  const client = useApolloClient()
  const [user] = useState(localStorage.getItem('user-enatega'))
  const userType = localStorage.getItem('user-enatega')
    ? JSON.parse(localStorage.getItem('user-enatega')).userType
    : null
  useEffect(() => {
    if (user) {
      const initializeFirebase = async() => {
        if (await isFirebaseSupported()) {
          const messaging = initialize(
            FIREBASE_KEY,
            AUTH_DOMAIN,
            PROJECT_ID,
            STORAGE_BUCKET,
            MSG_SENDER_ID,
            APP_ID,
            MEASUREMENT_ID
          )
          Notification.requestPermission()
            .then(() => {
              getToken(messaging, {
                vapidKey: VAPID_KEY
              })
                .then(token => {
                  localStorage.setItem('messaging-token', token)
                  client
                    .mutate({
                      mutation: UPLOAD_TOKEN,
                      variables: {
                        id: JSON.parse(user).userId,
                        pushToken: token
                      }
                    })
                    .then(() => {
                      console.log('upload token success')
                    })
                    .catch(error => {
                      console.log('upload token error', error)
                    })
                })
                .catch(err => {
                  console.log('getToken error', err)
                })
            })
            .catch(console.log)

          onMessage(messaging, function(payload) {
            console.log(payload)
            // Customize notification here
            // const { title, body } = payload.notification
            // eslint-disable-next-line no-restricted-globals
            var notificationTitle = 'New Order on Enatega Multivendor'
            var notificationOptions = {
              body: payload.data.orderid,
              icon: 'https://multivendor-admin.ninjascode.com/favicon.png'
            }
            const nt = new Notification(notificationTitle, notificationOptions)
            nt.onclick = function(event) {
              event.preventDefault() // prevent the browser from focusing the Notification's tab
              window.open('https://multivendor-admin.ninjascode.com/dashboard')
              nt.close()
            }
          })
        }
      }
      initializeFirebase()
    }
  }, [user])
  const route = userType
    ? userType === 'VENDOR'
      ? '/restaurant/list'
      : '/super_admin/vendors'
    : '/auth/login'
  return (
    <Sentry.ErrorBoundary>
      <TawkMessengerReact
        propertyId="5d0f4f6b36eab9721118c84e"
        widgetId="1ftnb355n"
        customStyle={{
          color: 'red'
        }}
      />
      {GOOGLE_MAPS_KEY ? (
        <GoogleMapsLoader GOOGLE_MAPS_KEY={GOOGLE_MAPS_KEY}>
          <HashRouter basename="/">
            <Switch>
              <AdminPrivateRoute
                path="/super_admin"
                component={props => <SuperAdminLayout {...props} />}
              />
              <PrivateRoute
                path="/restaurant"
                component={props => <RestaurantLayout {...props} />}
              />
              <PrivateRoute
                path="/admin"
                component={props => <AdminLayout {...props} />}
              />
              <Route
                path="/auth"
                component={props => <AuthLayout {...props} />}
              />
              <Redirect from="/" to={route} />
            </Switch>
          </HashRouter>
        </GoogleMapsLoader>
      ) : (
        <Box
          component="div"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          width="100vw">
          <CircularProgress color="primary" />
        </Box>
      )}
    </Sentry.ErrorBoundary>
  )
}
export default Sentry.withProfiler(App)
