/* eslint-disable react/display-name */
import React, { useRef, useContext, useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react'
import { View, SafeAreaView, TouchableOpacity, StatusBar, Platform, ScrollView, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useLocation } from '../../ui/hooks'
import UserContext from '../../context/User'
import { getBanners, getCuisines, restaurantListPreview } from '../../apollo/queries'
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
import { sortRestaurantsByOpenStatus } from '../../utils/customFunctions'
import { IMAGE_LINK } from '../../utils/constants'
import useGeocoding from '../../ui/hooks/useGeocoding'
import ForceUpdate from '../../components/Update/ForceUpdate'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ModalDropdown from '../../components/Picker/ModalDropdown'

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

  let filteredCuisines
  const { data: banners, refetch: refetchBanners } = useQuery(GET_BANNERS, {
    fetchPolicy: 'network-only'
  })
  const { data: allCuisines } = useQuery(GET_CUISINES)

  const cus = new Set()
  const { orderLoading, orderError, orderData } = useHomeRestaurants()

  function onError(error) {
    console.log(error)
  }
  const [mutate] = useMutation(SELECT_ADDRESS, {
    onError
  })
  const recentOrderRestaurantsVar = orderData?.recentOrderRestaurants
  const mostOrderedRestaurantsVar = orderData?.mostOrderedRestaurants

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

  const setAddressLocation = async (address) => {
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    mutate({ variables: { id: address._id } })
    modalRef.current.close()
  }

  const setCurrentLocation = async () => {
    console.log('Fetching current location...')
    setBusy(true)

    const { error, coords } = await getCurrentLocation()
    console.log('getCurrentLocation result:', { error, coords })
    console.log('coords', coords)
    console.log('coords', coords.latitude)
    console.log('coords', coords.longitude)

    if (!coords || !coords.latitude || !coords.longitude) {
      console.error('Invalid coordinates:', coords)
      setBusy(false)
      return
    }

    try {
      // Fetch the address using the geocoding hook
      const { formattedAddress, city } = await getAddress(coords.latitude, coords.longitude)

      console.log('Formatted address:', formattedAddress)
      console.log('City:', city)

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

  if (error) return <ErrorView />

  const groceryorders = data?.nearByRestaurantsPreview?.restaurants?.filter((restaurant) => restaurant.shopType === 'grocery')

  const restaurantorders = data?.nearByRestaurantsPreview?.restaurants?.filter((restaurant) => restaurant.shopType === 'restaurant')

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

  const useCuisinesData = (shopType, allCuisines) => {
    const cuisinesData = useMemo(() => {
      if (!allCuisines?.cuisines) return []

      if (shopType === 'restaurant') {
        return allCuisines.cuisines.filter((cuisine) => cuisine?.shopType?.toLowerCase() === 'restaurant')
      } else if (shopType === 'grocery') {
        return allCuisines.cuisines.filter((cuisine) => cuisine?.shopType?.toLowerCase() === 'grocery')
      } else {
        return allCuisines.cuisines
      }
    }, [shopType, allCuisines])

    return cuisinesData
  }

  const restaurantCuisines = useCuisinesData('restaurant', allCuisines)
  const groceryCuisines = useCuisinesData('grocery', allCuisines)

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
                  {loading ? (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                      <ActivityIndicator size='large' color={currentTheme.spinnerColor} />
                    </View>
                  ) : restaurantorders?.length > 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
                      <Banner banners={banners?.banners} />
                      <View style={{ gap: 16 }}>
                        <View>{isLoggedIn && recentOrderRestaurantsVar && recentOrderRestaurantsVar.length > 0 && <>{orderLoading || isRefreshing ? <MainLoadingUI /> : <MainRestaurantCard orders={sortRestaurantsByOpenStatus(recentOrderRestaurantsVar || [])} loading={orderLoading} error={orderError} title={'Order it again'} queryType='orderAgain' />}</>}</View>

                        <View>{orderLoading || isRefreshing ? <MainLoadingUI /> : <MainRestaurantCard orders={sortRestaurantsByOpenStatus(mostOrderedRestaurantsVar || [])} loading={orderLoading} error={orderError} title={t('Popular right now')} queryType='topPicks' icon='trending' />}</View>
                        <View style={{ padding: 15, gap: scale(8) }}>
                          <TextDefault bolder H4 isRTL>
                            {t('I feel like eating...')}
                          </TextDefault>
                          <FlatList
                            data={restaurantCuisines ?? []}
                            renderItem={({ item }) => {
                              return (
                                <CollectionCard
                                  onPress={() => {
                                    navigation.navigate('Restaurants', {
                                      collection: item.name
                                    })
                                  }}
                                  image={item?.image ? item?.image : IMAGE_LINK}
                                  name={item.name}
                                />
                              )
                            }}
                            keyExtractor={(item, index) => item?._id || `${item?.name}-restaurant-${index}`}
                            contentContainerStyle={{
                              flexGrow: 1,
                              gap: 8,
                              paddingBottom: 5
                            }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            inverted={currentTheme?.isRTL ? true : false}
                            maintainVisibleContentPosition={{
                              minIndexForVisible: 0
                            }}
                          />
                        </View>
                        <View>{loading || isRefreshing ? <MainLoadingUI /> : <MainRestaurantCard shopType='restaurant' orders={sortRestaurantsByOpenStatus(restaurantorders || [])} loading={orderLoading} error={orderError} title={t('Restaurants near you')} queryType='restaurant' icon='restaurant' />}</View>
                        <View style={{ padding: 15, gap: scale(8) }}>
                          <TextDefault bolder H4 isRTL>
                            {t('Fresh finds await...')}
                          </TextDefault>
                          <FlatList
                            data={groceryCuisines ?? []}
                            renderItem={({ item }) => {
                              return (
                                <CollectionCard
                                  onPress={() => {
                                    navigation.navigate('Store', {
                                      collection: item.name
                                    })
                                  }}
                                  image={item?.image}
                                  name={item.name}
                                />
                              )
                            }}
                            keyExtractor={(item, index) => item?._id || `${item?.name}-grocery-${index}`}
                            contentContainerStyle={{
                              flexGrow: 1,
                              gap: 8,
                              paddingBottom: 5
                            }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            inverted={currentTheme?.isRTL ? true : false}
                          />
                        </View>
                        <View>{loading ? <MainLoadingUI /> : <MainRestaurantCard shopType='grocery' orders={sortRestaurantsByOpenStatus(groceryorders || [])} loading={orderLoading} error={orderError} title={t('Grocery List')} queryType='grocery' icon='grocery' selectedType='grocery' />}</View>

                        <View>{orderLoading ? <MainLoadingUI /> : <MainRestaurantCard shopType='grocery' orders={sortRestaurantsByOpenStatus(mostOrderedRestaurantsVar?.filter((order) => order.shopType === 'grocery') || [])} loading={orderLoading} error={orderError} title={t('Top grocery picks')} queryType='grocery' icon='store' selectedType='grocery' />}</View>
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

                      {/* <TouchableOpacity style={styles(currentTheme).buttonContainer} onPress={() => setCitiesModalVisible(true)}>
                        <TextDefault textColor={currentTheme.color4} style={styles().checkoutBtn} bold H4>
                          {t('Select Different Location')}
                        </TextDefault>
                      </TouchableOpacity> */}

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
