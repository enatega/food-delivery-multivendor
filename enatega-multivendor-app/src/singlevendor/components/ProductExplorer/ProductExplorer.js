// import React, { useRef, useState, useCallback } from 'react'
// import { View, StyleSheet } from 'react-native'
// import { FlashList } from '@shopify/flash-list'

// import { CATEGORIES, PRODUCTS, SUB_CATEGORIES } from './dummyData'
// import ProductCard from './ProductCard'

// import CategoryItem from './CategoryItem'
// import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA } from '../../apollo/queries'
// import { useQuery } from '@apollo/client'

// const ProductExplorer = () => {
//   const productListRef = useRef(null)
//   const catListRef = useRef(null)
//   const subCatListRef = useRef(null)

//   const { data: allData, loading: loading, error } = useQuery(GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA)

//   const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
//   const [categories, setCategories] = useState(allData?.getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor ? allData?.getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor[activeCategoryIndex] : [])
//   const [subCategories, setCategoryData] = useState(singleCategoryData?.subCategories ? singleCategoryData?.subCategories : [])
//   const [products, setProducts] = useState(singleCategoryData?.items ? singleCategoryData?.items : [])
//   const [activeCategory, setActiveCategory] = useState((products && products?.length > 0) ? products[0].id : null)
//   console.log('GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA:',products[0].id, activeCategory)

//   // Map category → first index

//   const categoryIndexMap = {}
//   products.forEach((item, index) => {
//     if (!categoryIndexMap[item.id]) {
//       categoryIndexMap[item.id] = index
//     }
//   })

//   const onSubCategoryPress = useCallback((id, index) => {
//     setActiveCategory(id)

//     if (id === 'all') {
//       productListRef.current?.scrollToOffset({ offset: 0, animated: true })
//       return
//     }

//     const productIndex = categoryIndexMap[id]
//     if (productIndex !== undefined) {
//       productListRef.current?.scrollToIndex({
//         index: productIndex,
//         animated: true
//       })
//     }

//     subCatListRef.current?.scrollToIndex({
//       index,
//       animated: true,
//       viewPosition: 0.5
//     })
//   }, [])

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (!viewableItems?.length) return

//     const categoryCount = {}
//     viewableItems.forEach((v) => {
//       const cat = v.item.id
//       categoryCount[cat] = (categoryCount[cat] || 0) + 1
//     })

//     const dominantCategory = Object.keys(categoryCount).reduce((a, b) => (categoryCount[a] > categoryCount[b] ? a : b))

//     if (dominantCategory !== activeCategory) {
//       setActiveCategory(dominantCategory)

//       const subIndex = SUB_CATEGORIES.findIndex((c) => c.id === dominantCategory)

//       if (subIndex >= 0) {
//         subCatListRef.current?.scrollToIndex({
//           index: subIndex,
//           animated: true,
//           viewPosition: 0.5
//         })
//       }
//     }
//   })

//   return (
//     <View style={styles.container}>
//       <FlashList style={{ marginBottom: 10 }} ref={catListRef} horizontal data={CATEGORIES} keyExtractor={(item) => item.id} renderItem={({ item, index }) => <CategoryItem title={item.title} active={activeCategory === item.id} onPress={() => onSubCategoryPress(item.id, index)} />} estimatedItemSize={70} showsHorizontalScrollIndicator={false} />

//       {/* Subcategories */}
//       <FlashList ref={subCatListRef} horizontal data={SUB_CATEGORIES} keyExtractor={(item) => item.id} renderItem={({ item, index }) => <CategoryItem title={item.title} active={activeCategory === item.id} onPress={() => onSubCategoryPress(item.id, index)} />} estimatedItemSize={70} showsHorizontalScrollIndicator={false} />

//       {/* Products */}
//       <FlashList ref={productListRef} data={PRODUCTS} renderItem={({ item }) => <ProductCard item={item} />} keyExtractor={(item) => item.id} numColumns={2} estimatedItemSize={180} showsVerticalScrollIndicator={false} onViewableItemsChanged={onViewableItemsChanged.current} viewabilityConfig={{ itemVisiblePercentThreshold: 60 }} />
//     </View>
//   )
// }

// export default ProductExplorer

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10
//   }
// })

import React, { useRef, useState, useMemo, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@apollo/client'


import CategoryItem from './CategoryItem'
import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA } from '../../apollo/queries'
import ProductCard from '../ProductCard'

