import { Keyboard } from 'react-native'
import { useState, useRef, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_SINGLE_VENDOR_FOODS } from '../../apollo/queries'
import { useDebounce } from '../../../utils/useDebounce'
import { useNavigation } from '@react-navigation/native'
import { storeSearch } from '../../../utils/recentSearch'

const useBrowse = () => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  // use states
  const [searchTerm, setSearchTerm] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [isSearched, setisSearched] = useState(false)
  const inputRef = useRef(null)

  // Queries and mutations
  const [executeSearch, { loading, data: searchData, error, fetchMore }] = useLazyQuery(SEARCH_SINGLE_VENDOR_FOODS, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setisSearched(true)
    }
  })

  const getSearchResults = (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      console.log('No search term provided')
      return Promise.resolve(null)
    }

    return executeSearch({
      variables: {
        search: searchTerm,
        skip: 0,
        limit: 20
      }
    })
  }

  const debouncedSearch = useDebounce((searchText) => {
    if (searchText && searchText.trim()) {
      getSearchResults(searchText)
      storeSearch(searchText, 'recentSearches')
    } else {
      setisSearched(false)
    }
  }, 600)

  const retrySearch = () => getSearchResults(searchTerm)
  const loadMore = () => {
    const result = searchData?.searchSingleVendorFoods
    if (loading || !result?.hasMore || !searchTerm.trim()) return Promise.resolve()
    return fetchMore({
      variables: {
        search: searchTerm.trim(),
        skip: result.items?.length || 0,
        limit: 20
      },
      updateQuery: (previous, { fetchMoreResult }) => {
        const incoming = fetchMoreResult?.searchSingleVendorFoods
        if (!incoming) return previous
        const byId = new Map(
          [...(previous.searchSingleVendorFoods?.items || []), ...(incoming.items || [])]
            .map(item => [item.id, item])
        )
        return {
          searchSingleVendorFoods: {
            ...incoming,
            items: [...byId.values()]
          }
        }
      }
    })
  }
  const data = searchData
    ? { searchFood: searchData.searchSingleVendorFoods?.items || [] }
    : undefined

  const dismissKeyboard = () => {
    Keyboard.dismiss()
    inputRef.current?.blur()
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    dismissKeyboard()
    setisSearched(false)
  }

  const handleModalClose = () => {
    setSearchTerm('')
    dismissKeyboard()
    setisSearched(false)
    setTimeout(() => {
      setModalVisible(false)
    }, 100)
  }

  const onProductPress = (id, categoryId) => {
    navigation.navigate('ProductDetails', {
      productId: id,
      categoryId
    })
    setTimeout(() => {
      setModalVisible(false)
    }, 100)
  }

  const handleAddToCart = (item) => {
    console.log('Add to cart:', item.name)
  }

  const handleSeeAll = (viewType, id) => {
    if (viewType === 'see-all') {
      navigation.navigate('ProductExplorer', {
        categoryId: id
      })
    } else {
      // setCategoryId(id)
      // setModalVisible(false)
      // setTimeout(() => {
      //   setisCategoryModalVisible(true)
      // }, 100)
      navigation.navigate('ProductsList', {
        categoryId: id
      })
    }
  }

  return {
    inputRef,
    searchTerm,
    setSearchTerm,
    handleClearSearch,
    handleModalClose,
    dismissKeyboard,
    modalVisible,
    setModalVisible,
    currentTheme,
    t,
    insets,
    getSearchResults,
    loading,
    data,
    error,
    retrySearch,
    debouncedSearch,
    onProductPress,
    handleAddToCart,
    handleSeeAll,
    isSearched,
    loadMore,
    hasMore: !!searchData?.searchSingleVendorFoods?.hasMore
  }
}

export default useBrowse
