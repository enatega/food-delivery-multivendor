// import React, { useRef, useState, useMemo, useCallback, useContext } from 'react'
// import { View, StyleSheet } from 'react-native'
// import { FlashList } from '@shopify/flash-list'
// import { useQuery } from '@apollo/client'

// import CategoryItem from './CategoryItem'
// import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA } from '../../apollo/queries'

// import PagerView from 'react-native-pager-view'

// import ProductPage from './ProductPage'
// import SearchHeader from './SearchHeader'
// import { theme } from '../../../utils/themeColors'
// import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
// import { useNavigation } from '@react-navigation/native'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import SearchModal from './SearchModal'
// import ProductExplorerSkeleton from './ProductExplorerSkeleton'

// const ProductExplorer = () => {
//   const navigation = useNavigation()
//   const insets = useSafeAreaInsets()
//   const catListRef = useRef(null)
//   const themeContext = useContext(ThemeContext)
//   const pageRef = useRef(null)
//   const { data, loading } = useQuery(GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA)

//   const categories = data?.getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor ?? []
//   const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
//   const [searchVisible, setSearchVisible] = useState(false)
//   const onCategoryPress = (index) => {
//     setActiveCategoryIndex(index)

//     pageRef?.current?.setPage(index)
//     catListRef.current?.scrollToIndex({
//       index,
//       animated: true,
//       viewPosition: 0.5
//     })
//   }

//   const allItems = useMemo(() => {
//     const map = new Map()

//     categories.forEach((category) => {
//       // 1️⃣ Category-level items
//       category.items?.forEach((item) => {
//         map.set(item.id, {
//           ...item,
//           categoryName: category.categoryName,
//           categoryId: category.categoryId
//         })
//       })

//       // 2️⃣ SubCategory items
//       category.subCategories?.forEach((sub) => {
//         sub.items?.forEach((item) => {
//           map.set(item.id, {
//             ...item,
//             categoryName: category.categoryName,
//             categoryId: category.categoryId,
//             subCategoryName: sub.subCategoryName,
//             subCategoryId: sub.subCategoryId
//           })
//         })
//       })
//     })

//     // ✅ Unique + flat
//     return Array.from(map.values())
//   }, [categories])

//   if (loading) return <ProductExplorerSkeleton />

//   return (
//     <>
//       <View style={[styles.container, { backgroundColor: theme[themeContext.ThemeValue].themeBackground, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//         {/* Categories */}

//         <SearchHeader
//           onBackPress={() => {
//             navigation.canGoBack() && navigation.goBack()
//           }}
//           onPressSearch={() => setSearchVisible(true)}
//         />
//         <View style={styles.subContainer}>
//           <FlashList
//             style={styles.categoriesList}
//             ref={catListRef}
//             horizontal
//             data={categories}
//             keyExtractor={(item) => item.categoryId}
//             estimatedItemSize={90}
//             renderItem={({ item, index }) => (
//               <CategoryItem
//                 variant='underline'
//                 title={item.categoryName}
//                 active={index === activeCategoryIndex}
//                 onPress={() => {
//                   onCategoryPress(index)
//                 }}
//               />
//             )}
//             showsHorizontalScrollIndicator={false}
//           />

//           {/* Products */}
//           <PagerView
//             ref={pageRef}
//             onPageSelected={(e) => {
//               const index = e.nativeEvent.position
//               setActiveCategoryIndex(index)
//               catListRef.current?.scrollToIndex({
//                 index,
//                 animated: true,
//                 viewPosition: 0.5
//               })
//             }}
//             style={styles.pagerView}
//             initialPage={0}
//           >
//             {categories.map((item, index) => (
//               <ProductPage key={index} category={categories[index]} pageIndex={index}></ProductPage>
//             ))}
//           </PagerView>
//         </View>
//       </View>

//       <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} items={allItems} />
//     </>
//   )
// }

