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
import { Modalize } from 'react-native-modalize'
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { useMutation, useQuery, gql } from '@apollo/client'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { useLocation } from '../../ui/hooks'
import Search from '../../components/Main/Search/Search'
import UserContext from '../../context/User'
import { restaurantList } from '../../apollo/queries'
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
import { OrderAgain } from '../../components/Main/OrderAgain'
import { TopPicks } from '../../components/Main/TopPicks'
import { TopBrands } from '../../components/Main/TopBrands'
import Item from '../../components/Main/Item/Item'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import useHomeRestaurants from '../../ui/hooks/useRestaurantOrderInfo'
import ErrorView from '../../components/ErrorView/ErrorView'

const RESTAURANTS = gql`
  ${restaurantList}
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

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.newheaderColor)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
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
        open: onOpen
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
    Home: CustomHomeIcon,
    Work: CustomWorkIcon,
    Other: CustomOtherIcon
  }

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */
  } = useCollapsibleSubHeader()

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
          onPress={setCurrentLocation}>
          <View style={styles().addressSubContainer}>
            <MaterialCommunityIcons
              name="target"
              size={scale(25)}
              color={currentTheme.black}
            />
            <View style={styles().mL5p} />
            <TextDefault bold>{t('currentLocation')}</TextDefault>
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
          <View style={styles().emptyViewBox}>
            <TextDefault bold H4 center textColor={currentTheme.fontMainColor}>
              {t('notAvailableinYourArea')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} center>
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
                locationData
              })
            } else {
              const modal = modalRef.current
              modal?.close()
              props.navigation.navigate({
                name: 'CreateAccount'
              })
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

  function brandsLoadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).brandsPlaceHolderContainer}>
          <PlaceholderLine style={styles().height80} />
        </Placeholder>
      </View>
    )
  }

  const restaurants = data?.nearByRestaurants?.restaurants

  const searchAllShops = searchText => {
    const data = []
    const regex = new RegExp(searchText, 'i')
    restaurants?.forEach(restaurant => {
      const resultName = restaurant.name.search(regex)
      if (resultName < 0) {
        const resultCatFoods = restaurant.categories.some(category => {
          const result = category.title.search(regex)
          if (result < 0) {
            const result = category.foods.some(food => {
              const result = food.title.search(regex)
              return result > -1
            })
            return result
          }
          return true
        })
        if (!resultCatFoods) {
          const resultOptions = restaurant.options.some(option => {
            const result = option.title.search(regex)
            return result > -1
          })
          if (!resultOptions) {
            const resultAddons = restaurant.addons.some(addon => {
              const result = addon.title.search(regex)
              return result > -1
            })
            if (!resultAddons) return
          }
        }
      }
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
                <View style={styles().searchbar}>
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
                  <ScrollView>
                    <View style={styles().mainItemsContainer}>
                      <TouchableOpacity
                        style={styles().mainItem}
                        onPress={() =>
                          navigation.navigate('Menu', {
                            selectedType: 'restaurant'
                          })
                        }>
                        <View>
                          <TextDefault
                            H4
                            bolder
                            textColor={currentTheme.fontThirdColor}
                            style={styles().ItemName}>
                            Food Delivery
                          </TextDefault>
                          <TextDefault
                            Normal
                            textColor={currentTheme.fontThirdColor}
                            style={styles().ItemDescription}>
                            Order food you love
                          </TextDefault>
                        </View>
                        <Image
                          source={require('../../assets/images/ItemsList/menu.png')}
                          style={styles().popularMenuImg}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles().mainItem}
                        onPress={() =>
                          navigation.navigate('Menu', {
                            selectedType: 'grocery'
                          })
                        }>
                        <TextDefault
                          H4
                          bolder
                          textColor={currentTheme.fontThirdColor}
                          style={styles().ItemName}>
                          Grocery
                        </TextDefault>
                        <TextDefault
                          Normal
                          textColor={currentTheme.fontThirdColor}
                          style={styles().ItemDescription}>
                          Essentials delivered fast
                        </TextDefault>
                        <Image
                          source={require('../../assets/images/ItemsList/grocery.png')}
                          style={styles().popularMenuImg}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      {orderLoading ? (
                        loadingScreen()
                      ) : (
                        <OrderAgain
                          recentOrderRestaurants={recentOrderRestaurantsVar}
                          loading={orderLoading}
                          error={orderError}
                          title={'Order it again'}
                        />
                      )}
                      <View>
                        {orderLoading ? (
                          loadingScreen()
                        ) : (
                          <TopPicks
                            mostOrderedRestaurants={mostOrderedRestaurantsVar}
                            loading={orderLoading}
                            error={orderError}
                            title={'Top Picks for you'}
                          />
                        )}
                      </View>
                    </View>
                    <View>
                      {orderLoading ? brandsLoadingScreen() : <TopBrands />}
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </View>

          <Modalize
            ref={modalRef}
            modalStyle={styles(currentTheme).modal}
            modalHeight={350}
            overlayStyle={styles(currentTheme).overlay}
            handleStyle={styles(currentTheme).handle}
            handlePosition="inside"
            openAnimationConfig={{
              timing: { duration: 400 },
              spring: { speed: 20, bounciness: 10 }
            }}
            closeAnimationConfig={{
              timing: { duration: 400 },
              spring: { speed: 20, bounciness: 10 }
            }}
            flatListProps={{
              data: isLoggedIn && profile ? profile.addresses : '',
              ListHeaderComponent: modalHeader(),
              ListFooterComponent: modalFooter(),
              showsVerticalScrollIndicator: false,
              keyExtractor: item => item._id,
              renderItem: ({ item: address }) => (
                <View style={styles().addressbtn}>
                  <TouchableOpacity
                    style={styles(currentTheme).addressContainer}
                    activeOpacity={0.7}
                    onPress={() => setAddressLocation(address)}>
                    <View style={styles().addressSubContainer}>
                      <View style={[styles(currentTheme).homeIcon]}>
                        {addressIcons[address.label] ? (
                          React.createElement(addressIcons[address.label], {
                            fill: currentTheme.darkBgFont
                          })
                        ) : (
                          <AntDesign name="question" size={20} color="black" />
                        )}
                      </View>
                      {/* <View style={styles().mL5p} /> */}
                      <View style={[styles().titleAddress]}>
                        <TextDefault
                          textColor={currentTheme.darkBgFont}
                          style={styles(currentTheme).labelStyle}>
                          {t(address.label)}
                        </TextDefault>
                      </View>
                    </View>
                    <View style={styles(currentTheme).addressTextContainer}>
                      <View style={styles(currentTheme).addressDetail}>
                        <TextDefault
                          style={{ ...alignment.PLlarge }}
                          textColor={currentTheme.fontSecondColor}
                          small>
                          {address.deliveryAddress}
                        </TextDefault>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={styles().addressTick}>
                    {address._id === location?._id &&
                      ![t('currentLocation'), t('selectedLocation')].includes(
                        location.label
                      ) && (
                        <MaterialIcons
                          name="check"
                          size={scale(25)}
                          color={currentTheme.iconColorPink}
                        />
                      )}
                  </View>
                </View>
              )
            }}></Modalize>
        </View>
      </SafeAreaView>
    </>
  )
}

export default Main
