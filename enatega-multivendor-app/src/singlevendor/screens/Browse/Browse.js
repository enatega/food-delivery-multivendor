import { View, StyleSheet, TouchableWithoutFeedback, Pressable } from 'react-native'
import React from 'react'
import useBrowse from './useBrowse'
import AllCategories from '../../components/Browse/AllCategories'
import BrowseModal from '../../components/Browse/BrowseModal'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { Ionicons } from '@expo/vector-icons'

const Browse = () => {
  const { dismissKeyboard, modalVisible, setModalVisible, handleClearSearch, handleModalClose, t, currentTheme, insets, inputRef, searchTerm, setSearchTerm, data, loading, error, retrySearch, debouncedSearch, onProductPress, handleAddToCart, handleSeeAll, isSearched } = useBrowse()

  return (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
      <View style={[styles().container, { backgroundColor: currentTheme.themeBackground, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <Pressable onPress={() => setModalVisible(true)} style={styles(currentTheme).searchContainer}>
          <Ionicons name='search' size={18} color={currentTheme.colorTextMuted} style={styles().searchIcon} />
          <TextDefault textColor={currentTheme.colorTextMuted} style={styles().input}>{t('Search')}</TextDefault>
        </Pressable>

        <AllCategories currentTheme={currentTheme} t={t} handleSeeAll={handleSeeAll} />

        <BrowseModal visible={modalVisible} onClose={handleModalClose} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleClearSearch={handleClearSearch} currentTheme={currentTheme} t={t} insets={insets} data={data} loading={loading} error={error} onRetry={retrySearch} debouncedSearch={debouncedSearch} onProductPress={onProductPress} handleAddToCart={handleAddToCart} isSearched={isSearched} />

        {/* <SearchModal visible={isCategoryModalVisible} onClose={() => setisCategoryModalVisible(false)} items={products} isPaginated={true} categoryId={categoryId} /> */}
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
      borderColor: props?.colorBorder || props?.newBorderColor2 || '#E5E7EB',
      backgroundColor: props?.colorBgPrimary || props?.cardBackground || '#FFFFFF',
      paddingVertical: 10
    },
    searchIcon: {
      marginRight: 6
    },
    input: {
      flex: 1,
      fontSize: 14,
      justifyContent: 'center'
    }
  })
