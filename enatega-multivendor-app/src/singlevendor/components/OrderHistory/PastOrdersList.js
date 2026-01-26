import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import ConfigurationContext from '../../../context/Configuration'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'
import OrderHistoryItem from './OrderHistoryItem'
import usePastOrders from './usePastOrders'
import { buildPastOrderList } from '../../utils/orderHistoryHelpers'
import OrderHistorySkeleton from '../../screens/OrderHistory/OrderHistorySkeleton'
import EmptyOrdersList from './EmptyOrdersList'

const PAGE_LIMIT = 10

const PastOrdersList = ({ onOrderPress, currentTheme: passedTheme }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)
  
  const currentTheme = passedTheme || {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // State for pagination
  const [page, setPage] = useState(1)
  const [pastOrders, setPastOrders] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Fetch past orders
  const {
    data,
    loading,
    error,
    refetch,
    orders,
    pageInfo
  } = usePastOrders({
    page,
    limit: PAGE_LIMIT,
    skipQuery: false
  })

  // Transform and update past orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      const currencySymbol = configuration?.currencySymbol || ''
      const transformedItems = buildPastOrderList({
        orders: orders,
        currencySymbol,
        t
      })

      if (page === 1) {
        // First load - include header if present
        setPastOrders(transformedItems)
      } else {
        // Append new items, avoiding duplicates and headers
        setPastOrders(prev => {
          const existingIds = new Set(prev.map(item => item.id))
          // Filter out headers and duplicates
          const newItems = transformedItems.filter(
            item => item.type !== 'header' && !existingIds.has(item.id)
          )
          return [...prev, ...newItems]
        })
      }
      setIsLoadingMore(false)
    } else if (page === 1 && !loading) {
      // Reset if no orders on initial load
      setPastOrders([])
    }
  }, [orders, page, configuration?.currencySymbol, t, loading])

  useEffect(() => {
    if (error) {
      setIsLoadingMore(false)
    }
  }, [error])

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || loading) return
    if (!pageInfo?.canShowMore) return

    setIsLoadingMore(true)
    const nextPage = pageInfo?.nextPage ?? page + 1
    const previousPage = page
    setPage(nextPage)

    try {
      const { data } = await refetch({
        page: nextPage,
        limit: PAGE_LIMIT
      })
      if (data?.getUsersPastOrders?.length === 0) {
        setIsLoadingMore(false)
      }
    } catch (error) {
      console.error('Error loading more past orders:', error)
      setIsLoadingMore(false)
      setPage(previousPage)
    }
  }, [isLoadingMore, loading, pageInfo, page, refetch])

  // Flatten list data for FlashList
  const flatListData = useMemo(() => {
    const items = []
    
    if (pastOrders.length > 0) {
      pastOrders.forEach(item => {
        items.push(item)
      })
      
      // Add loading indicator at the end if loading more
      if (isLoadingMore) {
        items.push({
          type: 'loader',
          id: 'loader-past'
        })
      } else if (pageInfo?.canShowMore) {
        items.push({
          type: 'showMore',
          id: 'showMore-past',
          onPress: handleLoadMore
        })
      } else if (pageInfo?.isEndReached && pastOrders.length > 0) {
        items.push({
          type: 'endMessage',
          id: 'endMessage-past'
        })
      }
    }
    
    return items
  }, [pastOrders, isLoadingMore, pageInfo, handleLoadMore])

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'loader') {
      return (
        <View style={styles(currentTheme).paginationRow}>
          <ActivityIndicator size="small" color={currentTheme?.main} />
        </View>
      )
    }

    if (item.type === 'showMore') {
      return (
        <View style={styles(currentTheme).paginationRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={item.onPress}
            style={styles(currentTheme).showMoreButton}
          >
            <TextDefault
              textColor={currentTheme?.fontWhite}
              style={styles(currentTheme).showMoreText}
            >
              {t('Show More') || 'Show More'}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )
    }

    if (item.type === 'endMessage') {
      return (
        <View style={styles(currentTheme).paginationRow}>
          <TextDefault
            textColor={currentTheme?.fontMainColor}
            style={styles(currentTheme).endMessageText}
          >
            {t("There's no more orders") || "There's no more orders"}
          </TextDefault>
        </View>
      )
    }

    return (
      <OrderHistoryItem
        ordersData={item}
        currentTheme={currentTheme}
        onOrderPress={onOrderPress}
      />
    )
  }, [currentTheme, onOrderPress, t])

  const keyExtractor = useCallback((item, index) => {
    if (item.type === 'header' && item.id) {
      return item.id
    }
    if (item.type === 'loader' && item.id) {
      return item.id
    }
    if (item.type === 'showMore' && item.id) {
      return item.id
    }
    if (item.type === 'endMessage' && item.id) {
      return item.id
    }
    if (item.type === 'item' && item.id) {
      return `${item.section || 'item'}-${item.id}`
    }
    return `${item.type}-${index}`
  }, [])

  const getItemType = useCallback((item) => {
    return item.type || 'item'
  }, [])

  if (loading && page === 1) {
    return (
      <OrderHistorySkeleton currentTheme={currentTheme} />
    )
  }

  // if (flatListData.length === 0 && !loading) {
  //   return null
  // }

  return (
    <FlashList
      data={flatListData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={80}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      getItemType={getItemType}
      extraData={flatListData.length}
      ListEmptyComponent={
        <EmptyOrdersList 
          currentTheme={currentTheme} 
          title={t('Past Orders') || 'Past Orders'}
          message={t('There is no data for past orders') || 'There is no data for past orders'}
        />
      }
    />
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(40)
    },
    paginationRow: {
      paddingVertical: verticalScale(20),
      alignItems: 'center',
      backgroundColor: props?.themeBackground
    },
    showMoreButton: {
      backgroundColor: props?.main || props?.primary || '#0EA5E9',
      paddingHorizontal: scale(24),
      paddingVertical: verticalScale(12),
      borderRadius: scale(8)
    },
    showMoreText: {
      fontSize: scale(14),
      fontWeight: '600'
    },
    endMessageText: {
      fontSize: scale(12),
      color: props?.colorTextMuted || props?.fontSecondColor
    }
  })

export default PastOrdersList