const ProductExplorer = () => {
  const productListRef = useRef(null)
  const catListRef = useRef(null)
  const subCatListRef = useRef(null)

  const { data, loading } = useQuery(GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA)

  const categories = data?.getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor ?? []
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const activeCategory = categories[activeCategoryIndex]
  const subCategories = activeCategory?.subCategories
    ? [
        {
          subCategoryId: 'all',
          subCategoryName: 'All items'
        },
        ...activeCategory?.subCategories
      ]
    : [
        {
          subCategoryId: 'all',
          subCategoryName: 'All items'
        }
      ]
  const allProducts = activeCategory?.items ?? []
  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(-1)
  const products = activeSubCategoryIndex == -1 ? allProducts : subCategories[activeSubCategoryIndex]?.items

  console.log('products:', products)

  /**
   * 🔥 Build subCategory → first product index map
   * - ONE loop
   * - Only when products change
   */
  // const subCategoryIndexMap = useMemo(() => {
  //   const map = {}

  //   products.forEach((item, index) => {
  //     const subId = item.subCategoryId
  //     if (subId && map[subId] === undefined) {
  //       map[subId] = index
  //     }
  //   })

  //   return map
  // }, [products])

  /**
   * 👉 Tap subCategory → scroll products
   */
  // const onSubCategoryPress = useCallback((subCategoryId, index) => {
  //   setActiveSubCategoryId(subCategoryId)

  //   const productIndex = subCategoryIndexMap[subCategoryId]
  //   if (productIndex !== undefined) {
  //     productListRef.current?.scrollToIndex({
  //       index: productIndex,
  //       animated: true,
  //     })
  //   }

  //   subCatListRef.current?.scrollToIndex({
  //     index,
  //     animated: true,
  //     viewPosition: 0.5,
  //   })
  // }, [subCategoryIndexMap])

  // /**
  //  * 👉 Scroll products → auto focus subCategory
  //  */
  // const onViewableItemsChanged = useRef(({ viewableItems }) => {
  //   if (!viewableItems?.length) return

  //   const countMap = {}

  //   console.log("viewability change",viewableItems)
  //   viewableItems.forEach(v => {
  //     const subId = v.item.id
  //     countMap[subId] = (countMap[subId] || 0) + 1
  //   })

  //   const dominantSubCategory = Object.keys(countMap).reduce((a, b) =>
  //     countMap[a] > countMap[b] ? a : b
  //   )
  //   console.log("dominant sub category:",dominantSubCategory)

  //   if (dominantSubCategory !== activeSubCategoryId) {
  //     setActiveSubCategoryId(dominantSubCategory)

  //     const index = subCategories.findIndex(
  //       s => s.subCategoryId === dominantSubCategory
  //     )

  //     if (index >= 0) {
  //       subCatListRef.current?.scrollToIndex({
  //         index,
  //         animated: true,
  //         viewPosition: 0.5,
  //       })
  //     }
  //   }
  // })

  const onCategoryPress = (index) => {
    console.log('category index on press:', index)
    setActiveCategoryIndex(index)
    setActiveSubCategoryIndex(-1)
    catListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
  }

  const onSubCategoryPress = (index) => {
    setActiveSubCategoryIndex(index == 0 ? -1 : index)
    subCatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
  }

  if (loading) return null

  console.log('sub categories:', subCategories)

  return (
    <View style={styles.container}>
      {/* 🔹 Categories */}
      <FlashList
        ref={catListRef}
        horizontal
        data={categories}
        keyExtractor={(item) => item.categoryId}
        estimatedItemSize={90}
        renderItem={({ item, index }) => (
          <CategoryItem
            title={item.categoryName}
            active={index === activeCategoryIndex}
            onPress={() => {
              onCategoryPress(index)
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* 🔹 SubCategories */}
      <FlashList
      style={{marginVertical:10}}
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

      {/* 🔹 Products */}
      <FlashList
      contentContainerStyle={{}}
        ref={productListRef}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} containerStyles={{width:'94%',marginBottom:10,marginRight:10,marginLeft:6}}/>}
        numColumns={2}
        estimatedItemSize={190}
        // onViewableItemsChanged={onViewableItemsChanged.current} viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default ProductExplorer

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal:10
  }
})
