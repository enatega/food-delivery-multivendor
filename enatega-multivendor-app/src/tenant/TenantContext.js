import React from 'react'

const TenantContext = React.createContext({
  tenant: null,
  isLoading: true,
  setTenant: () => {},
  clearTenant: () => {},
})

export default TenantContext

export const useTenant = () => React.useContext(TenantContext)
