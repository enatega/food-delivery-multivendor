import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import ProductCard from '../ProductCard'
import { FlashList } from '@shopify/flash-list'
import CategoryItem from './CategoryItem'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'

const ProductPage = ({ category, pageIndex }) => {
  const productListRef = useRef(null)
  const subCatListRef = useRef(null)

  const allProducts = category?.items ?? []
  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(-1)
  const subCategories = category?.subCategories
    ? [
        {
          subCategoryId: 'all',
          subCategoryName: 'All items'
        },
        ...category?.subCategories
      ]
    : []
  const products = activeSubCategoryIndex == -1 ? allProducts : subCategories[activeSubCategoryIndex]?.items

  const onSubCategoryPress = (index) => {
    setActiveSubCategoryIndex(index == 0 ? -1 : index)
    subCatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
  }

  return (
    <>
      {/* SubCategories */}
      <FlashList
        style={styles.subcategoryList}
        ref={subCatListRef}
        horizontal
        data={subCategories}
        keyExtractor={(item) => item.subCategoryId}
        estimatedItemSize={80}
        renderItem={({ item, index }) => (
          <CategoryItem
            title={item.subCategoryName}
            active={activeSubCategoryIndex == -1 && item.subCategoryId == 'all' ? true : index === activeSubCategoryIndex}
            onPress={() => {
              onSubCategoryPress(index)
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
      <FlashList
        contentContainerStyle={{}}
        ref={productListRef}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} containerStyles={{ width: '94%', marginBottom: 10, marginRight: 10, marginLeft: 6 }} />}
        numColumns={2}
        estimatedItemSize={190}
        ListEmptyComponent={
          <View style={{paddingHorizontal:12}}>
            <HorizontalProductsEmptyView />
          </View>
        }
        // onViewableItemsChanged={onViewableItemsChanged.current} viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </>
  )
}

export default ProductPage

const styles = StyleSheet.create({
  subcategoryList: { marginTop: 10, marginBottom: 22 }
})
