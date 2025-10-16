import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { View, RefreshControl, Animated, Platform, TouchableOpacity } from 'react-native'
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
import Item from '../../components/Main/Item/Item'
import { LocationContext } from '../../context/Location'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'
import Spinner from '../../components/Spinner/Spinner'
import { alignment } from '../../utils/alignment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { storeSearch, getRecentSearches, clearRecentSearches } from '../../utils/recentSearch'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import { ScrollView } from 'react-native-gesture-handler'
import { isOpen, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'
import { escapeRegExp } from '../../utils/regex'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'

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
  const { location, setLocation } = useContext(LocationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const newheaderColor = currentTheme.backgroundColor
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

  const { data, refetch, networkStatus, loading, error } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null,
      shopType: null,
      ip: null
    },
    fetchPolicy: 'network-only'
  })

  const { data: topRatedData } = useQuery(TOP_RATED_VENDORS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    skip: !location.latitude || !location.longitude
  })

  const { data: recentOrderData } = useQuery(RECENT_ORDER_RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    skip: !location.latitude || !location.longitude
  })

  const { data: mostOrderedData } = useQuery(MOST_ORDERED_RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    skip: !location.latitude || !location.longitude
  })

  useEffect(() => {
    navigation.setOptions({
      title: t('searchTitle'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground,
        elevation: 0
      }
    })
  }, [navigation, currentTheme])

  useEffect(() => {
    getRecentSearches().then((searches) => setRecentSearches(searches))
  }, [search])

  const { onScroll /* Event handler */, containerPaddingTop /* number */, scrollIndicatorInsetTop /* number */ } = useCollapsibleSubHeader()

  const nearbyRestaurants = data?.nearByRestaurantsPreview?.restaurants || []
  const topRatedRestaurants = topRatedData?.topRatedVendorsPreview || []
  const recentOrderRestaurants = recentOrderData?.recentOrderRestaurantsPreview || []
  const mostOrderedRestaurants = mostOrderedData?.mostOrderedRestaurantsPreview || []

  // Combine all restaurants and remove duplicates
  const allRestaurants = [
    ...nearbyRestaurants,
    ...topRatedRestaurants,
    ...recentOrderRestaurants,
    ...mostOrderedRestaurants
  ]
  
  const restaurants = allRestaurants.filter((restaurant, index, self) => 
    index === self.findIndex(r => r._id === restaurant._id)
  )

  const searchAllShops = (searchText) => {
    const data = []
    const escapedSearchText = escapeRegExp(searchText)
    const regex = new RegExp(escapedSearchText, 'i')

    restaurants?.forEach((restaurant) => {
      const nameMatch = restaurant.name.search(regex) > -1
      const keywordMatch = restaurant.keywords?.some((keyword) => {
        const result = keyword.search(regex)
        return result > -1
      })
      
      if (nameMatch || keywordMatch) {
        data.push(restaurant)
      }
    })
    return data
  }

  function getUniqueTags(restaurants) {
    const allTags = new Set()
    restaurants?.forEach((restaurant) => {
      restaurant?.tags.forEach((tag) => allTags.add(tag))
    })
    return Array.from(allTags) // Convert Set back to an array
  }

  const uniqueTags = getUniqueTags(restaurants)

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView />

  const emptyView = () => {
    return (
      <View style={styles(currentTheme).emptyViewContainer}>
        <View style={styles(currentTheme).emptyViewBox}>
          <TextDefault textColor={currentTheme.fontGrayNew} center>
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

  const handleClearRecentSearches = async () => {
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
        <View style={styles().searchList}>
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
            data={sortRestaurantsByOpenStatus(searchAllShops(search) || [])}
            renderItem={({ item }) => {
              const restaurantOpen = isOpen(item)
              return <NewRestaurantCard {...item} isSearch={search} fullWidth isOpen={restaurantOpen} />
            }}
          />
        </View>
      )
    } else if (recentSearches.length > 0) {
      return (
        <View style={styles(currentTheme).recentSearchContainer}>
          <View style={styles(currentTheme).flexRow}>
            <View>
              <TextDefault style={styles().drawerContainer} textColor={currentTheme.fontMainColor} small H4 bolder>
                {t('recentSearches')}
              </TextDefault>
            </View>
            <View>
              <TouchableOpacity onPress={() => handleClearRecentSearches()}>
                <TextDefault style={styles().drawerContainer} textColor={currentTheme.fontMainColor} normal bolder>
                  {t('clear')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles().line} />

          {/* recent seareches list */}

          {recentSearches.map((recentSearch, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity onPress={() => handleTagPress(recentSearch)} style={styles(currentTheme).recentListBtn}>
                <View>
                  <Ionicons name='search' color={currentTheme.gray500} size={scale(20)} />
                </View>
                <View>
                  <TextDefault>{recentSearch}</TextDefault>
                </View>
              </TouchableOpacity>

              <View style={styles().line} />
            </React.Fragment>
          ))}
        </View>
      )
    } else {
      return (
        <View style={styles(currentTheme).tagView}>
          {loading ? (
            <View style={{ ...alignment.MTmedium }}>
              <Spinner size={'small'} backColor={'transparent'} spinnerColor={currentTheme.main} />
            </View>
          ) : (
            uniqueTags.map((tag, index) =>
              hasAnimated ? (
                <TouchableOpacity key={index} onPress={() => handleTagPress(tag)}>
                  <View style={styles(currentTheme).tagItem}>
                    <TextDefault>{tag}</TextDefault>
                  </View>
                </TouchableOpacity>
              ) : (
                <CustomItem index={index}>
                  <TouchableOpacity key={tag} onPress={() => handleTagPress(tag)}>
                    <View style={styles(currentTheme).tagItem}>
                      <TextDefault>{tag}</TextDefault>
                    </View>
                  </TouchableOpacity>
                </CustomItem>
              )
            )
          )}
        </View>
      )
    }
  }

  return (
    <ScrollView style={styles(currentTheme).flex}>
      <View
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[currentTheme.iconColorPink]}
            refreshing={networkStatus === 4}
            onRefresh={() => {
              if (networkStatus === 7) {
                refetch()
              }
            }}
          />
        }
      >
        <View style={styles().searchbar}>
          <Search setSearch={setSearch} search={search} newheaderColor={newheaderColor} placeHolder={t('searchRestaurant')} />
        </View>
        {renderTagsOrSearches()}
      </View>
    </ScrollView>
  )
}

export default SearchScreen
