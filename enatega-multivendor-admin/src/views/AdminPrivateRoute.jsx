import React from 'react'
import { Redirect, Route } from 'react-router-dom'
export const AdminPrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('user-enatega') ? (
        JSON.parse(localStorage.getItem('user-enatega')).userType ===
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
