/* eslint-disable react/display-name */
import React, { useRef, useContext, useLayoutEffect, useState, useEffect } from 'react'
import { View, TouchableOpacity, Animated, StatusBar, Platform, RefreshControl, FlatList, Image, ScrollView, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SimpleLineIcons, AntDesign } from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import gql from 'graphql-tag'
import { useLocation } from '../../ui/hooks'
import UserContext from '../../context/User'
import { getCuisines } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import { FILTER_TYPE } from '../../utils/enums'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomApartmentIcon from '../../assets/SVG/imageComponents/CustomApartmentIcon'
import ErrorView from '../../components/ErrorView/ErrorView'
import { useRestaurantQueries } from '../../ui/hooks/useRestaurantQueries'
import Spinner from '../../components/Spinner/Spinner'
import MainModalize from '../../components/Main/Modalize/MainModalize'
import { useMemo } from 'react'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import { Modalize } from 'react-native-modalize'
import Filters from '../../components/Filter/FilterSlider'
import AppliedFilters from '../../components/Filter/AppliedFilters'
import NetInfo from '@react-native-community/netinfo'
import useNetworkStatus from '../../utils/useNetworkStatus'
import { isOpen, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'
import Ripple from 'react-native-material-ripple'
import useGeocoding from '../../ui/hooks/useGeocoding'

const SELECT_ADDRESS = gql`
  ${selectAddress}
`
const GET_CUISINES = gql`
  ${getCuisines}
`

export const FILTER_VALUES = {
  Sort: {
    type: FILTER_TYPE.CHECKBOX,
    values: ['Relevance (Default)', 'Fast Delivery', 'Distance'],
    selected: []
  },
  Offers: {
    selected: [],
    type: FILTER_TYPE.CHECKBOX,
    values: ['Free Delivery', 'Accept Vouchers', 'Deal']
  },
  Rating: {
    selected: [],
    type: FILTER_TYPE.CHECKBOX,
    values: ['3+ Rating', '4+ Rating', '5 star Rating']
  }
}
const { height: HEIGHT } = Dimensions.get('window')
function Menu({ route, props }) {
  const Analytics = analytics()
  const selectedType = route.params?.selectedType
  const queryType = route.params?.queryType
  const collection = route.params?.collection
  const { t, i18n } = useTranslation()
  const { getAddress } = useGeocoding()
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [filters, setFilters] = useState(FILTER_VALUES)
  const [filterSectionApplied, setfilterSectionApplied] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(FILTER_VALUES)
  const [activeCollection, setActiveCollection] = useState()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const modalRef = useRef(null)
  const filtersModalRef = useRef()
  const flatListRef = useRef(null)
  const [itemWidth, setItemWidth] = useState(0)
  const navigation = useNavigation()
  const routeData = useRoute()
  const themeContext = useContext(ThemeContext)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log(state.isConnected)
      setIsConnected(state.isConnected)
      if (state.isConnected) {
        refetch()
        refetchCuisines()
      }
    })

    return () => unsubscribe()
  }, [])

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { getCurrentLocation } = useLocation()

  const locationData = location
  const [filterApplied, setfilterApplied] = useState(false)

  const { data, refetch, networkStatus, loading, error, restaurantData, setRestaurantData, heading, subHeading, allData } = useRestaurantQueries(queryType, location, selectedType)
  const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
    onError
  })

  const { data: allCuisines, refetch: refetchCuisines } = useQuery(GET_CUISINES)

  const { onScroll /* Event handler */, containerPaddingTop /* number */, scrollIndicatorInsetTop /* number */ } = useCollapsibleSubHeader()

  const emptyViewDesc = selectedType === 'restaurant' ? t('noRestaurant') : t('noGrocery')

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.newheaderColor)
    }
    StatusBar.setBarStyle('dark-content')
  })
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
        horizontalLine: currentTheme.headerColor,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.iconColor,
        open: onOpen,
        icon: 'back',
        haveBackBtn: routeData?.name === 'Menu',
        onPressFilter: () => filtersModalRef?.current?.open(),
        onPressMap: () =>
          navigation.navigate('MapSection', {
            location,
            restaurants: restaurantData
          }),
        onPressBack: () => navigation.goBack()
      })
    )
  }, [navigation, currentTheme, restaurantData])

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      Cuisines: {
        selected: [],
        type: FILTER_TYPE.CHECKBOX,
        values: allCuisines?.cuisines?.map((item) => item.name)
      }
    }))
  }, [allCuisines])

  useEffect(() => {
    if (collection && allData) {
      setActiveCollection(collection)
      const tempData = [...allData]
      const filteredData = tempData?.filter((item) => item?.cuisines?.includes(collection))
      setRestaurantData(filteredData)
      setfilterApplied(true)
    }
  }, [collection, route, allData])

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  function onError(error) {
    console.log(error)
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

  const cus = new Set()
  const filterCusinies = () => {
    if (restaurantData) {
      for (let cui of restaurantData) {
        if (cui.cuisine) {
          for (let cuisine of cui.cuisines) {
            cus.add(cuisine)
          }
        }
      }
      let allfilter = allCuisines?.cuisines?.filter((cuisine) => {
        return cus.has(cuisine.name)
      })
      return allfilter
    }
  }

  // const collectionData = useMemo(() => {
  //   if (routeData?.name === 'Restaurants') {
  //     return allCuisines?.cuisines?.filter(
  //       (cuisine) => cuisine?.shopType === 'Restaurant'
  //     )
  //   } else if (routeData?.name === 'Store') {
  //     let rtc= allCuisines?.cuisines?.filter(
  //       (cuisine) => cuisine?.shopType === 'Grocery'
  //     )
  //     console.log(rtc)
  //     return rtc
  //   } else {
  //     return filterCusinies() ?? []
  //   }
  // }, [routeData, allCuisines])

  const collectionData = useMemo(() => {
    if (routeData?.name === 'Restaurants' || routeData?.params?.shopType == 'restaurant') {
      return allCuisines?.cuisines?.filter((cuisine) => cuisine?.shopType === 'Restaurant')
    } else if (routeData?.name === 'Store' || routeData?.params?.shopType == 'grocery') {
      return allCuisines?.cuisines?.filter((cuisine) => cuisine?.shopType === 'Grocery')
    } else {
      return allCuisines?.cuisines
    }
  }, [routeData, allCuisines])

  const setCurrentLocation = async () => {
    setBusy(true)

    const { error, coords } = await getCurrentLocation()

    if (!coords || !coords.latitude || !coords.longitude) {
      console.error('Invalid coordinates:', coords)
      setBusy(false)
      return
    }
    // Get the address function from the hook

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
  // const setCurrentLocation = async () => {
  //   setBusy(true)
  //   const { error, coords } = await getCurrentLocation()

  //   const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.error) {
  //         console.log('Reverse geocoding request failed:', data.error)
  //       } else {
  //         let address = data.display_name
  //         if (address.length > 21) {
  //           address = address.substring(0, 21) + '...'
  //         }

  //         if (error) navigation.navigate('SelectLocation')
  //         else {
  //           modalRef.current.close()
  //           setLocation({
  //             label: 'currentLocation',
  //             latitude: coords.latitude,
  //             longitude: coords.longitude,
  //             deliveryAddress: address
  //           })
  //           setBusy(false)
  //         }
  //         console.log(address)
  //       }
  //     })
  //     .catch((error) => {
  //       // console.error('Error fetching reverse geocoding data:', error)
  //     })
  // }

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

  const emptyView = () => {
    if (loading || mutationLoading || loadingOrders) return loadingScreen()
    else {
      return (
        <View style={styles().emptyViewContainer}>
          <View style={styles(currentTheme).emptyViewBox}>
            <TextDefault bold H4 center textColor={currentTheme.fontMainColor}>
              {!filterApplied ? t('notAvailableinYourArea') : t('noMatchingResults')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} center>
              {!filterApplied ? emptyViewDesc : t('noMatchingResultsDesc')}
            </TextDefault>
          </View>
        </View>
      )
    }
  }

  const modalFooter = () => (
    <View style={styles().addNewAddressbtn}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles(currentTheme).addButton}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('AddNewAddress', { ...locationData })
            } else {
              const modal = modalRef.current
              modal?.close()
              navigation.navigate({ name: 'CreateAccount' })
            }
          }}
        >
          <View style={styles(currentTheme).addressSubContainer}>
            <AntDesign name='pluscircleo' size={scale(20)} color={currentTheme.black} />
            <View style={styles().mL5p} />
            <TextDefault bold textColor={currentTheme.black}>
              {t('addAddress')}
            </TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )

  function loadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder Animation={(props) => <Fade {...props} style={styles(currentTheme).placeHolderFadeColor} duration={600} />} style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[refetch]} />

  if (loading || mutationLoading || loadingOrders) return loadingScreen()

  // const searchRestaurants = (searchText) => {
  //   const data = []
  //   const regex = new RegExp(searchText, 'i')
  //   restaurantData?.forEach((restaurant) => {
  //     const resultCatFoods = restaurant.keywords.some((keyword) => {
  //       const result = keyword.search(regex)
  //       return result > -1
  //     })
  //     if (resultCatFoods) data.push(restaurant)
  //   })
  //   return data
  // }

  // commented sections for now
  // Flatten the array. That is important for data sequence
  // const restaurantSections = sectionData?.map((sec) => ({
  //   ...sec,
  //   restaurants: sec?.restaurants
  //     ?.map((id) => restaurantData?.filter((res) => res._id === id))
  //     .flat()
  // }))

  const extractRating = (ratingString) => parseInt(ratingString)

  // const onPressCollection = (collection) => {
  //   if (activeCollection === collection.name) {
  //     // If the same collection is clicked again, deselect it
  //     setActiveCollection(null)
  //     setRestaurantData(allData) // Reset to show all data
  //   } else {
  //     // Select the new collection
  //     setActiveCollection(collection.name)
  //     const tempData = [...allData]
  //     const filteredData = tempData?.filter((item) =>
  //       item?.cuisines?.includes(collection.name)
  //     )
  //     setRestaurantData(filteredData)
  //   }
  // }
  const onPressCollection = (collection, index) => {
    flatListRef.current.scrollToIndex({
      index: index,
      animated: true
    })
    if (activeCollection === collection.name) {
      // If the same collection is clicked again, deselect it
      setActiveCollection(null)
      setRestaurantData(allData) // Reset to show all data
      setfilterApplied(false)
    } else {
      setActiveCollection(collection.name)

      const tempData = [...allData]
      const filteredData = tempData?.filter((item) => item?.cuisines?.includes(collection.name))
      setRestaurantData(filteredData)
      setfilterApplied(true)
    }
  }

  const onItemLayout = (event) => {
    const { width } = event.nativeEvent.layout
    setItemWidth(width)
  }

  const getItemLayout = (data, index) => ({
    length: 108,
    offset: 108 * index,
    index: currentIndex
  })

  const applyFilters = () => {
    let filteredData = queryType === 'orderAgain' ? [...data?.recentOrderRestaurantsPreview] : queryType === 'topPicks' ? [...data?.mostOrderedRestaurantsPreview] : queryType === 'topBrands' ? [...data?.topRatedVendorsPreview] : [...data?.nearByRestaurantsPreview?.restaurants]

    const ratings = filters.Rating
    const sort = filters.Sort
    const offers = filters.Offers
    const cuisines = filters.Cuisines

    // Apply filters incrementally
    // Ratings filter
    if (ratings?.selected?.length > 0) {
      const numericRatings = ratings.selected?.map(extractRating)
      filteredData = filteredData.filter((item) => item?.reviewAverage >= Math.min(...numericRatings))
    }

    // Sort filter
    if (sort?.selected?.length > 0) {
      if (sort.selected[0] === 'Fast Delivery') {
        filteredData.sort((a, b) => a.deliveryTime - b.deliveryTime)
      } else if (sort.selected[0] === 'Distance') {
        filteredData.sort((a, b) => a.distanceWithCurrentLocation - b.distanceWithCurrentLocation)
      }
    }

    // Offers filter
    if (offers?.selected?.length > 0) {
      if (offers.selected.includes('Free Delivery')) {
        filteredData = filteredData.filter((item) => item?.freeDelivery)
      }
      if (offers.selected.includes('Accept Vouchers')) {
        filteredData = filteredData.filter((item) => item?.acceptVouchers)
      }
    }

    // Cuisine filter
    if (cuisines?.selected?.length > 0) {
      filteredData = filteredData.filter((item) => item.cuisines.some((cuisine) => cuisines?.selected?.includes(cuisine)))
    }

    // Set filtered data
    setRestaurantData(filteredData)
    filtersModalRef.current.close()

    // Update applied filters state
    setAppliedFilters(filters)

    // **Check if any filters are applied**
    const anyFilterSelected = ratings?.selected?.length > 0 || sort?.selected?.length > 0 || offers?.selected?.length > 0 || cuisines?.selected?.length > 0

    setfilterApplied(anyFilterSelected)
    setfilterSectionApplied(anyFilterSelected)
  }

  const resetFilters = () => {
    setFilters(appliedFilters) // Reset filters to the last applied state
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={[styles().flex, { backgroundColor: currentTheme.themeBackground }]}>
      <ScrollView style={[styles(currentTheme).container]} stickyHeaderIndices={[2]} nestedScrollEnabled={true}>
        <View style={[styles(currentTheme).header, { paddingHorizontal: 10, paddingVertical: 6 }]}>
          <View>
            <TextDefault bolder H2 isRTL>
              {t(heading ? heading : routeData?.name === 'Restaurants' ? 'Restaurants' : routeData?.name === 'Store' ? 'All Stores' : 'Restaurants')}
            </TextDefault>
            <TextDefault bold H5 isRTL>
              {t('BrowseCuisines')}
            </TextDefault>
          </View>
          <Ripple
            style={styles(currentTheme).seeAllBtn}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Collection', {
                collectionType: routeData?.name,
                data: collectionData
              })
            }}
          >
            <TextDefault H5 bolder textColor={currentTheme.main}>
              {t('SeeAll')}
            </TextDefault>
          </Ripple>
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10, paddingHorizontal: '5' }}>
          <FlatList
            ref={flatListRef}
            data={collectionData ?? []}
            renderItem={({ item, index }) => {
              setCurrentIndex(index)
              return (
                <Ripple
                  activeOpacity={0.8}
                  onPress={() => onPressCollection(item, index)}
                  style={[
                    styles(currentTheme).collectionCard,
                    activeCollection === item.name && {
                      backgroundColor: currentTheme.newButtonBackground
                    }
                  ]}
                >
                  <View style={[styles().brandImgContainer]}>
                    <View>
                      <Image source={{ uri: item?.image }} style={styles().collectionImage} resizeMode='cover' />
                    </View>
                    <TextDefault Normal bolder style={{ padding: 4 }} textColor={activeCollection === item.name ? currentTheme.main : currentTheme.gray700} isRTL>
                      {item.name}
                    </TextDefault>
                  </View>
                </Ripple>
              )
            }}
            initialScrollIndex={0}
            keyExtractor={(item) => item?._id}
            contentContainerStyle={styles().collectionContainer}
            // showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            inverted={currentTheme?.isRTL ? true : false}
            getItemLayout={getItemLayout}
          />
        </View>

        <View style={{ backgroundColor: currentTheme?.toggler }}>{restaurantData?.length === 0 ? null : <ActiveOrdersAndSections menuPageHeading={heading ? heading : routeData?.name === 'Restaurants' ? 'Restaurants' : routeData?.name === 'Store' ? 'All Stores' : 'Restaurants'} subHeading={subHeading ? subHeading : ''} />}</View>

        {filterSectionApplied && <AppliedFilters filters={appliedFilters} />}
        <Animated.FlatList
          contentInset={{ top: containerPaddingTop }}
          contentContainerStyle={{
            paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop,
            paddingBottom: HEIGHT * 0.34,
            padding: 15,
            gap: 16
          }}
          contentOffset={{ y: -containerPaddingTop }}
          onScroll={onScroll}
          scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
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
          data={sortRestaurantsByOpenStatus(restaurantData || [])}
          renderItem={({ item }) => {
            if (item && item?.image && item?._id) {
              const restaurantOpen = isOpen(item)
              return <NewRestaurantCard {...item} fullWidth isOpen={restaurantOpen} />
            }
          }}
        />
      </ScrollView>
      <MainModalize modalRef={modalRef} currentTheme={currentTheme} isLoggedIn={isLoggedIn} addressIcons={addressIcons} modalHeader={modalHeader} modalFooter={modalFooter} setAddressLocation={setAddressLocation} profile={profile} location={location} />
      <Modalize
        ref={filtersModalRef}
        modalStyle={styles(currentTheme).modal}
        adjustToContentHeight
        overlayStyle={styles(currentTheme).overlay}
        handleStyle={styles(currentTheme).handle}
        handlePosition='inside'
        openAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 20, bounciness: 10 }
        }}
        closeAnimationConfig={{
          timing: { duration: 400 },
          spring: { speed: 20, bounciness: 10 }
        }}
      >
        <Filters
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          onClose={() => {
            resetFilters() // Reset filters when modal is closed
            filtersModalRef.current.close()
          }}
        />
      </Modalize>
    </SafeAreaView>
  )
}

export default Menu
