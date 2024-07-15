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
  StatusBar,
  Platform,
  Image,
  ScrollView,
  Animated,
  RefreshControl
} from 'react-native'
import {
  MaterialIcons,
  AntDesign,
  SimpleLineIcons
} from '@expo/vector-icons'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { useLocation } from '../../ui/hooks'
import Search from '../../components/Main/Search/Search'
import UserContext from '../../context/User'
import { restaurantList, restaurantListPreview } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { alignment } from '../../utils/alignment'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import MainRestaurantCard from '../../components/Main/MainRestaurantCard/MainRestaurantCard'
import { TopBrands } from '../../components/Main/TopBrands'
import Item from '../../components/Main/Item/Item'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import useHomeRestaurants from '../../ui/hooks/useRestaurantOrderInfo'
import ErrorView from '../../components/ErrorView/ErrorView'
import ActiveOrders from '../../components/Main/ActiveOrders/ActiveOrders'
import MainLoadingUI from '../../components/Main/LoadingUI/MainLoadingUI'
import TopBrandsLoadingUI from '../../components/Main/LoadingUI/TopBrandsLoadingUI'
import Spinner from '../../components/Spinner/Spinner'
import CustomApartmentIcon from '../../assets/SVG/imageComponents/CustomApartmentIcon'
import MainModalize from '../../components/Main/Modalize/MainModalize'

import { escapeRegExp } from '../../utils/regex'

const RESTAURANTS = gql`
  ${restaurantListPreview}
`
const SELECT_ADDRESS = gql`
  ${selectAddress}
`
function Main(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [search, setSearch] = useState('')
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation } = useLocation()
  const locationData = location
  const [hasActiveOrders, setHasActiveOrders] = useState(false)
  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANTS,
    {
      variables: {
        longitude: location.longitude || null,
        latitude: location.latitude || null,
        shopType: null,
        ip: null
      },
      fetchPolicy: 'network-only'
    }
  )
  const { orderLoading, orderError, orderData } = useHomeRestaurants()
  const [selectedType, setSelectedType] = useState('restaurant')

  const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
    onError
  })
  const recentOrderRestaurantsVar = orderData?.recentOrderRestaurants
  const mostOrderedRestaurantsVar = orderData?.mostOrderedRestaurants
  const newheaderColor = currentTheme.newheaderColor

  const handleActiveOrdersChange = (activeOrdersExist) => {
    setHasActiveOrders(activeOrdersExist)
  }

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
        headerMenuBackground: currentTheme.newheaderColor,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.black,
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

  function onError(error) {
    console.log(error)
  }

  const addressIcons = {
    House: CustomHomeIcon,
    Office: CustomWorkIcon,
    Apartment: CustomApartmentIcon,
    Other: CustomOtherIcon
  }

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */
  } = useCollapsibleSubHeader()

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
    setBusy(true)
    const { error, coords } = await getCurrentLocation()

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
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
    if (loading || mutationLoading || loadingOrders) return <MainLoadingUI />
    else {
      return (
        <View style={styles(currentTheme).emptyViewContainer}>
          <View style={styles(currentTheme).emptyViewBox}>
            <TextDefault bold H4 center textColor={currentTheme.fontMainColor}>
              {t('notAvailableinYourArea')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontGrayNew} center>
              {t('noRestaurant')}
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
              navigation.navigate('AddNewAddress', {
                ...locationData
              })
            } else {
              const modal = modalRef.current
              modal?.close()
              props.navigation.navigate({
                name: 'CreateAccount'
              })
            }
          }}
        >
          <View style={styles().addressSubContainer}>
            <AntDesign
              name='pluscircleo'
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

  const restaurants = data?.nearByRestaurantsPreview?.restaurants

  const searchAllShops = (searchText) => {
    const data = []
    const escapedSearchText = escapeRegExp(searchText);
    const regex = new RegExp(escapedSearchText, 'i');
    restaurants?.forEach((restaurant) => {
      const resultCatFoods = restaurant.keywords.some((keyword) => {
        const result = keyword.search(regex)
        return result > -1
      })
      if (resultCatFoods)
        data.push(restaurant)
    })
    return data
  }

  if (error) return <ErrorView />

  return (
    <>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles().flex}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().flex}>
            <View style={styles().mainContentContainer}>
              <View style={[styles().flex, styles().subContainer]}>
                <View style={styles(currentTheme).searchbar}>
                  <Search
                    setSearch={setSearch}
                    search={search}
                    newheaderColor={newheaderColor}
                    placeHolder={t('searchRestaurant')}
                  />
                </View>
                {search ? (
                  <View style={styles().searchList}>
                    <Animated.FlatList
                      contentInset={{
                        top: containerPaddingTop
                      }}
                      contentContainerStyle={{
                        paddingTop:
                          Platform.OS === 'ios' ? 0 : containerPaddingTop
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
                      data={searchAllShops(search)}
                      renderItem={({ item }) => <Item item={item} />}
                    />
                  </View>
                ) : (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                  >
                    <View style={styles().mainItemsContainer}>
                      <TouchableOpacity
                        style={styles().mainItem}
                        onPress={() =>
                          navigation.navigate('Menu', {
                            selectedType: 'restaurant'
                          })
                        }
                      >
                        <View>
                          <TextDefault
                            H4
                            bolder
                            textColor={currentTheme.fontThirdColor}
                            style={styles().ItemName}
                          >
                            {t('foodDelivery')}
                          </TextDefault>
                          <TextDefault
                            Normal
                            textColor={currentTheme.fontThirdColor}
                            style={styles().ItemDescription}
                          >
                            {t('OrderfoodLove')}
                          </TextDefault>
                        </View>
                        <Image
                          source={require('../../assets/images/ItemsList/menu-new.png')}
                          style={styles().popularMenuImg}
                        // resizeMode='contain'
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles().mainItem}
                        onPress={() =>
                          navigation.navigate('Menu', {
                            selectedType: 'grocery'
                          })
                        }
                      >
                        <View>
                          <TextDefault
                            H4
                            bolder
                            textColor={currentTheme.fontThirdColor}
                            style={styles().ItemName}
                          >
                            {t('grocery')}
                          </TextDefault>
                          <TextDefault
                            Normal
                            textColor={currentTheme.fontThirdColor}
                            style={styles().ItemDescription}
                          >
                            {t('essentialsDeliveredFast')}
                          </TextDefault>
                        </View>
                        <Image
                          source={require('../../assets/images/ItemsList/grocery-new.png')}
                          style={styles().popularMenuImg}
                        // resizeMode='contain'
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <View>
                        {isLoggedIn &&
                          recentOrderRestaurantsVar &&
                          recentOrderRestaurantsVar.length > 0 && (
                            <>
                              {orderLoading ? (
                                <MainLoadingUI />
                              ) : (
                                <MainRestaurantCard
                                  orders={recentOrderRestaurantsVar}
                                  loading={orderLoading}
                                  error={orderError}
                                  title={'Order it again'}
                                />
                              )}
                            </>
                          )}
                      </View>
                      <View>
                        {orderLoading ? (
                          <MainLoadingUI />
                        ) : (
                          <MainRestaurantCard
                            orders={mostOrderedRestaurantsVar}
                            loading={orderLoading}
                            error={orderError}
                            title={'Top Picks for you'}
                          />
                        )}
                      </View>
                    </View>
                    <View
                      style={
                        styles(currentTheme, hasActiveOrders).topBrandsMargin
                      }
                    >
                      {orderLoading ? <TopBrandsLoadingUI /> : <TopBrands />}
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
          <ActiveOrders onActiveOrdersChange={handleActiveOrdersChange} />

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

export default Main
