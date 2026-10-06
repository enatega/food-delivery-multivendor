import { View, StyleSheet, Modal, Pressable } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import SearchInput from './SearchInput'
import { Ionicons } from '@expo/vector-icons'
import SearchesList from './SearchesList'
import ProductCard from '../ProductCard'
import EmptySearch from './EmptySearch'
import SectionErrorCard from '../SectionErrorCard'
import { ProductGridSkeleton } from '../ProductExplorer/ProductExplorerSkeleton'

const BrowseModal = ({ visible, onClose, handleClearSearch, inputRef, searchTerm, setSearchTerm, currentTheme, t, insets, data, loading, error, onRetry, debouncedSearch, onProductPress, handleAddToCart, isSearched, isSearching, loadMore, hasMore }) => {
  const searchData = data?.searchFood && data?.searchFood?.length > 0 ? data?.searchFood : []
  const trimmedTerm = searchTerm.trim()
  const hasSearchableTerm = trimmedTerm.length >= 2

  const onBackPress = () => {
    onClose()
  }
  return (
    <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onBackPress}>
      <View style={[styles(currentTheme).screen, { paddingTop: insets.top }]}>
        <View style={[styles(currentTheme).container, { paddingBottom: 10 }]}>
          <View style={{ width: '15%' }}>
            <Pressable style={styles(currentTheme).backButton} onPress={onBackPress} hitSlop={10}>
              <Ionicons name='arrow-back' size={22} color={currentTheme.newIconColor} />
            </Pressable>
          </View>
          <View style={{ width: '85%' }}>
            <SearchInput currentTheme={currentTheme} handleClearSearch={handleClearSearch} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} loading={loading} debouncedSearch={debouncedSearch} />
          </View>
        </View>

        {/* Order matters: a stale error or stale results must never show while
            the current term is still loading. */}
        {hasSearchableTerm && isSearching
          ? <ProductGridSkeleton style={styles(currentTheme).skeleton} />
          : error && hasSearchableTerm
            ? (
              <SectionErrorCard
                title={t('Search')}
                message={t('searchLoadFailed', { defaultValue: 'Search results could not be loaded.' })}
                onRetry={onRetry}
                style={{ marginHorizontal: 0 }}
              />
              )
            : hasSearchableTerm && isSearched
              ? searchData.length
                ? (
                  <FlashList
                    estimatedItemSize={236}
                    contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: insets.bottom + 24 }}
                    data={searchData}
                    keyExtractor={(item) => item?.id}
                    renderItem={({ item }) => (
                      <ProductCard product={item} onCardPress={onProductPress} onAddToCart={handleAddToCart} layout='grid' />
                    )}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    onEndReached={hasMore ? loadMore : undefined}
                    onEndReachedThreshold={0.5}
                    keyboardDismissMode='on-drag'
                  />
                  )
                : <EmptySearch currentTheme={currentTheme} t={t} searchTerm={trimmedTerm} />
              : <SearchesList currentTheme={currentTheme} t={t} setSearchTerm={setSearchTerm} />}
      </View>
    </Modal>
  )
}

export default BrowseModal

const styles = (currentTheme) => StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: currentTheme?.themeBackground || '#FFFFFF'
  },
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  skeleton: {
    paddingHorizontal: 0,
    marginTop: 4
  },
  backButton: {
    backgroundColor: currentTheme?.colorBgTertiary || '#F2F2F2',
    padding: 8,
    borderRadius: 50,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
