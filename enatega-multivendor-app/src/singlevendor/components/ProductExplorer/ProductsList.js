import React, { memo, useState, useMemo, useContext, useRef } from 'react'
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native'
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

  const [listData, setListData] = useState(items)
  const isSearched = useRef(false)
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

  const filteredLocalItems = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((i) => i.title?.toLowerCase().includes(q))
  }, [query, items])

  const onEndReached = async () => {
    if (isSearched.current) {
      isSearched.current = false
      return
    }

    if (!isPaginated || loading) return

    const nextPage = page + 1
    setPage(nextPage)

    const { data } = await refetch({
      categoryId,
      skip: nextPage * PAGE_LIMIT,
      limit: PAGE_LIMIT,
      search: query
    })

    const newItems = data?.getCategoryItemsSingleVendor?.items ?? []

    if (newItems.length > 0) {
      setListData((prev) => [...prev, ...newItems])
    }
  }

  const debouncedSearch = useDebounce(async (searchText) => {
    console.log('debounced search:', searchText, categoryId)
    const { data } = await refetch({
      categoryId,
      skip: 0,
      limit: PAGE_LIMIT,
      search: searchText
    })

    isSearched.current = true
    setListData(data?.getCategoryItemsSingleVendor?.items ?? [])
  }, 600)

  const onSearchChange = async (text) => {
    setQuery(text)

    if (!isPaginated) return

    setPage(0)
    console.log('on Search Changed', text)
    debouncedSearch(text)
  }

  const onProductPress = (id) => {
    onClose?.()
    navigation.navigate('ProductDetails', { productId: id })
  }

  const dataSource = isPaginated ? listData : filteredLocalItems

  return (
    <View style={[styles(currentTheme).container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* 🔹 Search Header */}
      <SearchHeader value={query} placeholder='Search items' onChangeText={onSearchChange} onBackPress={onClose} />

      {/* 🔹 Results */}
      <FlashList
        onScroll={() => {
          if (isSearched.current) {
            isSearched.current = false
          }
        }}
        style={{ paddingHorizontal: 10 }}
        data={dataSource}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onCardPress={onProductPress}
            containerStyles={{
              width: '94%',
              marginBottom: 10,
              marginLeft: 6,
              marginRight: 6
            }}
          />
        )}
        numColumns={2}
        estimatedItemSize={190}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isPaginated && loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
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
