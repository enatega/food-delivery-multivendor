import { Keyboard } from 'react-native'
import React, { useState, useRef, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_FOOD } from '../../apollo/queries'
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
  const [isCategoryModalVisible, setisCategoryModalVisible] = useState(false)
  const [categoryId, setCategoryId] = useState(null)
  const [isSearched, setisSearched] = useState(false)
  const inputRef = useRef(null)

  // Queries and mutations
  const [executeSearch, { loading, data, error }] = useLazyQuery(SEARCH_FOOD, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setisSearched(true)
    }
  })

  const getSearchResults = (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) {
      console.log('No search term provided')
      return Promise.resolve(null)
    }

    return executeSearch({
      variables: {
        search: searchTerm
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

  const onProductPress = (id) => {
    navigation.navigate('ProductDetails', {
      productId: id
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
      navigation.navigate('ProductExplorer')
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
    loading: loading,
    data,
    error,
    debouncedSearch,
    onProductPress,
    handleAddToCart,
    handleSeeAll,
    isCategoryModalVisible,
    setisCategoryModalVisible,
    categoryId,
    isSearched
  }
}

export default useBrowse
