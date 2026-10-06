/* eslint-disable react/display-name */
import React, { useRef, useContext, useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react'
import { View, SafeAreaView, TouchableOpacity, StatusBar, Platform, FlatList, RefreshControl, InteractionManager } from 'react-native'
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
import ConfigurationContext from '../../context/Configuration'
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
import { getErrorMessage, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'
import useGeocoding from '../../ui/hooks/useGeocoding'
import ForceUpdate from '../../components/Update/ForceUpdate'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ModalDropdown from '../../components/Picker/ModalDropdown'
import { useRestaurantQueries } from '../../ui/hooks/useRestaurantQueries'
import DiscoveryCategoryRail from '../../components/Main/DiscoveryCategoryRail/DiscoveryCategoryRail'
import { PrimaryButton, StateView, useMultivendorTheme } from '../../ui/designSystem'

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

// Discovery is a vertical list of independent sections. Rendering them through
// a FlatList mounts only what is near the viewport, so below-the-fold rails
// (grocery, brands) no longer block the first paint.
const SECTION_KEYS = [
  'banner',
  'activeOrders',
  'cuisines',
  'popular',
  'orderAgain',
  'shopTypes',
  'restaurants',
  'groceryCuisines',
  'groceryPicks',
  'topBrands'
]
const sectionKeyExtractor = (item) => item

function Main(props) {
  const Analytics = analytics()

  const { t, i18n } = useTranslation()
  const [busy, setBusy] = useState(false)
  const { isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const configuration = useContext(ConfigurationContext)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const isRTL = i18n.dir() === 'rtl'
  // Stable per theme/direction: a fresh object every render re-ran the header
  // layout effect and the status-bar focus effect on every state change.
  const currentTheme = useMemo(() => ({
    isRTL,
    ...theme[themeContext.ThemeValue]
  }), [isRTL, themeContext.ThemeValue])
  const { tokens } = useMultivendorTheme()
  const themedStyles = useMemo(() => styles(currentTheme), [currentTheme])
  const { getCurrentLocation } = useLocation()
  const { getAddress } = useGeocoding()
  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()

  const locationData = location
  const [citiesModalVisible, setCitiesModalVisible] = useState(false)
  // This query only gates the screen (loading / error / service availability);
  // the rails below fetch their own data. One row is enough to know the zone is
  // served, instead of downloading every nearby restaurant up front.
  const restaurantVariables = useMemo(() => ({
    longitude: location?.longitude || null,
    latitude: location?.latitude || null,
    shopType: null,
    page: 1,
    limit: 1
  }), [location?.longitude, location?.latitude])
  const {
    data,
    loading,
    error,
    refetch: refetchRestaurants
  } = useQuery(RESTAURANTS, {
    fetchPolicy: 'cache-and-network',
    // nextFetchPolicy: 'cache-first'
    variables: restaurantVariables,

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
  const { data: allCuisines, refetch: refetchCuisines } = useQuery(GET_CUISINES, {
    fetchPolicy: 'cache-and-network'
  })
  const { data: allShopTypes, refetch: refetchShopTypes } = useQuery(FETCH_ALL_SHOPTYPES, {
    fetchPolicy: 'cache-and-network'
  })
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
  const mostOrderedGroceryStores = orderData?.mostOrderedGroceryStores
  const mostOrderedGroceryLoading = orderLoading
  const mostOrderedGroceryError = orderError

  const { restaurantData: restaurantorders, loading: restaurantordersLoading, error: restaurantordersError } = useRestaurantQueries('restaurant', location, 'restaurant')

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Independent requests: refetch them in parallel rather than one by one.
    await Promise.allSettled([refetchBanners(), refetchRestaurants(), refetchCuisines(), refetchShopTypes()])
    setIsRefreshing(false)
  }, [refetchBanners, refetchRestaurants, refetchCuisines, refetchShopTypes])
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.themeBackground)
      }
      StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
    }, [currentTheme, themeContext.ThemeValue])
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
  const hasDiscoveryContent = useMemo(() => (
    (banners?.banners?.length ?? 0) > 0 ||
    (sortedRecentOrderRestaurants?.length ?? 0) > 0 ||
    (sortedMostOrderedRestaurants?.length ?? 0) > 0 ||
    (allShopTypes?.fetchAllShopTypes?.data?.length ?? 0) > 0 ||
    (restaurantCuisines?.length ?? 0) > 0 ||
    (sortedRestaurantOrders?.length ?? 0) > 0 ||
    (groceryCuisines?.length ?? 0) > 0 ||
    (sortedMostOrderedGrocery?.length ?? 0) > 0
  ), [
    banners?.banners,
    sortedRecentOrderRestaurants,
    sortedMostOrderedRestaurants,
    allShopTypes?.fetchAllShopTypes?.data,
    restaurantCuisines,
    sortedRestaurantOrders,
    groceryCuisines,
    sortedMostOrderedGrocery
  ])
  const isCustomerDemoMode = !!configuration?.enableCustomerDemoMode

  const shopTypes = allShopTypes?.fetchAllShopTypes?.data

  const openShopType = useCallback((item) => {
    navigation.navigate('Store', {
      collection: item.slug,
      selectedType: item.slug,
      isShopType: true
    })
  }, [navigation])
  const openRestaurantCuisine = useCallback((item) => {
    navigation.navigate('Restaurants', { collection: item.name })
  }, [navigation])
  const openGroceryCuisine = useCallback((item) => {
    navigation.navigate('Store', { collection: item.name })
  }, [navigation])
  const seeAllRestaurants = useCallback(() => navigation.navigate('Restaurants'), [navigation])
  const seeAllStores = useCallback(() => navigation.navigate('Store'), [navigation])

  const showOrderAgain = isLoggedIn && sortedRecentOrderRestaurants.length > 0

  const renderSection = useCallback(({ item }) => {
    switch (item) {
      case 'banner':
        return <Banner banners={banners?.banners} />
      case 'activeOrders':
        return <ActiveOrders />
      case 'cuisines':
        return <DiscoveryCategoryRail title='I feel like eating...' data={restaurantCuisines} onItemPress={openRestaurantCuisine} onSeeAll={seeAllRestaurants} />
      case 'popular':
        return (
          <MainRestaurantCard
            orders={sortedMostOrderedRestaurants}
            loading={orderLoading || isRefreshing}
            error={orderError}
            title='Popular right now'
            queryType='topPicks'
            icon='trending'
          />
        )
      case 'orderAgain':
        if (!showOrderAgain) return null
        return orderLoading || isRefreshing
          ? <MainLoadingUI />
          : <MainRestaurantCard orders={sortedRecentOrderRestaurants} loading={orderLoading} error={orderError} title='Order it again' queryType='orderAgain' icon='history' />
      case 'shopTypes':
        return <DiscoveryCategoryRail title='ShopTypes' data={shopTypes} onItemPress={openShopType} />
      case 'restaurants':
        return loading || isRefreshing
          ? <MainLoadingUI />
          : <MainRestaurantCard shopType='restaurant' orders={sortedRestaurantOrders} loading={orderLoading} error={orderError} title='Restaurants near you' queryType='restaurant' icon='restaurant' />
      case 'groceryCuisines':
        return <DiscoveryCategoryRail title='Fresh finds await...' data={groceryCuisines} onItemPress={openGroceryCuisine} onSeeAll={seeAllStores} />
      case 'groceryPicks':
        return orderLoading
          ? <MainLoadingUI />
          : <MainRestaurantCard shopType='grocery' orders={sortedMostOrderedGrocery} loading={mostOrderedGroceryLoading} error={mostOrderedGroceryError} title='Top grocery picks' queryType='topPicks' icon='store' selectedType='grocery' />
      case 'topBrands':
        return <View style={themedStyles.topBrandsMargin}>{orderLoading ? <TopBrandsLoadingUI /> : <TopBrands />}</View>
      default:
        return null
    }
  }, [
    banners?.banners,
    restaurantCuisines,
    groceryCuisines,
    shopTypes,
    sortedMostOrderedRestaurants,
    sortedRecentOrderRestaurants,
    sortedRestaurantOrders,
    sortedMostOrderedGrocery,
    showOrderAgain,
    orderLoading,
    orderError,
    mostOrderedGroceryLoading,
    mostOrderedGroceryError,
    loading,
    isRefreshing,
    themedStyles,
    openRestaurantCuisine,
    openShopType,
    openGroceryCuisine,
    seeAllRestaurants,
    seeAllStores
  ])

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={tokens.colors.accentForeground} colors={[tokens.colors.accentForeground]} />,
    [isRefreshing, handleRefresh, tokens]
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
          <View style={[styles().flex, themedStyles.screenBackground]}>
            <View style={styles().flex}>
              <View style={styles().mainContentContainer}>
                <View style={[styles().flex, styles().subContainer]}>
                  {loading || isAutoRetrying || restaurantordersLoading || orderLoading || hasDiscoveryContent ? (
                    <FlatList
                      data={SECTION_KEYS}
                      keyExtractor={sectionKeyExtractor}
                      renderItem={renderSection}
                      extraData={renderSection}
                      contentContainerStyle={themedStyles.discoveryContent}
                      showsVerticalScrollIndicator={false}
                      initialNumToRender={4}
                      maxToRenderPerBatch={2}
                      windowSize={7}
                      refreshControl={refreshControl}
                    />
                  ) : !location ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                      <Spinner backColor='transparent' />
                    </View>
                  ) : (
                    <StateView
                      title={isCustomerDemoMode
                        ? t('No restaurants are available for the selected demo zone right now.')
                        : t('We are currently not available in your location.')}
                      description={isCustomerDemoMode
                        ? t('Please verify the configured demo zone contains active restaurants.')
                        : t('Please check back later or try a different location.')}
                      action={<PrimaryButton label={t('Select different location')} onPress={() => setCitiesModalVisible(true)} />}
                    />
                  )}
                </View>
                <ForceUpdate />
              </View>
            </View>
            <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
            <ModalDropdown theme={currentTheme} visible={citiesModalVisible} onItemPress={handleMarkerPress} onClose={() => setCitiesModalVisible(false)} />
          </View>
        </SafeAreaView>
      )}
    </>
  )
}

export default Main
