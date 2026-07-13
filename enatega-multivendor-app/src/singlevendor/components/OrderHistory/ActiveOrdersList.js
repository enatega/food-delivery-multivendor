import React, { useContext, useMemo, useState, useCallback, useRef } from 'react'
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import ConfigurationContext from '../../../context/Configuration'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'
import OrderHistoryItem from './OrderHistoryItem'
import { buildActiveOrderList } from '../../utils/orderHistoryHelpers'
import OrderHistorySkeleton from '../../screens/OrderHistory/OrderHistorySkeleton'
import EmptyOrdersList from './EmptyOrdersList'
import { GET_USERS_ACTIVE_ORDERS } from '../../apollo/queries'

const ACTIVE_ORDERS_QUERY = gql`
  ${GET_USERS_ACTIVE_ORDERS}
`

const PAGE_LIMIT = 10

const ActiveOrdersList = ({ onOrderPress, currentTheme: passedTheme, sortOrder = 'latest' }) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const configuration = useContext(ConfigurationContext)

  const currentTheme = passedTheme || {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [allOrders, setAllOrders] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const didInitRef = useRef(false)

  const { data, loading, error, refetch } = useQuery(ACTIVE_ORDERS_QUERY, {
    variables: { page: 1, limit: PAGE_LIMIT },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (payload) => {
      if (didInitRef.current) return
      const firstPage = payload?.getUsersActiveOrders || []
      setAllOrders(firstPage)
      setHasMore(firstPage.length === PAGE_LIMIT)
      setPage(1)
      didInitRef.current = true
    }
  })

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || loading || !hasMore) return

    const nextPage = page + 1
    setIsLoadingMore(true)

    try {
      const { data: nextData } = await refetch({ page: nextPage, limit: PAGE_LIMIT })
      const newOrders = nextData?.getUsersActiveOrders || []

      setAllOrders((prev) => {
        if (newOrders.length === 0) return prev
        const existing = new Set(prev.map((o) => o?._id).filter(Boolean))
        const unique = newOrders.filter((o) => o?._id && !existing.has(o._id))
        if (unique.length === 0) return prev
        return [...prev, ...unique]
      })

      const hasUnique = newOrders.some((o) => o?._id && !allOrders.find((p) => p?._id === o._id))
      setHasMore(newOrders.length === PAGE_LIMIT && hasUnique)
      setPage(nextPage)
    } catch (err) {
      // no-op
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, loading, hasMore, page, refetch, allOrders])

  const transformedOrders = useMemo(() => {
    const currencySymbol = configuration?.currencySymbol || ''
    return buildActiveOrderList({
      orders: allOrders,
      currencySymbol,
      t
    }).filter((item) => item?.id)
  }, [allOrders, configuration?.currencySymbol, t])

  const orderedOrders = useMemo(() => {
    if (sortOrder === 'oldest') {
      return [...transformedOrders].reverse()
    }
    return transformedOrders
  }, [transformedOrders, sortOrder])

  const flatListData = useMemo(() => {
    const items = []
    console.log("orderedOrders",orderedOrders)
    if (orderedOrders.length > 0) {
      const controlItem = isLoadingMore
        ? { type: 'loader', id: 'loader-active' }
        : hasMore
          ? { type: 'showMore', id: 'showMore-active', onPress: handleLoadMore }
          : { type: 'endMessage', id: 'endMessage-active' }

      if (sortOrder === 'oldest') {
        items.push(controlItem)
      }

      orderedOrders.forEach((item) => items.push(item))

      if (sortOrder !== 'oldest') {
        items.push(controlItem)
      }
    }

    console.log("flatListData after:", items)

    return items
  }, [orderedOrders, isLoadingMore, hasMore, handleLoadMore, sortOrder])

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
      key={item?.id}
        ordersData={item}
        currentTheme={currentTheme}
        onOrderPress={onOrderPress}
      />
    )
  }, [currentTheme, onOrderPress, t])

  const keyExtractor = useCallback((item, index) => {
    if (item.type && item.id) return item.id
    if (item.type === 'item' && item.id) return `${item.section || 'item'}-${item.id}`
    return `${item.type || 'item'}-${index}`
  }, [])

  const getItemType = useCallback((item) => item.type || 'item', [])

  if (loading && allOrders.length === 0) {
    return <OrderHistorySkeleton currentTheme={currentTheme} />
  }

  console.log("rendering ActiveOrdersList with data:", flatListData)

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
      contentContainerStyle={styles(currentTheme).listContent}
      ListEmptyComponent={
        <EmptyOrdersList
          currentTheme={currentTheme}
          title={null}
          message={t('There is no data for active orders') || 'There is no data for active orders'}
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

export default ActiveOrdersList