// export default ProductExplorer

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   pagerView: {
//     flex: 1
//   },
//   categoriesList: {
//     marginTop: 0
//   },
//   subContainer: {
//     flex: 1,
//     paddingHorizontal: 10,
//     paddingTop: 10
//   }
// })

import React, { useRef, useState, useContext, useLayoutEffect, useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import PagerView from 'react-native-pager-view'
import { useQuery } from '@apollo/client'
import { useNavigation, useRoute } from '@react-navigation/native'

import CategoryItem from './CategoryItem'
import ProductPage from './ProductPage'
import SearchHeader from './SearchHeader'
import ProductExplorerSkeleton from './ProductExplorerSkeleton'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_ONLY_SEE_ALL_SINGLE_VENDOR } from '../../apollo/queries'
import BrowseModal from '../Browse/BrowseModal'
import useBrowse from '../../screens/Browse/useBrowse'
import SectionErrorCard from '../SectionErrorCard'

const ProductExplorer = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const catListRef = useRef(null)
  const pageRef = useRef(null)
  const themeContext = useContext(ThemeContext)
  const hasInitializedRef = useRef(false)
  const appliedRouteCategoryRef = useRef(null)
  const centeredCategoryIndexRef = useRef(null)

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  const { data, loading, error, refetch } = useQuery(GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_ONLY_SEE_ALL_SINGLE_VENDOR)
  const {
    modalVisible,
    setModalVisible,
    handleClearSearch,
    handleModalClose,
    t,
    currentTheme,
    insets,
    inputRef,
    searchTerm,
    setSearchTerm,
    data: searchedData,
    loading: searchedLoading,
    error: searchError,
    retrySearch,
    debouncedSearch,
    onProductPress,
    handleAddToCart,
    isSearched,
    loadMore,
    hasMore
  } = useBrowse()

  const categories = data?.getAllCategoriesWithSubCategoriesOnlySeeAllSingleVendor ?? []
  const routeCategoryId = route?.params?.categoryId
  const requestedCategoryIndex = useMemo(() => {
    if (!categories.length || !routeCategoryId) return 0

    const normalizedRouteCategoryId = String(routeCategoryId)
    const foundIndex = categories.findIndex((category) =>
      [category?.categoryId, category?.id]
        .filter(Boolean)
        .some((id) => String(id) === normalizedRouteCategoryId)
    )

    return foundIndex >= 0 ? foundIndex : 0
  }, [categories, routeCategoryId])

  useLayoutEffect(() => {
    if (!categories.length) return
    const normalizedRouteCategoryId = routeCategoryId == null ? '' : String(routeCategoryId)

    if (
      hasInitializedRef.current &&
      appliedRouteCategoryRef.current === normalizedRouteCategoryId
    ) return

    setActiveCategoryIndex(requestedCategoryIndex)
    if (hasInitializedRef.current) {
      pageRef.current?.setPageWithoutAnimation(requestedCategoryIndex)
    }
    catListRef.current?.scrollToIndex({
      index: requestedCategoryIndex,
      animated: false,
      viewPosition: 0.5
    })
    centeredCategoryIndexRef.current = requestedCategoryIndex
    appliedRouteCategoryRef.current = normalizedRouteCategoryId
    hasInitializedRef.current = true
  }, [categories, requestedCategoryIndex, routeCategoryId])

  if (loading) return <ProductExplorerSkeleton />

  if (error) {
    return (
      <View style={[styles.container, styles.errorScreen, { backgroundColor: theme[themeContext.ThemeValue].themeBackground, paddingTop: insets.top }] }>
        <SearchHeader onBackPress={() => navigation.canGoBack() && navigation.goBack()} onPressSearch={() => setModalVisible(true)} />
        <SectionErrorCard title={t('Browse')} onRetry={refetch} />
      </View>
    )
  }

  return (
    <>

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme[themeContext.ThemeValue].themeBackground,
            paddingTop: insets.top,
            paddingBottom: insets.bottom
          }
        ]}
      >

        <SearchHeader onBackPress={() => navigation.canGoBack() && navigation.goBack()} onPressSearch={() => setModalVisible(true)} />

        <FlashList
          ref={catListRef}
          horizontal
          data={categories}
          keyExtractor={(item) => item.categoryId}
          estimatedItemSize={90}
          renderItem={({ item, index }) => (
            <CategoryItem
              variant='underline'
              title={item.categoryName}
              active={index === activeCategoryIndex}
              onPress={() => {
                setActiveCategoryIndex(index)
                pageRef.current?.setPage(index)
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />

        <PagerView
          ref={pageRef}
          initialPage={requestedCategoryIndex}
          style={{ flex: 1 }}
          onPageSelected={(e) => {
            const index = e.nativeEvent.position
            setActiveCategoryIndex((currentIndex) =>
              currentIndex === index ? currentIndex : index
            )

            if (centeredCategoryIndexRef.current !== index) {
              catListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5
              })
              centeredCategoryIndexRef.current = index
            }
          }}
        >

          {categories.map((category, index) => (
            <ProductPage key={category.categoryId} category={category} pageIndex={index} />
          ))}

        </PagerView>

      </View>

      {/* <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} /> */}

        <BrowseModal visible={modalVisible} onClose={handleModalClose} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleClearSearch={handleClearSearch} currentTheme={currentTheme} t={t} insets={insets} data={searchedData} loading={searchedLoading} error={searchError} onRetry={retrySearch} debouncedSearch={debouncedSearch} onProductPress={onProductPress} handleAddToCart={handleAddToCart} isSearched={isSearched} loadMore={loadMore} hasMore={hasMore} />

    </>
  )
}

export default ProductExplorer

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorScreen: { paddingHorizontal: 10 }
})
