/* eslint-disable react/display-name */
import React, { useRef, useContext, useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react'
import { View, SafeAreaView, TouchableOpacity, StatusBar, Platform, ScrollView, Image, RefreshControl, ActivityIndicator, InteractionManager } from 'react-native'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useLocation } from '../../ui/hooks'
import UserContext from '../../context/User'
import { FetchAllShopTypes, getBanners, getCuisines, restaurantListPreview } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import MainRestaurantCard from '../../components/Main/MainRestaurantCard/MainRestaurantCard'
import { TopBrands } from '../../components/Main/TopBrands'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import useHomeRestaurants from '../../ui/hooks/useRestaurantOrderInfo'
import ErrorView from '../../components/ErrorView/ErrorView'
import ActiveOrders from '../../components/Main/ActiveOrders/ActiveOrders'
import MainLoadingUI from '../../components/Main/LoadingUI/MainLoadingUI'
import TopBrandsLoadingUI from '../../components/Main/LoadingUI/TopBrandsLoadingUI'
import Banner from '../../components/Main/Banner/Banner'
import Spinner from '../../components/Spinner/Spinner'
import CustomApartmentIcon from '../../assets/SVG/imageComponents/CustomApartmentIcon'
import MainModalize from '../../components/Main/Modalize/MainModalize'
import CollectionCard from '../../components/CollectionCard/CollectionCard'
import { getErrorMessage, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'
import { IMAGE_LINK } from '../../utils/constants'
import useGeocoding from '../../ui/hooks/useGeocoding'
import ForceUpdate from '../../components/Update/ForceUpdate'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { useRestaurantQueries } from '../../ui/hooks/useRestaurantQueries'
import HorizontalFlashList from '../../components/Lists/HorizontalFlashList'

const RESTAURANTS = gql`
  ${restaurantListPreview}
`
const SELECT_ADDRESS = gql`
  ${selectAddress}
`
const GET_BANNERS = gql`
  ${getBanners}
`
const GET_CUISINES = gql`
  ${getCuisines}
`
const FETCH_ALL_SHOPTYPES = FetchAllShopTypes

// Number of times a transient network failure is silently retried before the
// full-screen error is shown to the user.
const MAX_AUTO_RETRIES = 3

function Main(props) {
  const Analytics = analytics()

  const { t, i18n } = useTranslation()
  const [busy, setBusy] = useState(false)
  const { isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { getCurrentLocation } = useLocation()
  const { getAddress } = useGeocoding()
  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()

  const locationData = location
  const [hasActiveOrders, setHasActiveOrders] = useState(false)
  const [citiesModalVisible, setCitiesModalVisible] = useState(false)
  const {
    data,
    loading,
    error,
    refetch: refetchRestaurants
  } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location?.longitude || null,
      latitude: location?.latitude || null,
      shopType: null,
      ip: null
    },
    fetchPolicy: 'network-only'
  })

  // A transient network failure (e.g. "Network request failed") surfaces as a
  // networkError without an HTTP statusCode. This happens when the restaurants
  // query refires after the address/location changes and the request is briefly
  // interrupted. We auto-retry these instead of blowing away the whole screen.
  const isTransientNetworkError = !!error?.networkError && !error?.networkError?.statusCode && !(error?.graphQLErrors?.length > 0)
  const retryCountRef = useRef(0)
  const [retriesExhausted, setRetriesExhausted] = useState(false)

  // Reset the retry budget whenever the location changes (a fresh attempt).
  useEffect(() => {
    retryCountRef.current = 0
    setRetriesExhausted(false)
  }, [location?.latitude, location?.longitude])

  useEffect(() => {
    if (!error) {
      // Recovered — restore the retry budget for the next attempt.
      retryCountRef.current = 0
      if (retriesExhausted) setRetriesExhausted(false)
      return
    }
    if (!isTransientNetworkError) return
    if (retryCountRef.current >= MAX_AUTO_RETRIES) {
      if (!retriesExhausted) setRetriesExhausted(true)
      return
    }
    const timer = setTimeout(() => {
      retryCountRef.current += 1
      refetchRestaurants().catch(() => {})
    }, 800)
    return () => clearTimeout(timer)
  }, [error, isTransientNetworkError, retriesExhausted, refetchRestaurants])

  const { data: banners, refetch: refetchBanners } = useQuery(GET_BANNERS, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first'
  })
  const { data: allCuisines } = useQuery(GET_CUISINES)
  const { data: allShopTypes } = useQuery(FETCH_ALL_SHOPTYPES)
  const { orderLoading, orderError, orderData } = useHomeRestaurants()

  function onError(error) {
    console.log(error)
  }
  const [mutate] = useMutation(SELECT_ADDRESS, {
    onError
  })
  const recentOrderRestaurantsVar = orderData?.recentOrderRestaurants
  const mostOrderedRestaurantsVar = orderData?.mostOrderedRestaurants

  // "Top grocery picks" is derived from the single most-ordered fetch above
  // (grocery subset) instead of a second grocery-filtered network request.
  const mostOrderedGroceryStores = useMemo(
    () => (mostOrderedRestaurantsVar || []).filter(
      (item) => item?.shopType?.toLowerCase() === 'grocery'
    ),
    [mostOrderedRestaurantsVar]
  )
  const mostOrderedGroceryLoading = orderLoading
  const mostOrderedGroceryError = orderError

  const { restaurantData: nearByGroceryStores, loading: nearByGroceryStoresLoading, error: nearByGroceryStoresError } = useRestaurantQueries('grocery', location, 'grocery')
  const { restaurantData: restaurantorders, loading: restaurantordersLoading, error: restaurantordersError } = useRestaurantQueries('restaurant', location, 'restaurant')

  const handleActiveOrdersChange = (activeOrdersExist) => {
    setHasActiveOrders(activeOrdersExist)
  }
  const handleRefresh = async () => {
    setIsRefreshing(true)
    const { data: newBanners } = await refetchBanners()
    const { data: newRestaurants } = await refetchRestaurants()
    setIsRefreshing(false)
  }
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.newheaderColor)
      }
      StatusBar.setBarStyle('dark-content')
    }, [currentTheme])
  )
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        headerMenuBackground: currentTheme.themeBackground,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.iconColor,
        open: onOpen,
        navigation
      })
    )
  }, [navigation, currentTheme])

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  const addressIcons = {
    House: CustomHomeIcon,
    Office: CustomWorkIcon,
    Apartment: CustomApartmentIcon,
    Other: CustomOtherIcon
  }

  const setAddressLocation = (address) => {
    // Close the sheet immediately so the tap feels instant. Switching the
    // location re-runs every restaurant query and re-renders the whole
    // Discovery screen; doing that synchronously here blocks the JS thread and
    // makes the close animation stutter / appear to "do nothing". Defer it
    // until after the close animation so the interaction stays smooth.
    modalRef.current?.close()
    InteractionManager.runAfterInteractions(() => {
      setLocation({
        _id: address._id,
        label: address.label,
        latitude: Number(address.location.coordinates[1]),
        longitude: Number(address.location.coordinates[0]),
        deliveryAddress: address.deliveryAddress,
        details: address.details
      })
      mutate({ variables: { id: address._id } })
    })
  }

  const setCurrentLocation = async () => {
    setBusy(true)

    const { error, coords } = await getCurrentLocation()

    if (!coords || !coords.latitude || !coords.longitude) {
      console.error('Invalid coordinates:', coords)
      setBusy(false)
      return
    }

    try {
      // Fetch the address using the geocoding hook
      const { formattedAddress, city } = await getAddress(coords.latitude, coords.longitude)

      let address = formattedAddress || 'Unknown Address'

      if (address.length > 21) {
        address = address.substring(0, 21) + '...'
      }

      if (error) {
        navigation.navigate('SelectLocation')
      } else {
        modalRef.current?.close()
        setLocation({
          label: 'currentLocation',
          latitude: coords.latitude,
          longitude: coords.longitude,
          deliveryAddress: address
        })
        setBusy(false)
      }
    } catch (fetchError) {
      console.error('Error fetching address using Google Maps API:', fetchError.message)
    }
  }

  const handleMarkerPress = async (coordinates) => {
    setCitiesModalVisible(false)
    // setIsCheckingZone(true)
    const response = await getAddress(coordinates.latitude, coordinates.longitude)
    setLocation({
      label: 'Location',
      deliveryAddress: response.formattedAddress,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      city: response.city
    })
    setTimeout(() => {
      // setIsCheckingZone(false)
      reloadScreen()
      // navigation.navigate('Main')
    }, 100)
  }

  // Function to reload screen
  const reloadScreen = () => {
    navigation.navigate('Discovery', {
      refresh: Date.now()
    })
  }

  const modalHeader = () => (
    <View style={[styles().addNewAddressbtn]}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity style={[styles(currentTheme).addButton]} activeOpacity={0.7} onPress={setCurrentLocation} disabled={busy}>
          <View style={styles(currentTheme).addressSubContainer}>
            {busy ? (
              <Spinner size='small' />
            ) : (
              <>
                <SimpleLineIcons name='target' size={scale(18)} color={currentTheme.black} />
                <View style={styles().mL5p} />
                <TextDefault bold textColor={currentTheme.black}>
                  {t('currentLocation')}
                </TextDefault>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  const modalFooter = () => (
    <View style={[styles().addNewAddressbtn]}>
      <View style={[styles(currentTheme).addressContainer]}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles(currentTheme).addButton}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('AddNewAddress', {
                prevScreen: 'Main',
                ...locationData
              })
            } else {
              const modal = modalRef.current
              modal?.close()
              props?.navigation.navigate({
                name: 'CreateAccount'
              })
            }
          }}
        >
          <View style={styles(currentTheme).addressSubContainer}>
            <AntDesign name='pluscircleo' size={scale(20)} color={currentTheme.black} />
            <View style={styles().mL5p} textColor={currentTheme.black} />
            <TextDefault bold textColor={currentTheme.black}>
              {t('addAddress')}
            </TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )


  // const filterCusinies = () => {
  //   if (data !== undefined) {
  //     const cuisineShopTypeMap = new Map()

  //     for (let restaurant of data?.nearByRestaurantsPreview?.restaurants) {
  //       for (let cuisine of restaurant.cuisines) {
  //         const key = `${cuisine.name}-${restaurant.shopType}`
  //         if (!cuisineShopTypeMap.has(key)) {
  //           cuisineShopTypeMap.set(key, {
  //             ...cuisine,
  //             shopType: restaurant.shopType
  //           })
  //         }
  //       }
  //     }

  //     return Array.from(cuisineShopTypeMap.values())
  //   }
  //   return []
  // }

  const restaurantCuisines = useMemo(() => {
    if (!allCuisines?.cuisines) return []
    return allCuisines.cuisines.filter((cuisine) => cuisine?.shopType?.toLowerCase() === 'restaurant')
  }, [allCuisines])

  const groceryCuisines = useMemo(() => {
    if (!allCuisines?.cuisines) return []
    return allCuisines.cuisines.filter((cuisine) => cuisine?.shopType?.toLowerCase() === 'grocery')
  }, [allCuisines])

  const sortedRecentOrderRestaurants = useMemo(
    () => sortRestaurantsByOpenStatus(recentOrderRestaurantsVar || []),
    [recentOrderRestaurantsVar]
  )
  const sortedMostOrderedRestaurants = useMemo(
    () => sortRestaurantsByOpenStatus(mostOrderedRestaurantsVar || []),
    [mostOrderedRestaurantsVar]
  )
  const sortedRestaurantOrders = useMemo(
    () => sortRestaurantsByOpenStatus(restaurantorders || []),
    [restaurantorders]
  )
  const sortedMostOrderedGrocery = useMemo(
    () => sortRestaurantsByOpenStatus(mostOrderedGroceryStores || []),
    [mostOrderedGroceryStores]
  )

  const keyExtractorRestaurant = useCallback((item, index) => item?._id || `${item?.name}-restaurant-${index}`, [])
  const keyExtractorGrocery = useCallback((item, index) => item?._id || `${item?.name}-grocery-${index}`, [])

  const renderShopTypeItem = useCallback(
    ({ item }) => (
      <CollectionCard
        onPress={() => {
          navigation.navigate('Store', {
            collection: item.slug,
            selectedType: item.slug,
            isShopType: true
          })
        }}
        image={item?.image}
        name={item.name}
      />
    ),
    [navigation]
  )

  const renderRestaurantCuisineItem = useCallback(
    ({ item }) => (
      <CollectionCard
        onPress={() => {
          navigation.navigate('Restaurants', {
            collection: item.name
          })
        }}
        image={item?.image || IMAGE_LINK}
        name={item.name}
      />
    ),
    [navigation]
  )

  const renderGroceryCuisineItem = useCallback(
    ({ item }) => (
      <CollectionCard
        onPress={() => {
          navigation.navigate('Store', {
            collection: item.name
          })
        }}
        image={item?.image}
        name={item.name}
      />
    ),
    [navigation]
  )
  const userFriendlyErrorMessage = getErrorMessage(error)
  // Keep the loading UI up while a transient failure is being auto-retried so
  // the user never sees the full-screen "something went wrong" for a blip.
  const isAutoRetrying = !!error && isTransientNetworkError && !retriesExhausted
  const showErrorView = !!error && (!isTransientNetworkError || retriesExhausted)
  if (showErrorView) return <ErrorView refetchFunctions={[refetchRestaurants, refetchBanners]} errorMessage={userFriendlyErrorMessage} />
  return (
    <>
      {!connect ? (
        <ErrorView refetchFunctions={[refetchRestaurants, refetchBanners]} />
      ) : (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles().flex}>
          <View style={[styles().flex, styles(currentTheme).screenBackground]}>
            <View style={styles().flex}>
              <View style={styles().mainContentContainer}>
                <View style={[styles().flex, styles().subContainer]}>
                  {loading || isAutoRetrying || restaurantordersLoading || (restaurantorders === null && !error && !restaurantordersError) ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                      <ActivityIndicator size='large' color={currentTheme.spinnerColor} />
                    </View>
                  ) : restaurantorders?.length > 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
                      <Banner banners={banners?.banners} />
                      <View style={{ gap: 16 }}>
                        <View>{isLoggedIn && sortedRecentOrderRestaurants?.length > 0 && <>{orderLoading || isRefreshing ? <MainLoadingUI /> : <MainRestaurantCard orders={sortedRecentOrderRestaurants} loading={orderLoading} error={orderError} title={'Order it again'} queryType='orderAgain' />}</>}</View>

                        <View>{orderLoading || isRefreshing ? <MainLoadingUI /> : <MainRestaurantCard orders={sortedMostOrderedRestaurants} loading={orderLoading} error={orderError} title={t('Popular right now')} queryType='topPicks' icon='trending' />}</View>

                        <View style={{ padding: 15, gap: scale(8) }}>
                          <TextDefault bolder H4 isRTL>
                            {t('ShopTypes')}
                          </TextDefault>
                          <HorizontalFlashList
                            data={allShopTypes?.fetchAllShopTypes?.data ?? []}
                            renderItem={renderShopTypeItem}
                            keyExtractor={keyExtractorRestaurant}
                            contentContainerStyle={{
                              flexGrow: 1,
                              paddingBottom: 5
                            }}
                            inverted={currentTheme?.isRTL ? true : false}
                            estimatedItemSize={120}
                            itemSpacing={8}
                          />
                        </View                                         >

                        <View style={{ padding: 15, gap: scale(8) }}>
                          <TextDefault bolder H4 isRTL>
                            {t('I feel like eating...')}
                          </TextDefault>
                          <HorizontalFlashList
                            data={restaurantCuisines ?? []}
                            renderItem={renderRestaurantCuisineItem}
                            keyExtractor={keyExtractorRestaurant}
                            contentContainerStyle={{
                              flexGrow: 1,
                              paddingBottom: 5
                            }}
                            inverted={currentTheme?.isRTL ? true : false}
                            estimatedItemSize={140}
                            itemSpacing={8}
                          />
                        </View>
                        <View>{loading || isRefreshing ? <MainLoadingUI /> : <MainRestaurantCard shopType='restaurant' orders={sortedRestaurantOrders} loading={orderLoading} error={orderError} title={t('Restaurants near you')} queryType='restaurant' icon='restaurant' />}</View>
                        <View style={{ padding: 15, gap: scale(8) }}>
                          <TextDefault bolder H4 isRTL>
                            {t('Fresh finds await...')}
                          </TextDefault>
                          <HorizontalFlashList
                            data={groceryCuisines ?? []}
                            renderItem={renderGroceryCuisineItem}
                            keyExtractor={keyExtractorGrocery}
                            contentContainerStyle={{
                              flexGrow: 1,
                              paddingBottom: 5
                            }}
                            inverted={currentTheme?.isRTL ? true : false}
                            estimatedItemSize={140}
                            itemSpacing={8}
                          />
                        </View>
                        {/* <View>{loading ? <MainLoadingUI /> : <MainRestaurantCard shopType='grocery' orders={sortRestaurantsByOpenStatus(nearByGroceryStores || [])} loading={nearByGroceryStoresLoading} error={nearByGroceryStoresError} title={t('Grocery List')} queryType='grocery' icon='grocery' selectedType='grocery' />}</View> */}

                        <View>{orderLoading ? <MainLoadingUI /> : <MainRestaurantCard shopType='grocery' orders={sortedMostOrderedGrocery} loading={mostOrderedGroceryLoading} error={mostOrderedGroceryError} title={t('Top grocery picks')} queryType='topPicks' icon='store' selectedType='grocery' />}</View>
                      </View>
                      <View style={styles(currentTheme, hasActiveOrders).topBrandsMargin}>{orderLoading ? <TopBrandsLoadingUI /> : <TopBrands />}</View>
                    </ScrollView>
                  ) : !location ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                      <Spinner backColor='transparent' />
                    </View>
                  ) : (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                      <TextDefault bold H4 style={{ textAlign: 'center', marginBottom: 4 }}>
                        {t('We are currently not available in your location.')}
                      </TextDefault>
                      <TextDefault style={{ textAlign: 'center', marginBottom: 10 }}>{t('Please check back later or try a different location.')}</TextDefault>

                    

                      <TouchableOpacity activeOpacity={0.7} onPress={() => setCitiesModalVisible(true)} style={[styles(currentTheme).button, { opacity: 1 }]}>
                        <TextDefault textColor={currentTheme.color4} style={{ paddingHorizontal: 10 }} bold H7>
                          {t('Select different location')}
                        </TextDefault>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <ForceUpdate />
              </View>
            </View>
            <ActiveOrders onActiveOrdersChange={handleActiveOrdersChange} />

            <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
            <ModalDropdown theme={currentTheme} visible={citiesModalVisible} onItemPress={handleMarkerPress} onClose={() => setCitiesModalVisible(false)} />
          </View>
        </SafeAreaView>
      )}
    </>
  )
}

export default Main
