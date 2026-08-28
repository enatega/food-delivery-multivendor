import { Platform, StatusBar, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useRef, useMemo, useContext } from 'react'
import { NetworkStatus, useQuery } from '@apollo/client'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { GET_SINGLE_VENDOR_DEALS_SECTION } from '../../apollo/queries'
import SectionList from '../../components/SectionList'
import { FlashList } from '@shopify/flash-list'
import HorizontalSubCategoriesList from '../../components/HorizontalSubCategoriesList'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './Styles'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

const DEAL_PAGE_SIZE = 20

const fetchNextDealsPage = async(query, section) => {
  const currentPage = query.data?.singleVendorDeals
  if (!currentPage?.hasMore || query.networkStatus === NetworkStatus.fetchMore) return

  await query.fetchMore({
    variables: {
      section,
      skip: currentPage.items.length,
      limit: DEAL_PAGE_SIZE
    },
    updateQuery: (previous, { fetchMoreResult }) => {
      const nextPage = fetchMoreResult?.singleVendorDeals
      if (!nextPage) return previous

      return {
        singleVendorDeals: {
          ...nextPage,
          items: [
            ...(previous?.singleVendorDeals?.items || []),
            ...nextPage.items
          ]
        }
      }
    }
  })
}

const Deals = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(0)
  const activeSubCategoryIndexRef = useRef(0)
  const dealsListRef = useRef(null)
  const subCatListRef = useRef(null)

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  const dealCategories = [

    {
      subCategoryId: '1',
      subCategoryName: t('Limited time deals')
    },
    {
      subCategoryId: '2',
      subCategoryName: t('weekly deals')
    },
    {
      subCategoryId: '3',
      subCategoryName: t('New offers')
    }

  ]

  const handleSubCategoryPress = (index) => {
    setActiveSubCategoryIndex(index)
    activeSubCategoryIndexRef.current = index
    dealsListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0
    })

    // Scroll subcategory list to center the selected item
    subCatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
  }

  const limitedTimeQuery = useQuery(GET_SINGLE_VENDOR_DEALS_SECTION, {
    variables: { section: 'LIMITED_TIME', skip: 0, limit: DEAL_PAGE_SIZE },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })
  const weeklyQuery = useQuery(GET_SINGLE_VENDOR_DEALS_SECTION, {
    variables: { section: 'WEEKLY', skip: 0, limit: DEAL_PAGE_SIZE },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })
  const newOffersQuery = useQuery(GET_SINGLE_VENDOR_DEALS_SECTION, {
    variables: { section: 'NEW_OFFERS', skip: 0, limit: DEAL_PAGE_SIZE },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true
  })

  const refreshAllData = async() => {
    await Promise.allSettled([
      limitedTimeQuery.refetch(),
      weeklyQuery.refetch(),
      newOffersQuery.refetch()
    ])
  }
  const { refreshing, handleRefresh, spinnerColor } = usePullToRefresh([refreshAllData])

  // Create sections array for FlashList
  const sections = useMemo(() => [
    {
      id: 'limited-time',
      title: t('Limited time deals'),
      data: limitedTimeQuery.data?.singleVendorDeals?.items || [],
      loading: limitedTimeQuery.loading && !limitedTimeQuery.data,
      error: limitedTimeQuery.error,
      onRetry: limitedTimeQuery.refetch,
      hasMore: limitedTimeQuery.data?.singleVendorDeals?.hasMore || false,
      loadingMore: limitedTimeQuery.networkStatus === NetworkStatus.fetchMore,
      onLoadMore: () => fetchNextDealsPage(limitedTimeQuery, 'LIMITED_TIME')
    },
    {
      id: 'weekly',
      title: t('weekly deals'),
      data: weeklyQuery.data?.singleVendorDeals?.items || [],
      loading: weeklyQuery.loading && !weeklyQuery.data,
      error: weeklyQuery.error,
      onRetry: weeklyQuery.refetch,
      hasMore: weeklyQuery.data?.singleVendorDeals?.hasMore || false,
      loadingMore: weeklyQuery.networkStatus === NetworkStatus.fetchMore,
      onLoadMore: () => fetchNextDealsPage(weeklyQuery, 'WEEKLY')
    },
    {
      id: 'new-offers',
      title: t('New offers'),
      data: newOffersQuery.data?.singleVendorDeals?.items || [],
      loading: newOffersQuery.loading && !newOffersQuery.data,
      error: newOffersQuery.error,
      onRetry: newOffersQuery.refetch,
      hasMore: newOffersQuery.data?.singleVendorDeals?.hasMore || false,
      loadingMore: newOffersQuery.networkStatus === NetworkStatus.fetchMore,
      onLoadMore: () => fetchNextDealsPage(newOffersQuery, 'NEW_OFFERS')
    }
  ], [
    t,
    limitedTimeQuery.data,
    limitedTimeQuery.loading,
    limitedTimeQuery.error,
    limitedTimeQuery.refetch,
    limitedTimeQuery.networkStatus,
    limitedTimeQuery.fetchMore,
    weeklyQuery.data,
    weeklyQuery.loading,
    weeklyQuery.error,
    weeklyQuery.refetch,
    weeklyQuery.networkStatus,
    weeklyQuery.fetchMore,
    newOffersQuery.data,
    newOffersQuery.loading,
    newOffersQuery.error,
    newOffersQuery.refetch,
    newOffersQuery.networkStatus,
    newOffersQuery.fetchMore
  ])

  const renderSectionItem = ({ item, index }) => {
    return (
      <SectionList
        title={item.title}
        data={item.data}
        loading={item.loading}
        error={item.error}
        onRetry={item.onRetry}
        hasMore={item.hasMore}
        onLoadMore={item.onLoadMore}
        loadingMore={item.loadingMore}
      />
    )
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return

    const activeSectionIndex = viewableItems[0].index
    if (activeSectionIndex !== activeSubCategoryIndexRef.current) {
      setActiveSubCategoryIndex(activeSectionIndex)
      activeSubCategoryIndexRef.current = activeSectionIndex
      subCatListRef.current?.scrollToIndex({
        index: activeSectionIndex,
        animated: true,
        viewPosition: 0.5
      })
    }
  }, [activeSubCategoryIndex]).current

  const keyExtractor = (item) => item.id

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <HorizontalSubCategoriesList
        data={dealCategories}
        activeIndex={activeSubCategoryIndex}
        onSubCategoryPress={handleSubCategoryPress}
        listRef={subCatListRef}
      />
      <FlashList
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          // itemVisiblePercentThreshold: 100

          viewAreaCoveragePercentThreshold: 50,
          minimumViewTime: 200
        }}
        ref={dealsListRef}
        data={sections}
        keyExtractor={keyExtractor}
        renderItem={renderSectionItem}
        estimatedItemSize={400}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          // Handle scroll to index failure gracefully
          const wait = new Promise(resolve => setTimeout(resolve, 500))
          wait.then(() => {
            dealsListRef.current?.scrollToIndex({ index: info.index, animated: true })
          })
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={spinnerColor} colors={[spinnerColor]} />}
      />
    </SafeAreaView>
  )
}

export default Deals
