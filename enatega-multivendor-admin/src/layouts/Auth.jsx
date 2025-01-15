import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import { Box } from '@mui/material'

import routes from '../routes'

function Auth() {
  useEffect(() => {
    document.body.classList.add('bg-default')
    return () => {
      document.body.classList.remove('bg-default')
    }
  }, [])
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === '/auth') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        )
      } else {
        return null
      }
    })
  }
  return (
    <Box>
      <Box>
        <Switch>{getRoutes(routes)}</Switch>
      </Box>
    </Box>
  )
}

export default Auth
