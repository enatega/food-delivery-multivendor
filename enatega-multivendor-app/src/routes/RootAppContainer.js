import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppContainer from '.'
import { useVendorModeStore } from '../singlevendor'
import SingleVendorAppContainer from '../singlevendor/routes/SingleVendorAppContainer'

const RootAppContainer = () => {
  const { vendorMode } = useVendorModeStore.getState()
  const [isLoadingVendorMode, setIsLoadingVendorMode] = useState(false)

  useEffect(() => {
    //Fetch Vendor Mode From Server or anywhere else

    return () => {}
  }, [])

  return isLoadingVendorMode ? <ActivityIndicator></ActivityIndicator> : 
  vendorMode == 'SINGLE'?
  <SingleVendorAppContainer/>
  :
  <AppContainer />

}

export default RootAppContainer
