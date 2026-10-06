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

import React, { memo, useMemo, useRef, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'

import ProductCard from '../ProductCard'
import HorizontalProductsEmptyView from '../HorizontalProductsEmptyView'
import SectionErrorCard from '../SectionErrorCard'
import { ProductGridSkeleton } from './ProductExplorerSkeleton'
import { GET_CATEGORY_PRODUCTS } from '../../apollo/queries'
import { categoryProductsVariables } from '../../utils/productExplorerPrefetch'

const ProductPage = ({ category }) => {
  const navigation = useNavigation()
  const productListRef = useRef(null)
  const isFetchingMoreRef = useRef(false)

  const [extraItems, setExtraItems] = useState([])
  const [extraHasMore, setExtraHasMore] = useState(null)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const { data, error, refetch, fetchMore } = useQuery(GET_CATEGORY_PRODUCTS, {
    variables: categoryProductsVariables(category.categoryId),
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  const firstPage = data?.getCategoryProducts
  const hasLoaded = firstPage != null

  const products = useMemo(() => {
    const seen = new Set()
    return [...(firstPage?.items ?? []), ...extraItems].filter((item) => {
      if (!item?.id || seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }, [firstPage, extraItems])

  const hasMore = extraHasMore ?? firstPage?.hasMore ?? false

  const loadMore = async() => {
    if (!hasLoaded || !hasMore || isFetchingMoreRef.current) return

    isFetchingMoreRef.current = true
    setIsFetchingMore(true)
    try {
      const { data: moreData } = await fetchMore({
        variables: { offset: products.length }
      })
      const result = moreData?.getCategoryProducts
      setExtraItems((prev) => [...prev, ...(result?.items ?? [])])
      setExtraHasMore(result?.hasMore ?? false)
    } catch (_) {
      // Keep what is already loaded; the next end-reached will retry.
    } finally {
      isFetchingMoreRef.current = false
      setIsFetchingMore(false)
    }
  }

  const onRetry = async() => {
    setExtraItems([])
    setExtraHasMore(null)
    await refetch()
  }

  // Until the server has answered for this category, show a loader – never the empty state.
  if (!hasLoaded) {
    if (error) {
      return (
        <View style={styles.stateContainer}>
          <SectionErrorCard title={category?.categoryName} onRetry={onRetry} />
        </View>
      )
    }
    return <ProductGridSkeleton />
  }

  return (
    <FlashList
      ref={productListRef}
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      estimatedItemSize={236}
      contentContainerStyle={{ paddingHorizontal: 4, paddingTop: 10, paddingBottom: 16 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.6}
      renderItem={({ item }) => (
        <ProductCard
          product={{ ...item, categoryId: item?.categoryId || category?.categoryId }}
          onCardPress={() => navigation.navigate('ProductDetails', { productId: item?.id, categoryId: category?.categoryId })}
          layout='grid'
        />
      )}
      ListFooterComponent={isFetchingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
      ListEmptyComponent={
        <View style={styles.stateContainer}>
          <HorizontalProductsEmptyView />
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default memo(ProductPage)

const styles = StyleSheet.create({
  stateContainer: {
    margin: 20
  }
})
