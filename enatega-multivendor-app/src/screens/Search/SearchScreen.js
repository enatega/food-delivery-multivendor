import React, { useState, useEffect, useContext, useMemo } from 'react'
import { View, RefreshControl, Animated, Platform, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery, gql } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import Search from '../../components/Main/Search/Search'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { restaurantListPreview, topRatedVendorsInfo, recentOrderRestaurantsQuery, mostOrderedRestaurantsQuery } from '../../apollo/queries'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'
import Spinner from '../../components/Spinner/Spinner'
import { alignment } from '../../utils/alignment'
import { Ionicons } from '@expo/vector-icons'
import { getRecentSearches, clearRecentSearches } from '../../utils/recentSearch'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import { isOpen, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'
import { SectionAction, SectionHeader, useMultivendorTheme } from '../../ui/designSystem'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import { useRestaurantQueries } from '../../ui/hooks/useRestaurantQueries'

const RESTAURANTS = gql`
  ${restaurantListPreview}
`

const TOP_RATED_VENDORS = gql`
  ${topRatedVendorsInfo}
`

const RECENT_ORDER_RESTAURANTS = gql`
  ${recentOrderRestaurantsQuery}
`

const MOST_ORDERED_RESTAURANTS = gql`
  ${mostOrderedRestaurantsQuery}
`

const SearchScreen = () => {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const { location } = useContext(LocationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { tokens } = useMultivendorTheme()
  const searchTheme = { ...tokens, isRTL: currentTheme.isRTL }
  const [recentSearches, setRecentSearches] = useState([])
  const [hasAnimated, setHasAnimated] = useState(false) // Track first render

  // CustomItem component to handle animation
  const CustomItem = ({ index, children }) => {
    const scaleValue = new Animated.Value(0)

    React.useEffect(() => {
      if (!hasAnimated) {
        Animated.timing(scaleValue, {
          toValue: 1,
          delay: index * 40,
          duration: 300, // Set duration for the animation
          useNativeDriver: true
        }).start(() => {
          // Update hasAnimated to true after the first animation
          if (index === restaurants.length - 1) {
            setHasAnimated(true)
          }
        })
      }
    }, [index, hasAnimated])

    return (
      <Animated.View
        style={{
          opacity: scaleValue
        }}
      >
        {children}
      </Animated.View>
    )
  }

  const { data, refetch, networkStatus, loading } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null,
      shopType: null,
      ip: null
    },
    fetchPolicy: 'cache-and-network'
  })

  const { data: topRatedData } = useQuery(TOP_RATED_VENDORS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    skip: !location.latitude || !location.longitude,
    fetchPolicy: 'cache-and-network'
  })

  const { data: recentOrderData } = useQuery(RECENT_ORDER_RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    skip: !location.latitude || !location.longitude,
    fetchPolicy: 'cache-and-network'
  })

  const { data: mostOrderedData } = useQuery(MOST_ORDERED_RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    fetchPolicy: 'cache-and-network',
    skip: !location.latitude || !location.longitude
  })

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  useEffect(() => {
    getRecentSearches().then((searches) => setRecentSearches(searches))
  }, [])

  useEffect(() => {
    const trimmedSearch = search.trim()
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(trimmedSearch)
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [search])

  const { onScroll /* Event handler */, containerPaddingTop /* number */, scrollIndicatorInsetTop /* number */ } = useCollapsibleSubHeader()

  const nearbyRestaurants = data?.nearByRestaurantsPreview?.restaurants || []
  const topRatedRestaurants = topRatedData?.topRatedVendorsPreview || []
  const recentOrderRestaurants = recentOrderData?.recentOrderRestaurantsPreview || []
  const mostOrderedRestaurants = mostOrderedData?.mostOrderedRestaurantsPreview || []
  const { restaurantData: nearByGroceryStores } = useRestaurantQueries('grocery', location, 'grocery')

  // Combine all restaurants and remove duplicates
  const restaurants = useMemo(() => {
    const allRestaurants = [
      ...nearbyRestaurants,
      ...topRatedRestaurants,
      ...recentOrderRestaurants,
      ...mostOrderedRestaurants,
      ...(nearByGroceryStores || [])
    ]

    return allRestaurants.filter((restaurant, index, self) =>
      index === self.findIndex((item) => item._id === restaurant._id)
    )
  }, [
    nearbyRestaurants,
    topRatedRestaurants,
    recentOrderRestaurants,
    mostOrderedRestaurants,
    nearByGroceryStores
  ])

  const filteredRestaurants = useMemo(() => {
    if (!debouncedSearch) return []

    const normalizedSearch = debouncedSearch.toLowerCase()
    const nameMatches = []
    const secondaryMatches = []

    restaurants.forEach((restaurant) => {
      const restaurantName = restaurant?.name?.toLowerCase?.() || ''
      const cuisines = restaurant?.cuisines || []
      const tags = restaurant?.tags || []
      const keywords = restaurant?.keywords || []
      const matchesName = restaurantName.includes(normalizedSearch)
      const matchesCuisine = cuisines.some((cuisine) =>
        cuisine?.toLowerCase?.().includes(normalizedSearch)
      )
      const matchesTag = tags.some((tag) =>
        tag?.toLowerCase?.().includes(normalizedSearch)
      )
      const matchesKeyword = keywords.some((keyword) =>
        keyword?.toLowerCase?.().includes(normalizedSearch)
      )

      if (matchesName) {
        nameMatches.push(restaurant)
        return
      }

      if (matchesCuisine || matchesTag || matchesKeyword) {
        secondaryMatches.push(restaurant)
      }
    })

    return [...nameMatches, ...secondaryMatches]
  }, [debouncedSearch, restaurants])

  function getUniqueTags(restaurants) {
    const allTags = new Set()
    restaurants?.forEach((restaurant) => {
      restaurant?.tags.forEach((tag) => allTags.add(tag))
    })
    return Array.from(allTags) // Convert Set back to an array
  }

  const uniqueTags = getUniqueTags(restaurants)

  const { isConnected: connect } = useNetworkStatus()
  if (!connect) return <ErrorView />

  const emptyView = () => {
    return (
      <View style={styles(searchTheme).emptyViewContainer}>
        <View style={styles(searchTheme).emptyViewBox}>
          <TextDefault textColor={tokens.colors.textMuted} center>
            {t('noResults')}
          </TextDefault>
        </View>
      </View>
    )
    // }
  }

  const handleTagPress = (tag) => {
    setSearch(tag)
  }

  const handleClearRecentSearches = async() => {
    try {
      await clearRecentSearches()
      setRecentSearches([]) // Update state with empty array
    } catch (error) {
      console.log('Error clearing searches:', error)
    }
  }

  const renderTagsOrSearches = () => {
    if (search) {
      return (
        <View style={styles(searchTheme).searchList}>
          <Animated.FlatList
            contentInset={{
              top: containerPaddingTop
            }}
            contentContainerStyle={{
              paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop,
              gap: 16,
              ...alignment.PBlarge
            }}
            contentOffset={{
              y: -containerPaddingTop
            }}
            onScroll={onScroll}
            scrollIndicatorInsets={{
              top: scrollIndicatorInsetTop
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyView()}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                progressViewOffset={containerPaddingTop}
                colors={[currentTheme.iconColorPink]}
                refreshing={networkStatus === 4}
                onRefresh={() => {
                  if (networkStatus === 7) {
                    refetch()
                  }
                }}
              />
            }
            data={sortRestaurantsByOpenStatus(filteredRestaurants)}
            renderItem={({ item }) => {
              const restaurantOpen = isOpen(item)
              return <NewRestaurantCard {...item} isSearch={search} fullWidth isOpen={restaurantOpen} />
            }}
          />
        </View>
      )
    } else if (recentSearches.length > 0) {
      return (
        <View style={styles(searchTheme).recentSearchContainer}>
          <SectionHeader
            style={styles(searchTheme).recentSectionHeader}
            title={t('recentSearches')}
            action={<SectionAction label={t('clear')} onPress={handleClearRecentSearches} />}
          />

          <View style={styles(searchTheme).recentList}>
            {recentSearches.map((recentSearch, index) => (
              <React.Fragment key={`${recentSearch}-${index}`}>
                <TouchableOpacity
                  activeOpacity={0.72}
                  onPress={() => handleTagPress(recentSearch)}
                  style={styles(searchTheme).recentListBtn}
                >
                  <View style={styles(searchTheme).recentIcon}>
                    <Ionicons name='time-outline' color={tokens.colors.accent} size={scale(17)} />
                  </View>
                  <TextDefault numberOfLines={1} style={styles(searchTheme).recentText} textColor={tokens.colors.textPrimary}>
                    {recentSearch}
                  </TextDefault>
                  <Ionicons
                    name={currentTheme.isRTL ? 'chevron-back' : 'chevron-forward'}
                    color={tokens.colors.textMuted}
                    size={scale(16)}
                  />
                </TouchableOpacity>
                {index !== recentSearches.length - 1 && <View style={styles(searchTheme).line} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles(searchTheme).tagView}>
          {loading && (
            <View style={{ ...alignment.MTmedium }}>
              <Spinner size={'small'} backColor={'transparent'} spinnerColor={currentTheme.main} />
            </View>
          )}
          {!loading && uniqueTags.map((tag, index) => {
            const tagButton = (
              <TouchableOpacity onPress={() => handleTagPress(tag)}>
                <View style={styles(searchTheme).tagItem}>
                  <TextDefault textColor={tokens.colors.accent} numberOfLines={1} ellipsizeMode='tail'>{tag}</TextDefault>
                </View>
              </TouchableOpacity>
            )

            if (hasAnimated) {
              return <React.Fragment key={tag}>{tagButton}</React.Fragment>
            }

            return <CustomItem key={tag} index={index}>{tagButton}</CustomItem>
          })}
        </View>
      )
    }
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles(searchTheme).flex}>
      <View style={styles(searchTheme).stickySearchBar}>
        <Search setSearch={setSearch} search={search} placeHolder={t('searchRestaurant')} />
      </View>

      {search
        ? renderTagsOrSearches()
        : <ScrollView
            style={styles(searchTheme).contentScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
          >
            {renderTagsOrSearches()}
          </ScrollView>
      }
    </SafeAreaView>
  )
}

export default SearchScreen
