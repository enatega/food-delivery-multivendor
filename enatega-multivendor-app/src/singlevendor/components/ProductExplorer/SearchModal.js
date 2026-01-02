import React, { memo, useState, useMemo } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import { FlashList } from '@shopify/flash-list'

import SearchHeader from './SearchHeader'
import ProductCard from '../ProductCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'

const SearchModal = ({ visible, onClose, items }) => {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const navigation = useNavigation()

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items

    const q = query.toLowerCase()

    return items.filter((item) => item.title?.toLowerCase().includes(q))
  }, [query, items])

  const onProductPress = (id) => {
    navigation.navigate('ProductDetails', {
      productId: id
    })
  }

  const handleAddToCart = (drink) => {
    // Handle add to cart action
    console.log('Add to cart:', drink.name)
  }

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='fullScreen' onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* 🔹 Search Header */}
        <SearchHeader value={query} placeholder='Search items' onChangeText={setQuery} onBackPress={onClose} />

        {/* 🔹 Results */}
        <FlashList
          style={{ paddingHorizontal: 10 }}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ProductCard
                product={item}
                onCardPress={onProductPress}
                onAddToCart={handleAddToCart}
                containerStyles={{
                  width: '94%',
                  marginBottom: 10,
                  marginLeft: 6,
                  marginRight: 6
                }}
              />
            )
          }}
          numColumns={2}
          estimatedItemSize={190}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<HorizontalProductsEmptyView />}
        />
      </View>
    </Modal>
  )
}

export default memo(SearchModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  }
})
