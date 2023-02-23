import React, { useEffect, useState } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
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
import { VAPID_KEY } from './config/constants.js'

require('./i18n')

const UPLOAD_TOKEN = gql`
  ${uploadToken}
`

const App = () => {
  const client = useApolloClient()
  const [user] = useState(localStorage.getItem('user-enatega'))
  const userType = localStorage.getItem('user-enatega')
    ? JSON.parse(localStorage.getItem('user-enatega')).userType
    : null
  useEffect(() => {
    if (user) {
      const initializeFirebase = async() => {
        if (await isFirebaseSupported()) {
          const messaging = initialize()
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
          <Route path="/auth" component={props => <AuthLayout {...props} />} />
          <Redirect from="/" to={route} />
        </Switch>
      </HashRouter>
    </Sentry.ErrorBoundary>
  )
}
export default Sentry.withProfiler(App)
