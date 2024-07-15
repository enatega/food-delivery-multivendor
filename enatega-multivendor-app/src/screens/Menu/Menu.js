/* eslint-disable react/display-name */
import React, {
  useRef,
  useContext,
  useLayoutEffect,
  useState,
  useEffect
} from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  RefreshControl
} from 'react-native'
import {
  MaterialIcons,
  SimpleLineIcons,
  AntDesign,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'
import {
  useCollapsibleSubHeader,
  CollapsibleSubHeaderAnimator
} from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import gql from 'graphql-tag'
import { useLocation } from '../../ui/hooks'
import Search from '../../components/Main/Search/Search'
import Item from '../../components/Main/Item/Item'
import UserContext from '../../context/User'
import { getCuisines, restaurantListPreview } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import styles from './styles'
import TextError from '../../components/Text/TextError/TextError'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from '../Main/navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import { alignment } from '../../utils/alignment'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import Filters from '../../components/Filter/FilterSlider'
import { FILTER_TYPE } from '../../utils/enums'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomApartmentIcon from '../../assets/SVG/imageComponents/CustomApartmentIcon'
import ErrorView from '../../components/ErrorView/ErrorView'
import Spinner from '../../components/Spinner/Spinner'
import MainModalize from '../../components/Main/Modalize/MainModalize'

import { escapeRegExp } from '../../utils/regex'

const RESTAURANTS = gql`
  ${restaurantListPreview}
`
const SELECT_ADDRESS = gql`
  ${selectAddress}
`

const GET_CUISINES = gql`
  ${getCuisines}
`

export const FILTER_VALUES = {
  Sort: {
    type: FILTER_TYPE.RADIO,
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

function Menu({ route, props }) {
  const Analytics = analytics()
  const { selectedType } = route.params
  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(FILTER_VALUES)
  const [restaurantData, setRestaurantData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation } = useLocation()
  const locationData = location

  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANTS,
    {
      variables: {
        longitude: location.longitude || null,
        latitude: location.latitude || null,
        shopType: selectedType || null,
        ip: null
      },
      onCompleted: data => {
        setRestaurantData(data.nearByRestaurantsPreview.restaurants)
        setSectionData(data.nearByRestaurantsPreview.sections)
      },
      fetchPolicy: 'network-only'
    }
  )
  const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
    onError
  })

  const { data: allCuisines } = useQuery(GET_CUISINES)

  const newheaderColor = currentTheme.newheaderColor

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
    translateY
  } = useCollapsibleSubHeader()

  const searchPlaceholderText =
    selectedType === 'restaurant' ? t('searchRestaurant') : t('searchGrocery')
  const menuPageHeading =
    selectedType === 'restaurant' ? t('allRestaurant') : t('allGrocery')
  const emptyViewDesc =
    selectedType === 'restaurant' ? t('noRestaurant') : t('noGrocery')

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
        headerMenuBackground: currentTheme.main,
        horizontalLine: currentTheme.headerColor,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.black,
        open: onOpen,
        icon: 'back'
      })
    )
  }, [navigation, currentTheme])

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      Cuisines: {
        selected: [],
        type: FILTER_TYPE.CHECKBOX,
        values: allCuisines?.cuisines?.map(item => item.name)
      }
    }))
  }, [allCuisines])

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

  const setAddressLocation = async address => {
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
    setBusy(true)
    const { error, coords } = await getCurrentLocation()

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log('Reverse geocoding request failed:', data.error)
        } else {
          let address = data.display_name
          if (address.length > 21) {
            address = address.substring(0, 21) + '...'
          }

          if (error) navigation.navigate('SelectLocation')
          else {
            modalRef.current.close()
            setLocation({
              label: 'currentLocation',
              latitude: coords.latitude,
              longitude: coords.longitude,
              deliveryAddress: address
            })
            setBusy(false)
          }
          console.log(address)
        }
      })
      .catch(error => {
        console.error('Error fetching reverse geocoding data:', error)
      })
  }

  const modalHeader = () => (
    <View style={[styles().addNewAddressbtn]}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          style={[styles(currentTheme).addButton]}
          activeOpacity={0.7}
          onPress={setCurrentLocation}
          disabled={busy}
        >
          <View style={styles().addressSubContainer}>
            {
              busy ? <Spinner size='small' /> : (
                <>
                  <SimpleLineIcons name="target" size={scale(18)} color={currentTheme.black} />
                  <View style={styles().mL5p} />
                  <TextDefault bold>{t('currentLocation')}</TextDefault>
                </>
              )
            }
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
              {t('notAvailableinYourArea')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} center>
              {emptyViewDesc}
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
          }}>
          <View style={styles().addressSubContainer}>
            <AntDesign
              name="pluscircleo"
              size={scale(20)}
              color={currentTheme.black}
            />
            <View style={styles().mL5p} />
            <TextDefault bold>{t('addAddress')}</TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )

  function loadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <View style={styles(currentTheme).searchbar}>
          <Search
            search={''}
            setSearch={() => { }}
            newheaderColor={newheaderColor}
            placeHolder={searchPlaceholderText}
          />
        </View>

        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  if (error) return <ErrorView />

  if (loading || mutationLoading || loadingOrders) return loadingScreen()

  const searchRestaurants = searchText => {
    const data = []
    const escapedSearchText = escapeRegExp(searchText);
    const regex = new RegExp(escapedSearchText, 'i');
    restaurantData?.forEach(restaurant => {
      const resultCatFoods = restaurant.keywords.some(keyword => {
        const result = keyword.search(regex)
        return result > -1
      })
      if (resultCatFoods)
        data.push(restaurant)
    })
    return data
  }

  // Flatten the array. That is important for data sequence
  const restaurantSections = sectionData?.map(sec => ({
    ...sec,
    restaurants: sec?.restaurants
      ?.map(id => restaurantData?.filter(res => res._id === id))
      .flat()
  }))

  const extractRating = ratingString => parseInt(ratingString)

  const applyFilters = () => {
    let filteredData = [...data.nearByRestaurantsPreview.restaurants]

    const ratings = filters.Rating
    const sort = filters.Sort
    const offers = filters.Offers
    const cuisines = filters.Cuisines

    // Apply filters incrementally
    // Ratings filter
    if (ratings?.selected?.length > 0) {
      const numericRatings = ratings.selected?.map(extractRating)
      filteredData = filteredData.filter(
        item => item?.reviewData?.ratings >= Math.min(...numericRatings)
      )
    }

    // Sort filter
    if (sort?.selected?.length > 0) {
      if (sort.selected[0] === 'Fast Delivery') {
        filteredData.sort((a, b) => a.deliveryTime - b.deliveryTime)
      } else if (sort.selected[0] === 'Distance') {
        filteredData.sort(
          (a, b) =>
            a.distanceWithCurrentLocation - b.distanceWithCurrentLocation
        )
      }
    }

    // Offers filter
    if (offers?.selected?.length > 0) {
      if (offers.selected.includes('Free Delivery')) {
        filteredData = filteredData.filter(item => item?.freeDelivery)
      }
      if (offers.selected.includes('Accept Vouchers')) {
        filteredData = filteredData.filter(item => item?.acceptVouchers)
      }
    }

    // Cuisine filter
    if (cuisines?.selected?.length > 0) {
      filteredData = filteredData.filter(item =>
        item.cuisines.some(cuisine => cuisines?.selected?.includes(cuisine))
      )
    }

    // Set filtered data
    setRestaurantData(filteredData)
  }

  return (
    <>
      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={[styles().flex, { backgroundColor: 'black' }]}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().flex}>
            <View style={styles().mainContentContainer}>
              <View style={[styles().flex, styles().subContainer]}>
                <Animated.FlatList
                  contentInset={{ top: containerPaddingTop }}
                  contentContainerStyle={{
                    paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
                  }}
                  contentOffset={{ y: -containerPaddingTop }}
                  onScroll={onScroll}
                  scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={
                    search || restaurantData.length === 0 ? null : (
                      <ActiveOrdersAndSections
                        sections={restaurantSections}
                        menuPageHeading={menuPageHeading}
                      />
                    )
                  }
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
                  data={search ? searchRestaurants(search) : restaurantData}
                  renderItem={({ item }) => <Item item={item} />}
                />
                <CollapsibleSubHeaderAnimator translateY={translateY}>
                  <View style={styles(currentTheme).searchbar}>
                    <Search
                      setSearch={setSearch}
                      search={search}
                      newheaderColor={newheaderColor}
                      placeHolder={searchPlaceholderText}
                    />
                  </View>
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    applyFilters={applyFilters}
                  />
                </CollapsibleSubHeaderAnimator>
              </View>
            </View>
          </View>

          <MainModalize
            modalRef={modalRef}
            currentTheme={currentTheme}
            isLoggedIn={isLoggedIn}
            addressIcons={addressIcons}
            modalHeader={modalHeader}
            modalFooter={modalFooter}
            setAddressLocation={setAddressLocation}
            profile={profile}
            location={location}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

export default Menu
