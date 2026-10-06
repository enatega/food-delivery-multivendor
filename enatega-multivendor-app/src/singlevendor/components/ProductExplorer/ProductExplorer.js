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

import React, { memo, useRef, useState, useContext, useMemo, useCallback, useDeferredValue, useLayoutEffect, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Pressable, Text, Animated, InteractionManager } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useQuery, useApolloClient } from '@apollo/client'
import { useNavigation, useRoute } from '@react-navigation/native'

import ProductPage from './ProductPage'
import SearchHeader from './SearchHeader'
import ProductExplorerSkeleton, { ProductGridSkeleton } from './ProductExplorerSkeleton'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { GET_ALL_CATEGORIES_WITH_SUBCATEGORIES_ONLY_SEE_ALL_SINGLE_VENDOR } from '../../apollo/queries'
import BrowseModal from '../Browse/BrowseModal'
import useBrowse from '../../screens/Browse/useBrowse'
import SectionErrorCard from '../SectionErrorCard'
import useCheckoutPalette from '../Checkout/useCheckoutPalette'
import { prefetchCategoryProducts } from '../../utils/productExplorerPrefetch'

// Pages within this distance of the open category are mounted (and fetched) ahead of time.
const PREFETCH_DISTANCE = 1
const TAB_HEIGHT = 36
const PILL_BASE = 100
const PILL_OVERLAP = 2

const CategoryTab = memo(({ index, title, active, onPressIndex, onLayoutIndex, styles: s }) => (
  <Pressable
    onLayout={(e) => onLayoutIndex(index, e)}
    onPress={() => onPressIndex(index)}
    style={s.tab}
    hitSlop={{ top: 6, bottom: 6 }}
    accessibilityRole='tab'
    accessibilityState={{ selected: active }}
  >
    {/* Same weight in both states so tab widths never shift under the sliding pill. */}
    <Text style={[s.tabText, active && s.tabTextActive]} numberOfLines={1}>
      {title}
    </Text>
  </Pressable>
))
CategoryTab.displayName = 'CategoryTab'

const lerp = (a, b, t) => a + (b - a) * t

// Animated wrapper so the pager's scroll position feeds the pill on the native thread.
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

