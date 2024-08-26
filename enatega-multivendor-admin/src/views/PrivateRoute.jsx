import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { APP_NAME } from '../utils/constants'

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem(`user-${APP_NAME}`) ? (
        <Component {...props} />
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
