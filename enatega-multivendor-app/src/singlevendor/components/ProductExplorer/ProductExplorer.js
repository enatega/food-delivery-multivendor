import React, { useRef, useState, useMemo, useCallback, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from '@apollo/client'

import CategoryItem from './CategoryItem'
import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA } from '../../apollo/queries'

import PagerView from 'react-native-pager-view'

import ProductPage from './ProductPage'
import SearchHeader from './SearchHeader'
import { theme } from '../../../utils/themeColors'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchModal from './SearchModal'
import ProductExplorerSkeleton from './ProductExplorerSkeleton'

const ProductExplorer = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const catListRef = useRef(null)
  const themeContext = useContext(ThemeContext)
  const pageRef = useRef(null)
  const { data, loading } = useQuery(GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_DATA)

  const categories = data?.getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor ?? []
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [searchVisible, setSearchVisible] = useState(false)
  const onCategoryPress = (index) => {
    setActiveCategoryIndex(index)

    pageRef?.current?.setPage(index)
    catListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
  }

  const allItems = useMemo(() => {
    const map = new Map()

    categories.forEach((category) => {
      // 1️⃣ Category-level items
      category.items?.forEach((item) => {
        map.set(item.id, {
          ...item,
          categoryName: category.categoryName,
          categoryId: category.categoryId
        })
      })

      // 2️⃣ SubCategory items
      category.subCategories?.forEach((sub) => {
        sub.items?.forEach((item) => {
          map.set(item.id, {
            ...item,
            categoryName: category.categoryName,
            categoryId: category.categoryId,
            subCategoryName: sub.subCategoryName,
            subCategoryId: sub.subCategoryId
          })
        })
      })
    })

    // ✅ Unique + flat
    return Array.from(map.values())
  }, [categories])

  if (!loading) return <ProductExplorerSkeleton />

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme[themeContext.ThemeValue].themeBackground, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* Categories */}

        <SearchHeader
          onBackPress={() => {
            navigation.canGoBack() && navigation.goBack()
          }}
          onPressSearch={() => setSearchVisible(true)} 
        />
        <View style={styles.subContainer}>
          <FlashList
            style={styles.categoriesList}
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
                  onCategoryPress(index)
                }}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />

          {/* Products */}
          <PagerView
            ref={pageRef}
            onPageSelected={(e) => {
              const index = e.nativeEvent.position
              setActiveCategoryIndex(index)
              catListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5
              })
            }}
            style={styles.pagerView}
            initialPage={0}
          >
            {categories.map((item, index) => (
              <ProductPage key={index} category={categories[index]} pageIndex={index}></ProductPage>
            ))}
          </PagerView>
        </View>
      </View>

      <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} items={allItems} />
    </>
  )
}

export default ProductExplorer

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pagerView: {
    flex: 1
  },
  categoriesList: {
    marginTop: 0
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10
  }
})
