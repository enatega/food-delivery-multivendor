// import { View, Text, StyleSheet } from 'react-native'
// import React, { useMemo, useRef, useState } from 'react'
// import ProductCard from '../ProductCard'
// import { FlashList } from '@shopify/flash-list'
// import CategoryItem from './CategoryItem'
// import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'
// import { useNavigation } from '@react-navigation/native'

// const ProductPage = ({ category, pageIndex }) => {
//   const navigation = useNavigation();
//   const productListRef = useRef(null)
//   const subCatListRef = useRef(null)
//   const isAutoScrollingRef = useRef(false)
//   const allProducts = category?.items ?? []
//   const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(-1)
//   const subCategories = category?.subCategories
//     ? [
//         {
//           subCategoryId: 'all',
//           subCategoryName: 'All items'
//         },
//         ...category?.subCategories
//       ]
//     : []
//   const products = allProducts
//   // activeSubCategoryIndex == -1 ? allProducts : subCategories[activeSubCategoryIndex]?.items

//   const subCategoryIndexMap = useMemo(() => {
//     const map = {}

//     allProducts.forEach((item, index) => {
//       const subId = item.subCategory ?? 'all'

//       if (map[subId] === undefined) {
//         map[subId] = index
//       }
//     })

//     return map
//   }, [allProducts])

//   const onSubCategoryPress = (index) => {
//     const subCategory = subCategories[index]
//     const subId = subCategory.subCategoryId

//     setActiveSubCategoryIndex(index === 0 ? -1 : index)

//     const productIndex = subCategoryIndexMap[subId]

//     if (productIndex !== undefined) {
//       isAutoScrollingRef.current = true

//       productListRef.current?.scrollToIndex({
//         index: productIndex,
//         animated: true,
//         viewPosition: 0
//       })
//     }

//     subCatListRef.current?.scrollToIndex({
//       index,
//       animated: true,
//       viewPosition: 0.5
//     })
//   }

//   const onCardPress = (itemId) => {
//     navigation.navigate('ProductDetails', {
//       productId: itemId,
//        categoryId:category?.categoryId
//     })
//   }

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (!viewableItems.length) return

//     const counter = {}

//     for (const v of viewableItems) {
//       const subId = v.item.subCategory ?? 'all'
//       counter[subId] = (counter[subId] || 0) + 1
//     }

//     let dominantSubId = null
//     let maxCount = 0

//     Object.entries(counter).forEach(([subId, count]) => {
//       if (count > maxCount) {
//         maxCount = count
//         dominantSubId = subId
//       }
//     })

//     if (maxCount < 2) return

//     if (isAutoScrollingRef.current) {
//       isAutoScrollingRef.current = false
//       return
//     }

//     const index = subCategories.findIndex((sc) => sc.subCategoryId === dominantSubId)

//     if (index !== -1 && index !== activeSubCategoryIndex) {
//       setActiveSubCategoryIndex(index)

//       subCatListRef.current?.scrollToIndex({
//         index,
//         animated: true,
//         viewPosition: 0.5
//       })
//     }
//   }).current

//   return (
//     <>
//       {/* SubCategories */}
//       <FlashList
//         style={styles.subcategoryList}
//         ref={subCatListRef}
//         horizontal
//         data={subCategories}
//         keyExtractor={(item) => item.subCategoryId}
//         estimatedItemSize={80}
//         renderItem={({ item, index }) => (
//           <CategoryItem
//             title={item.subCategoryName}
//             active={activeSubCategoryIndex == -1 && item.subCategoryId == 'all' ? true : index === activeSubCategoryIndex}
//             onPress={() => {
//               onSubCategoryPress(index)
//             }}
//           />
//         )}
//         showsHorizontalScrollIndicator={false}
//       />
//       <FlashList
//         contentContainerStyle={{}}
//         ref={productListRef}
//         data={products}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <ProductCard onCardPress={ ()=>{onCardPress(item?.id)}} product={item} containerStyles={{ width: '94%', marginBottom: 10, marginRight: 10, marginLeft: 6 }} />}
//         numColumns={2}
//         estimatedItemSize={190}
//         ListEmptyComponent={
//           <View style={{ paddingHorizontal: 12 }}>
//             <HorizontalProductsEmptyView />
//           </View>
//         }
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
//         showsVerticalScrollIndicator={false}
//       />
//     </>
//   )
// }

// export default ProductPage

// const styles = StyleSheet.create({
//   subcategoryList: { marginTop: 10, marginBottom: 22 }
// })

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'

import ProductCard from '../ProductCard'
import CategoryItem from './CategoryItem'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'
import { GET_CATEGORY_PRODUCTS } from '../../apollo/queries'

const PAGE_SIZE = 20
const productsCache = {}

const ProductPage = ({ category }) => {
  const navigation = useNavigation()
  const productListRef = useRef(null)
  const subCatListRef = useRef(null)

  const [products, setProducts] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const { fetchMore, loading } = useQuery(GET_CATEGORY_PRODUCTS, {
    variables: {
      categoryId: category.categoryId,
      limit: PAGE_SIZE,
      offset: 0
    },
    skip: !!productsCache[category.categoryId],
    onCompleted: (data) => {
      productsCache[category.categoryId] = data.getCategoryProducts
      setProducts(data.getCategoryProducts.items)
      setHasMore(data.getCategoryProducts.hasMore)
    }
  })

  useEffect(() => {
    if (productsCache[category.categoryId]) {
      setProducts(productsCache[category.categoryId].items)
      setHasMore(productsCache[category.categoryId].hasMore)
    }
  }, [category.categoryId])

  const loadMore = () => {
    if (!hasMore || loading) return

    fetchMore({
      variables: {
        offset: products.length
      }
    }).then(({ data }) => {
      const newItems = data.getCategoryProducts.items
      setProducts((prev) => [...prev, ...newItems])
      setHasMore(data.getCategoryProducts.hasMore)
    })
  }

  const subCategories = useMemo(() => {
    return [{ subCategoryId: 'all', subCategoryName: 'All items' }, ...(category.subCategories ?? [])]
  }, [category.subCategories])

  return (
    <>
      {/* Todo: can show subcategories */}
      {/* <FlashList ref={subCatListRef} horizontal data={subCategories} keyExtractor={(item) => item.subCategoryId} estimatedItemSize={80} renderItem={({ item }) => <CategoryItem title={item.subCategoryName} />} showsHorizontalScrollIndicator={false} style={styles.subcategoryList} /> */}

      <FlashList
        ref={productListRef}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        estimatedItemSize={190}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        renderItem={({ item }) => <ProductCard product={item} onCardPress={() => navigation.navigate('ProductDetails', { productId: item?.id, categoryId: category?.categoryId })} containerStyles={{ width: '94%', marginBottom: 10, marginRight: 10, marginLeft: 6 }} />}
        ListFooterComponent={hasMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
        ListEmptyComponent={
          !loading && products.length === 0 ? (
            <View style={styles.loadingContainer}>
              <HorizontalProductsEmptyView />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </>
  )
}

export default ProductPage

const styles = StyleSheet.create({
  subcategoryList: {
    marginTop: 10,
    marginBottom: 22
  },
  loadingContainer: {
    margin: 20
  }
})
