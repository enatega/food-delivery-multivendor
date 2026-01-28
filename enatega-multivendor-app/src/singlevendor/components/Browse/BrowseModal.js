import { View, StyleSheet, Modal, Pressable, FlatList } from 'react-native'
import React from 'react'
import SearchInput from './SearchInput'
import { Ionicons } from '@expo/vector-icons'
import SearchesList from './SearchesList'
import ProductCard from '../ProductCard'
import EmptySearch from './EmptySearch'

const BrowseModal = ({ visible, onClose, handleClearSearch, inputRef, searchTerm, setSearchTerm, currentTheme, t, insets, data, loading, debouncedSearch, onProductPress, handleAddToCart, isSearched }) => {
  const searchData = data?.searchFood && data?.searchFood?.length > 0 ? data?.searchFood : []

  const onBackPress = () => {
    onClose()
  }
  return (
    <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onBackPress}>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
          <View style={{ width: '15%' }}>
            <Pressable style={styles.backButton} onPress={onBackPress} hitSlop={10}>
              <Ionicons name='arrow-back' size={22} color={currentTheme.newIconColor} />
            </Pressable>
          </View>
          <View style={{ width: '85%' }}>
            <SearchInput currentTheme={currentTheme} handleClearSearch={handleClearSearch} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} loading={loading} debouncedSearch={debouncedSearch} />
          </View>
        </View>

        {isSearched ? (
          <>
            <FlatList
              contentContainerStyle={{ paddingLeft: 10, paddingBottom: 60 }}
              data={searchData}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => {
                return <View style={{ marginBottom: 15 }}>
                  <ProductCard product={item} onCardPress={onProductPress} onAddToCart={handleAddToCart} />
                </View>;
              }}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<EmptySearch currentTheme={currentTheme} t={t} />}
            />
          </>
        ) : (
          <SearchesList currentThem={currentTheme} t={t} setSearchTerm={setSearchTerm} />
        )}
      </View>
    </Modal>
  )
}

export default BrowseModal

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  backButton: {
    backgroundColor: '#F2F2F2',
    padding: 8,
    borderRadius: 50,
    height: 40,
    width: 40
  }
})
