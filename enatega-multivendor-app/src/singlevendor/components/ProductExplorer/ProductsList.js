import React, { useState, useMemo, useContext, useRef, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

import SearchHeader from './SearchHeader'
import ProductCard from '../ProductCard'
import useHomeProducts from '../../screens/Home/useHomeProducts'
import { useDebounce } from '../../../utils/useDebounce'

const PAGE_LIMIT = 10
const ProductsList = ({ onClose, items = [], isPaginated = false, categoryId = null }) => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const [listData, setListData] = useState(items)
  const isFetchingMore = useRef(false)
  const { loading, refetch } = useHomeProducts(
    isPaginated
      ? {
          categoryId,
          skip: 0,
          limit: PAGE_LIMIT,
          search: '',
          skipQuery: true
        }
      : {}
  )

  // The first page is fetched by the parent screen. Keep the local list in
  // sync when that request completes; otherwise FlashList can remain empty
  // until a later pagination request causes a render.
  useEffect(() => {
    if (!isPaginated || query.trim() || isFetchingMore.current) return
    setListData(items)
  }, [isPaginated, items, query])

  const filteredLocalItems = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((i) => i.title?.toLowerCase().includes(q))
  }, [query, items])

  const onEndReached = async() => {
    if (!isPaginated || loading || !hasMore || isFetchingMore.current) return

    const nextPage = page + 1
    isFetchingMore.current = true
    setPage(nextPage)

    try {
      const { data } = await refetch({
        categoryId,
        skip: nextPage * PAGE_LIMIT,
        limit: PAGE_LIMIT,
        search: query
      })

      const result = data?.getCategoryItemsSingleVendor
      const newItems = result?.items ?? []
      const nextHasMore = result?.pagination?.hasMore

      setHasMore(nextHasMore == null ? newItems.length === PAGE_LIMIT : nextHasMore)
      if (newItems.length > 0) {
        setListData((prev) => {
          const existingIds = new Set(prev.map(item => item.id))
          return [...prev, ...newItems.filter(item => !existingIds.has(item.id))]
        })
      }
    } finally {
      isFetchingMore.current = false
    }
  }

  const debouncedSearch = useDebounce(async(searchText) => {
    console.log('debounced search:', searchText, categoryId)
    const { data } = await refetch({
      categoryId,
      skip: 0,
      limit: PAGE_LIMIT,
      search: searchText
    })

    const result = data?.getCategoryItemsSingleVendor
    setListData(result?.items ?? [])
    setHasMore(result?.pagination?.hasMore ?? false)
  }, 600)

  const onSearchChange = async(text) => {
    setQuery(text)

    if (!isPaginated) return

    setPage(0)
    setHasMore(true)
    console.log('on Search Changed', text)
    debouncedSearch(text)
  }

  const onProductPress = (id) => {
    onClose?.()
    navigation.navigate('ProductDetails', { productId: id, categoryId })
  }

  const dataSource = isPaginated ? listData : filteredLocalItems

  return (
    <View style={[styles(currentTheme).container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* 🔹 Search Header */}
      <SearchHeader value={query} placeholder='Search items' onChangeText={onSearchChange} onBackPress={onClose} />

      {/* 🔹 Results */}
      <FlashList
        style={{ paddingHorizontal: 4 }}
        data={dataSource}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={{ ...item, categoryId: item?.categoryId || categoryId }}
            onCardPress={onProductPress}
            layout='grid'
          />
        )}
        numColumns={2}
        estimatedItemSize={248}
        drawDistance={800}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.7}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isPaginated && loading && hasMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
        ListEmptyComponent={<HorizontalProductsEmptyView />}
      />
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme?.themeBackground || '#FFF'
    }
  })

export default ProductsList
