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

const PastOrdersList = ({ onOrderPress, currentTheme: passedTheme, sortOrder = 'latest' }) => {
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
  const { data, loading, error, refetch, orders, pageInfo } = usePastOrders({
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
        setPastOrders((prev) => {
          const prevIds = prev.map((item) => `${item.type}-${item.id}`).join('|')
          const nextIds = transformedItems.map((item) => `${item.type}-${item.id}`).join('|')
          return prevIds === nextIds ? prev : transformedItems
        })
      } else {
        // Append new items, avoiding duplicates and headers
        setPastOrders((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          // Filter out headers and duplicates
          const newItems = transformedItems.filter((item) => item.type !== 'header' && !existingIds.has(item.id))
          if (newItems.length === 0) return prev
          return [...prev, ...newItems]
        })
      }
      setIsLoadingMore(false)
    } else if (page === 1 && !loading) {
      // Reset if no orders on initial load
      setPastOrders((prev) => (prev.length === 0 ? prev : []))
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
  const orderedOrders = useMemo(() => {
    if (sortOrder === 'oldest') {
      return [...pastOrders].reverse()
    }
    return pastOrders
  }, [pastOrders, sortOrder])

  const flatListData = useMemo(() => {
    const items = []

    if (orderedOrders.length > 0) {
      const controlItem = isLoadingMore ? { type: 'loader', id: 'loader-past' } : pageInfo?.canShowMore ? { type: 'showMore', id: 'showMore-past', onPress: handleLoadMore } : pageInfo?.isEndReached ? { type: 'endMessage', id: 'endMessage-past' } : null

      if (sortOrder === 'oldest' && controlItem) {
        items.push(controlItem)
      }

      orderedOrders.forEach((item) => {
        items.push(item)
      })

      if (sortOrder !== 'oldest' && controlItem) {
        items.push(controlItem)
      }
    }

    return items
  }, [orderedOrders, isLoadingMore, pageInfo, handleLoadMore, sortOrder])

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === 'loader') {
        return (
          <View style={styles(currentTheme).paginationRow}>
            <ActivityIndicator size='small' color={currentTheme?.main} />
          </View>
        )
      }

      if (item.type === 'showMore') {
        return (
          <View style={styles(currentTheme).paginationRow}>
            <TouchableOpacity activeOpacity={0.7} onPress={item.onPress} style={styles(currentTheme).showMoreButton}>
              <TextDefault textColor={currentTheme?.fontWhite} style={styles(currentTheme).showMoreText}>
                {t('Show More') || 'Show More'}
              </TextDefault>
            </TouchableOpacity>
          </View>
        )
      }

      if (item.type === 'endMessage') {
        return (
          <View style={styles(currentTheme).paginationRow}>
            <TextDefault textColor={currentTheme?.fontMainColor} style={styles(currentTheme).endMessageText}>
              {t("There's no more orders") || "There's no more orders"}
            </TextDefault>
          </View>
        )
      }

      return <OrderHistoryItem key={item?.id} ordersData={item} currentTheme={currentTheme} onOrderPress={onOrderPress} />
    },
    [currentTheme, onOrderPress, t]
  )

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
    return <OrderHistorySkeleton currentTheme={currentTheme} />
  }

  // if (flatListData.length === 0 && !loading) {
  //   return null
  // }

  return <FlashList data={flatListData} renderItem={renderItem} keyExtractor={keyExtractor} estimatedItemSize={80} showsVerticalScrollIndicator={false} removeClippedSubviews getItemType={getItemType} extraData={flatListData.length} contentContainerStyle={styles(currentTheme).listContent} ListEmptyComponent={<EmptyOrdersList currentTheme={currentTheme} title={null} message={t('There is no data for past orders') || 'There is no data for past orders'} />} />
}

const styles = (props = null) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: verticalScale(40)
    },
    listContent: {
      flexGrow: 1
    },
    paginationRow: {
      paddingVertical: verticalScale(20),
      alignItems: 'center',
      backgroundColor: props?.themeBackground
    },
    showMoreButton: {
      backgroundColor: props?.colorBgPrimary || props?.cardColor || '#FFFFFF',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(8),
      borderRadius: scale(10),
      borderWidth: 1,
      borderColor: props?.colorBorder || 'rgba(0,0,0,0.08)'
    },
    showMoreText: {
      fontSize: scale(12),
      fontWeight: '600',
      color: props?.fontMainColor
    },
    endMessageText: {
      fontSize: scale(12),
      color: props?.colorTextMuted || props?.fontSecondColor
    }
  })

export default PastOrdersList
