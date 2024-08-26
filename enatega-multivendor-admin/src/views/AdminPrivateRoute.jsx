import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { APP_NAME } from '../utils/constants'
export const AdminPrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem(`user-${APP_NAME}`) ? (
        JSON.parse(localStorage.getItem(`user-${APP_NAME}`)).userType ===
        'ADMIN' ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      ) : (
        <Redirect
          to={{
            pathname: '/auth/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)
