import { View, StyleSheet, Modal, Pressable } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import SearchInput from './SearchInput'
import { Ionicons } from '@expo/vector-icons'
import SearchesList from './SearchesList'
import ProductCard from '../ProductCard'
import EmptySearch from './EmptySearch'
import SectionErrorCard from '../SectionErrorCard'

const BrowseModal = ({ visible, onClose, handleClearSearch, inputRef, searchTerm, setSearchTerm, currentTheme, t, insets, data, loading, error, onRetry, debouncedSearch, onProductPress, handleAddToCart, isSearched, loadMore, hasMore }) => {
  const searchData = data?.searchFood && data?.searchFood?.length > 0 ? data?.searchFood : []

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

        {error && searchTerm.trim()
          ? (
            <SectionErrorCard
              title={t('Search')}
              message={t('searchLoadFailed', { defaultValue: 'Search results could not be loaded.' })}
              onRetry={onRetry}
              style={{ marginHorizontal: 0 }}
            />
            )
          : isSearched
            ? (
          <>
            <FlashList
            estimatedItemSize={190}
              contentContainerStyle={{ paddingLeft: 0, paddingBottom: insets.bottom + 24 }}
              data={searchData}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => {
                return <ProductCard product={item} onCardPress={onProductPress} onAddToCart={handleAddToCart} containerStyles={{ width: '46%', minHeight: 220, maxHeight: 220, marginBottom: 12, marginRight: 10, marginLeft: 6 }}/>
              }}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              onEndReached={hasMore ? loadMore : undefined}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={<EmptySearch currentTheme={currentTheme} t={t} />}
            />
          </>
              )
            : (
          <SearchesList currentTheme={currentTheme} t={t} setSearchTerm={setSearchTerm} />
              )}
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
