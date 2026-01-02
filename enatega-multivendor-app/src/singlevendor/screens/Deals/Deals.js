import { SafeAreaView, Platform, StatusBar } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { GET_LIMITED_TIME_FOODS_DEALS ,GET_WEEKLY_FOODS_DEALS ,GET_NEW_OFFERS_FOODS_DEALS} from '../../apollo/queries'
import SectionList from '../../components/SectionList'
import { FlashList } from '@shopify/flash-list'
import HorizontalSubCategoriesList from '../../components/HorizontalSubCategoriesList'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './Styles'

const Deals = () => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(0)
  const activeSubCategoryIndexRef = useRef(0)
  console.log('activeSubCategoryIndex',activeSubCategoryIndex);
  
  const dealsListRef = useRef(null)
  const subCatListRef = useRef(null)
  const isAutoScrollingRef = useRef(false)

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  // Dummy data array for subcategories
  const dummySubCategories = [
   
    {
      subCategoryId: '1',
      subCategoryName: 'Limited time deals'
    },
    {
      subCategoryId: '2',
      subCategoryName: 'weekly deals'
    },
    {
      subCategoryId: '3',
      subCategoryName: 'New offers'
    },
    
  ]

  const handleSubCategoryPress = (index) => {
    setActiveSubCategoryIndex(index)
    activeSubCategoryIndexRef.current = index      
      dealsListRef.current?.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0
      })
    
    // Scroll subcategory list to center the selected item
    subCatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    })
  }

  const { data, loading, error, refetch: refetchLimitedTime } = useQuery(GET_LIMITED_TIME_FOODS_DEALS)
  const { data: weeklydealsData, loading: weeklydealsLoading, error: weeklydealsError, refetch: refetchWeekly } = useQuery(GET_WEEKLY_FOODS_DEALS)
  const { data: newoffersdealsData, loading: newoffersdealsLoading, error: newoffersdealsError, refetch: refetchNewOffers } = useQuery(GET_NEW_OFFERS_FOODS_DEALS)

  // Create sections array for FlashList
  const sections = useMemo(() => [
    {
      id: 'limited-time',
      title: 'Limited time deals',
      data: data?.getLimitedTimeFoodsDeals?.items || [],
      loading,
      error,
      onRetry: refetchLimitedTime
    },
    {
      id: 'weekly',
      title: 'weekly deals',
      data: weeklydealsData?.getWeeklyFoodsDeals?.items || [],
      loading: weeklydealsLoading,
      error: weeklydealsError,
      onRetry: refetchWeekly
    },
    {
      id: 'new-offers',
      title: 'New offers ',
      data: newoffersdealsData?.getNewOffersFoodsDeals?.items || [],
      loading: newoffersdealsLoading,
      error: newoffersdealsError,
      onRetry: refetchNewOffers
    }
  ], [
    data?.getLimitedTimeFoodsDeals?.items,
    loading,
    error,
    refetchLimitedTime,
    weeklydealsData?.getWeeklyFoodsDeals?.items,
    weeklydealsLoading,
    weeklydealsError,
    refetchWeekly,
    newoffersdealsData?.getNewOffersFoodsDeals?.items,
    newoffersdealsLoading,
    newoffersdealsError,
    refetchNewOffers
  ])

  useEffect(() => {
    console.log('get new offers deals Data:', JSON.stringify(newoffersdealsData?.getNewOffersFoodsDeals?.items,null,2))
    console.log('GET newoffer loading  WITH_DEAL Loading:', newoffersdealsLoading)
    console.log('GET new offer errore_DEALS_WITH_DEAL Error:', newoffersdealsError)
  }, [newoffersdealsData, newoffersdealsLoading, newoffersdealsError])

  const renderSectionItem = ({ item, index }) => {
    return (
      <SectionList 
        title={item.title} 
        data={item.data} 
        loading={item.loading}
        error={item.error}
        onRetry={item.onRetry}
      />
    )
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    console.log('viewableItems',viewableItems);
    if (!viewableItems.length) return

    const activeSectionIndex = viewableItems[0].index;
    console.log('activeSectionIndex',activeSectionIndex,activeSubCategoryIndex);
    if (activeSectionIndex !== activeSubCategoryIndexRef.current) {
      setActiveSubCategoryIndex(activeSectionIndex);
      activeSubCategoryIndexRef.current = activeSectionIndex
      subCatListRef.current?.scrollToIndex({
        index: activeSectionIndex,
        animated: true,
        viewPosition: 0.5
      })
    }
  },[activeSubCategoryIndex]).current

  
  const keyExtractor = (item) => item.id

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <HorizontalSubCategoriesList
        data={dummySubCategories}
        activeIndex={activeSubCategoryIndex}
        onSubCategoryPress={handleSubCategoryPress}
        listRef={subCatListRef}
      />
      <FlashList
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ 
          // itemVisiblePercentThreshold: 100
        
          viewAreaCoveragePercentThreshold: 50,
          minimumViewTime: 200,
        }}
        ref={dealsListRef}
        data={sections}
        keyExtractor={keyExtractor}
        renderItem={renderSectionItem}
        estimatedItemSize={400}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          // Handle scroll to index failure gracefully
          const wait = new Promise(resolve => setTimeout(resolve, 500))
          wait.then(() => {
            dealsListRef.current?.scrollToIndex({ index: info.index, animated: true })
          })
        }}
      />
    </SafeAreaView>
  )
}

export default Deals

