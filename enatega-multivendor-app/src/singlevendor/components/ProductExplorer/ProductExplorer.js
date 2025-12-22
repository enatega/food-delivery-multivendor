import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { PRODUCTS, SUB_CATEGORIES } from './dummyData';
import ProductCard from './ProductCard';
import SubCategoryItem from './SubCategoryItem';

const ProductExplorer = () => {
  const productListRef = useRef(null);
  const subCatListRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('all');

  // Map category → first index
  const categoryIndexMap = {};
  PRODUCTS.forEach((item, index) => {
    if (!categoryIndexMap[item.category]) {
      categoryIndexMap[item.category] = index;
    }
  });

  const onSubCategoryPress = useCallback((id, index) => {
    setActiveCategory(id);

    if (id === 'all') {
      productListRef.current?.scrollToOffset({ offset: 0, animated: true });
      return;
    }

    const productIndex = categoryIndexMap[id];
    if (productIndex !== undefined) {
      productListRef.current?.scrollToIndex({
        index: productIndex,
        animated: true,
      });
    }

    subCatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems?.length) return;

    const categoryCount = {};
    viewableItems.forEach(v => {
      const cat = v.item.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const dominantCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    if (dominantCategory !== activeCategory) {
      setActiveCategory(dominantCategory);

      const subIndex = SUB_CATEGORIES.findIndex(
        c => c.id === dominantCategory
      );

      if (subIndex >= 0) {
        subCatListRef.current?.scrollToIndex({
          index: subIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  });

  return (
    <View style={styles.container}>
      {/* Subcategories */}
      <FlashList
        ref={subCatListRef}
        horizontal
        data={SUB_CATEGORIES}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <SubCategoryItem
            title={item.title}
            active={activeCategory === item.id}
            onPress={() => onSubCategoryPress(item.id, index)}
          />
        )}
        estimatedItemSize={70}
        showsHorizontalScrollIndicator={false}
      />

      {/* Products */}
      <FlashList
        ref={productListRef}
        data={PRODUCTS}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={item => item.id}
        numColumns={2}
        estimatedItemSize={180}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      />
    </View>
  );
};

export default ProductExplorer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
