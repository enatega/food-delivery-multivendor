import React, { useContext } from 'react'

export const TabsContext = React.createContext()
export const useTabsContext = () => useContext(TabsContext)
