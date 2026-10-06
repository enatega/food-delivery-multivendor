import React, { useCallback, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useApolloClient } from '@apollo/client'

import { normalizeSingleVendorMediaUrl } from '../../../utils/mediaUrl'
import DiscoveryCategoryRail from '../../../components/Main/DiscoveryCategoryRail/DiscoveryCategoryRail'
import { prefetchProductExplorer, useOpenProductExplorer } from '../../utils/productExplorerPrefetch'

// Single-vendor categories carry either an image or an icon on the media host.
const getCategoryImageUri = (item) => {
  const image = item?.image || item?.icon
  return image ? normalizeSingleVendorMediaUrl(image) : null
}

// Same framed-tile rail as multivendor Discovery, so both modes share one
// category language.
const DiscoveryCategories = ({ categoriesData = [] }) => {
  const navigation = useNavigation()
  const client = useApolloClient()
  const openProductExplorer = useOpenProductExplorer()

  const hasCategories = categoriesData.length > 0

  // Warm the "See All" data while the user is still on Home.
  useEffect(() => {
    if (hasCategories) prefetchProductExplorer(client)
  }, [client, hasCategories])

  const handleCategoryPress = useCallback((category) => {
    if (category?.viewType === 'see-all') {
      openProductExplorer(category?.id)
      return
    }
    navigation.navigate('ProductsList', { categoryId: category?.id })
  }, [navigation, openProductExplorer])

  const handleSeeAll = useCallback(() => openProductExplorer(), [openProductExplorer])

  return (
    <DiscoveryCategoryRail
      title='Categories'
      data={categoriesData}
      onItemPress={handleCategoryPress}
      onSeeAll={handleSeeAll}
      getImageUri={getCategoryImageUri}
    />
  )
}

export default DiscoveryCategories