const ProductExplorer = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const client = useApolloClient()
  const catScrollRef = useRef(null)
  const pageRef = useRef(null)
  const themeContext = useContext(ThemeContext)
  const { palette } = useCheckoutPalette()
  const s = useMemo(() => styles(palette), [palette])

  const tabLayoutsRef = useRef({})
  const [measuredTabs, setMeasuredTabs] = useState(0)
  const barWidthRef = useRef(0)
  const activeIndexRef = useRef(0)
  const pendingCenterRef = useRef(null)
  const jumpTargetRef = useRef(null)
  const appliedRouteCategoryRef = useRef(null)
  // Pill animation runs entirely on the native driver:
  //  - pagePosition + pageOffset come straight from the pager while the user swipes;
  //  - tapProgress springs the pill after a tab press;
  //  - tapMode (0/1) picks which of the two the pill follows.
  const pagePosition = useRef(new Animated.Value(0)).current
  const pageOffset = useRef(new Animated.Value(0)).current
  const tapProgress = useRef(new Animated.Value(0)).current
  const tapMode = useRef(new Animated.Value(0)).current
  const tapModeRef = useRef(false)
  const pillProgress = useMemo(() => Animated.add(
    Animated.multiply(Animated.add(pagePosition, pageOffset), Animated.subtract(1, tapMode)),
    Animated.multiply(tapProgress, tapMode)
  ), [pagePosition, pageOffset, tapProgress, tapMode])

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  // The pager and product lists are heavy; mounting them during the push transition
  // stalls it on a blank card. Paint the header, category bar and a grid skeleton
  // first, then mount the pager once the transition has finished.
  const [isTransitionDone, setIsTransitionDone] = useState(false)
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setIsTransitionDone(true))
    return () => task.cancel()
  }, [])
  // Pages mount around the index the pager settled on (not mid-swipe), deferred so the
  // tab highlight paints before any page work.
  const [settledIndex, setSettledIndex] = useState(0)
  const loadIndex = useDeferredValue(settledIndex)
  const mountedPagesRef = useRef(new Set())

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
    isSearching,
    loadMore,
    hasMore
  } = useBrowse()

  const categories = useMemo(() => data?.getAllCategoriesWithSubCategoriesOnlySeeAllSingleVendor ?? [], [data])
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

  // Warm the first page of every category so switching tabs shows products immediately.
  useEffect(() => {
    if (!isTransitionDone) return
    categories.forEach((category) => prefetchCategoryProducts(client, category?.categoryId))
  }, [client, categories, isTransitionDone])

  const scrollBarTo = useCallback((centerX, animated) => {
    const barWidth = barWidthRef.current
    if (!barWidth) return
    catScrollRef.current?.scrollTo({ x: Math.max(0, centerX - barWidth / 2), animated })
  }, [])

  // Scrolls the category bar so the given tab sits in the middle. If the tab
  // has not been measured yet, the scroll is retried from its onLayout.
  const centerCategory = useCallback((index, animated = true) => {
    const layout = tabLayoutsRef.current[index]
    if (!layout || !barWidthRef.current) {
      pendingCenterRef.current = { index, animated: false }
      return
    }
    pendingCenterRef.current = null
    scrollBarTo(layout.x + layout.width / 2, animated)
  }, [scrollBarTo])

  const selectCategory = useCallback((index, { animated = true } = {}) => {
    if (activeIndexRef.current === index) return
    activeIndexRef.current = index
    setActiveCategoryIndex(index)
    centerCategory(index, animated)
  }, [centerCategory])

  // Open the category requested by the route (on mount and whenever it changes).
  useLayoutEffect(() => {
    if (!categories.length) return
    const normalizedRouteCategoryId = routeCategoryId == null ? '' : String(routeCategoryId)
    if (appliedRouteCategoryRef.current === normalizedRouteCategoryId) return

    const isFirstApply = appliedRouteCategoryRef.current === null
    appliedRouteCategoryRef.current = normalizedRouteCategoryId
    activeIndexRef.current = requestedCategoryIndex
    setActiveCategoryIndex(requestedCategoryIndex)
    setSettledIndex(requestedCategoryIndex)
    pagePosition.setValue(requestedCategoryIndex)
    pageOffset.setValue(0)
    tapProgress.setValue(requestedCategoryIndex)
    if (!isFirstApply) pageRef.current?.setPageWithoutAnimation(requestedCategoryIndex)
    centerCategory(requestedCategoryIndex, false)
  }, [categories, requestedCategoryIndex, routeCategoryId, centerCategory, pagePosition, pageOffset, tapProgress])

  const onCategoryPress = useCallback((index) => {
    // Jump straight to the page instead of animating through every page in between,
    // while the pill glides across to the pressed tab.
    jumpTargetRef.current = index
    tapProgress.stopAnimation()
    // Continue from where the pill is: mid-spring if a tap is already animating, else the current tab.
    if (!tapModeRef.current) {
      tapProgress.setValue(activeIndexRef.current)
      tapModeRef.current = true
      tapMode.setValue(1)
    }
    Animated.spring(tapProgress, { toValue: index, useNativeDriver: true, speed: 20, bounciness: 3 }).start()
    pageRef.current?.setPageWithoutAnimation(index)
    selectCategory(index)
    setSettledIndex(index)
  }, [selectCategory, tapProgress, tapMode])

  const onTabLayout = useCallback((index, e) => {
    const { x, width } = e.nativeEvent.layout
    const previous = tabLayoutsRef.current[index]
    tabLayoutsRef.current[index] = { x, width }
    if (!previous || previous.x !== x || previous.width !== width) {
      setMeasuredTabs((count) => count + 1)
    }
    if (pendingCenterRef.current?.index === index) {
      centerCategory(index, pendingCenterRef.current.animated)
    }
  }, [centerCategory])

  // Pill = left cap + stretchable middle + right cap. Only translateX/scaleX are animated,
  // which the native driver supports, and the caps keep the rounded ends undistorted.
  const indicatorParts = useMemo(() => {
    const layouts = categories.map((_, i) => tabLayoutsRef.current[i])
    if (!layouts.length || layouts.some((l) => !l)) return null
    const inputRange = layouts.length === 1 ? [0, 1] : layouts.map((_, i) => i)
    const pad = (values) => (layouts.length === 1 ? [values[0], values[0]] : values)
    const map = (fn) => pillProgress.interpolate({ inputRange, outputRange: pad(layouts.map(fn)), extrapolate: 'clamp' })
    // The middle strip reaches PILL_OVERLAP px under each cap so no seam or square
    // corner shows where the pieces meet; it scales from a fixed base width.
    const middle = (l) => Math.max(l.width - TAB_HEIGHT, 0) + PILL_OVERLAP * 2
    return {
      left: { transform: [{ translateX: map((l) => l.x) }] },
      middle: {
        transform: [
          { translateX: map((l) => l.x + l.width / 2 - PILL_BASE / 2) },
          { scaleX: map((l) => middle(l) / PILL_BASE) }
        ]
      },
      right: { transform: [{ translateX: map((l) => l.x + l.width - TAB_HEIGHT) }] }
    }
  }, [categories, measuredTabs, pillProgress]) // measuredTabs: recompute once tabs are measured

  // Visited pages stay mounted so returning to them is instant; far pages are empty views.
  // Before the route category is applied, use it directly so page 0 isn't mounted for nothing.
  const pageCenterIndex = appliedRouteCategoryRef.current === null ? requestedCategoryIndex : loadIndex
  const mountedPages = useMemo(() => {
    for (let i = pageCenterIndex - PREFETCH_DISTANCE; i <= pageCenterIndex + PREFETCH_DISTANCE; i++) {
      if (i >= 0 && i < categories.length) mountedPagesRef.current.add(i)
    }
    return new Set(mountedPagesRef.current)
  }, [pageCenterIndex, categories.length])

  const onBarLayout = (e) => {
    barWidthRef.current = e.nativeEvent.layout.width
    if (pendingCenterRef.current) {
      centerCategory(pendingCenterRef.current.index, pendingCenterRef.current.animated)
    }
  }

  // Light JS work only: follow the bar scroll and flip the label colour at the halfway point.
  const onPageScrollJS = (e) => {
    // Ignored while a tab-press jump is settling, so the bar doesn't flash back.
    if (jumpTargetRef.current !== null) return
    const { position, offset } = e.nativeEvent
    const progress = position + offset

    // Drag the category bar along with the finger.
    const from = tabLayoutsRef.current[position]
    const to = tabLayoutsRef.current[Math.min(position + 1, categories.length - 1)]
    if (from && to) {
      scrollBarTo(lerp(from.x + from.width / 2, to.x + to.width / 2, offset), false)
    }

    // Highlight the tab once a page is more than halfway in view.
    const index = Math.round(progress)
    if (index >= 0 && index < categories.length && activeIndexRef.current !== index) {
      activeIndexRef.current = index
      setActiveCategoryIndex(index)
    }
  }

  const onPageScrollRef = useRef(null)
  onPageScrollRef.current = onPageScrollJS
  const onPageScroll = useMemo(() => Animated.event(
    [{ nativeEvent: { position: pagePosition, offset: pageOffset } }],
    { useNativeDriver: true, listener: (e) => onPageScrollRef.current?.(e) }
  ), [pagePosition, pageOffset])

  if (loading && !categories.length) return <ProductExplorerSkeleton />

  if (error && !categories.length) {
    return (
      <View style={[styles(palette).container, styles(palette).errorScreen, { backgroundColor: theme[themeContext.ThemeValue].themeBackground, paddingTop: insets.top }] }>
        <SearchHeader onBackPress={() => navigation.canGoBack() && navigation.goBack()} onPressSearch={() => setModalVisible(true)} />
        <SectionErrorCard title={t('Browse')} onRetry={refetch} />
      </View>
    )
  }

  return (
    <>

      <View
        style={[
          s.container,
          {
            backgroundColor: theme[themeContext.ThemeValue].themeBackground,
            paddingTop: insets.top,
            paddingBottom: insets.bottom
          }
        ]}
      >

        <SearchHeader onBackPress={() => navigation.canGoBack() && navigation.goBack()} onPressSearch={() => setModalVisible(true)} />

        <View style={s.categoryBar} onLayout={onBarLayout}>
          <ScrollView
            ref={catScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={s.categoryContent}
          >
            {indicatorParts && (
              <>
                <Animated.View pointerEvents='none' style={[s.indicatorCap, indicatorParts.left]} />
                <Animated.View pointerEvents='none' style={[s.indicatorMiddle, indicatorParts.middle]} />
                <Animated.View pointerEvents='none' style={[s.indicatorCap, indicatorParts.right]} />
              </>
            )}
            {categories.map((item, index) => (
              <CategoryTab
                key={item.categoryId}
                index={index}
                title={item.categoryName}
                active={index === activeCategoryIndex}
                onPressIndex={onCategoryPress}
                onLayoutIndex={onTabLayout}
                styles={s}
              />
            ))}
          </ScrollView>
        </View>

        {!isTransitionDone
          ? <ProductGridSkeleton />
          : (
        <AnimatedPagerView
          ref={pageRef}
          initialPage={requestedCategoryIndex}
          style={{ flex: 1 }}
          offscreenPageLimit={PREFETCH_DISTANCE}
          onPageScroll={onPageScroll}
          onPageSelected={(e) => {
            const index = e.nativeEvent.position
            if (jumpTargetRef.current !== null && jumpTargetRef.current !== index) return
            jumpTargetRef.current = null
            if (tapModeRef.current) {
              // Keep the swipe values in sync with the tapped page for the next drag.
              pagePosition.setValue(index)
              pageOffset.setValue(0)
            }
            activeIndexRef.current = -1
            selectCategory(index)
            setSettledIndex(index)
          }}
          onPageScrollStateChanged={(e) => {
            if (e.nativeEvent.pageScrollState === 'dragging') {
              // Hand the pill back to the finger; position/offset already match the tapped page.
              jumpTargetRef.current = null
              if (tapModeRef.current) {
                tapModeRef.current = false
                tapProgress.stopAnimation()
                tapMode.setValue(0)
              }
            }
          }}
        >

          {categories.map((category, index) => (
            <View key={category.categoryId} style={{ flex: 1 }} collapsable={false}>
              {mountedPages.has(index) ? <ProductPage category={category} /> : null}
            </View>
          ))}

        </AnimatedPagerView>
            )}

      </View>

        <BrowseModal visible={modalVisible} onClose={handleModalClose} inputRef={inputRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleClearSearch={handleClearSearch} currentTheme={currentTheme} t={t} insets={insets} data={searchedData} loading={searchedLoading} error={searchError} onRetry={retrySearch} debouncedSearch={debouncedSearch} onProductPress={onProductPress} handleAddToCart={handleAddToCart} isSearched={isSearched} isSearching={isSearching} loadMore={loadMore} hasMore={hasMore} />

    </>
  )
}

export default ProductExplorer

const styles = (palette) => StyleSheet.create({
  container: { flex: 1 },
  errorScreen: { paddingHorizontal: 10 },
  categoryBar: {
    flexGrow: 0,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border
  },
  categoryContent: {
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  indicatorCap: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: TAB_HEIGHT,
    height: TAB_HEIGHT,
    borderRadius: TAB_HEIGHT / 2,
    backgroundColor: palette.brand
  },
  indicatorMiddle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: PILL_BASE,
    height: TAB_HEIGHT,
    backgroundColor: palette.brand
  },
  tab: {
    height: TAB_HEIGHT,
    paddingHorizontal: 16,
    borderRadius: TAB_HEIGHT / 2,
    justifyContent: 'center',
    marginRight: 4
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary
  },
  tabTextActive: {
    color: palette.onBrand
  }
})
