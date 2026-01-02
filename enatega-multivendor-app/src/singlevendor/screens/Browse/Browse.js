import { View, StyleSheet, TouchableWithoutFeedback, Pressable } from 'react-native'
import React from 'react'
import useBrowse from './useBrowse'
import AllCategories from '../../components/Browse/AllCategories'
import BrowseModal from '../../components/Browse/BrowseModal'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { Ionicons } from '@expo/vector-icons'
import useHomeProducts from '../Home/useHomeProducts'
import SearchModal from '../../components/ProductExplorer/SearchModal'

const Browse = () => {
  const { dismissKeyboard, modalVisible, setModalVisible, handleClearSearch, handleModalClose, t, currentTheme, insets, inputRef, searchTerm, setSearchTerm, data, loading, debouncedSearch, onProductPress, handleAddToCart, handleSeeAll, isCategoryModalVisible, setisCategoryModalVisible, categoryId, isSearched } = useBrowse()
  const { data: productsData } = useHomeProducts({ categoryId: categoryId })
  const products = productsData?.getCategoryItemsSingleVendor.items ?? []

  return (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <View style={[styles().container, { backgroundColor: currentTheme.themeBackground, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Pressable onPress={() => setModalVisible(true)} style={styles(currentTheme).searchContainer}>
          <Ionicons name='search' size={18} color='#999' style={styles().searchIcon} />
          <TextDefault style={styles().input}>{t('Search')}</TextDefault>
        </Pressable>

        <AllCategories currentTheme={currentTheme} t={t} handleSeeAll={handleSeeAll} />

        <BrowseModal visible={modalVisible} onClose={handleModalClose} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleClearSearch={handleClearSearch} currentTheme={currentTheme} t={t} insets={insets} data={data} loading={loading} debouncedSearch={debouncedSearch} onProductPress={onProductPress} handleAddToCart={handleAddToCart} isSearched={isSearched} />

        <SearchModal visible={isCategoryModalVisible} onClose={() => setisCategoryModalVisible(false)} items={products} isPaginated={true} categoryId={categoryId} />
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Browse

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
      gap: 15
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: props !== null ? props.borderColor : '#F2F2F2',
      paddingVertical: 10
    },
    searchIcon: {
      marginRight: 6
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: '#000',
      justifyContent: 'center'
    }
  })
