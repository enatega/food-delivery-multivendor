import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useCallback
} from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
  ScrollView,
  SafeAreaView
} from 'react-native'

import gql from 'graphql-tag'
import { scale, verticalScale } from '../../utils/scaling'
import { FavouriteRestaurant } from '../../apollo/queries'
import ChangePassword from './ChangePassword'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import analytics from '../../utils/analytics'
import { Entypo } from '@expo/vector-icons'

import { useTranslation } from 'react-i18next'
import Spinner from '../../components/Spinner/Spinner'
import { useQuery } from '@apollo/client'
import { LocationContext } from '../../context/Location'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'
import ButtonContainer from '../../components/Profile/ButtonContainer/ButtonContainer'
import OrderAgainCard from '../../components/Profile/OrderAgainCard/OrderAgainCard'
import OrdersContext from '../../context/Orders'
import useHomeRestaurants from '../../ui/hooks/useRestaurantOrderInfo'
import { I18nManager } from 'react-native'
import { isOpen, sortRestaurantsByOpenStatus } from '../../utils/customFunctions'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'


const RESTAURANTS = gql`
  ${FavouriteRestaurant}
`

function Profile(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const [toggleView, setToggleView] = useState(true)
  const [modelVisible, setModalVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { location } = useContext(LocationContext)

 

  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === "rtl", ...theme[themeContext.ThemeValue] }
  const { orders } = useContext(OrdersContext)

  const activeOrders = useMemo(() => {
    const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
    return orders.filter((o) => orderStatusActive.includes(o.orderStatus))
  }, [orders])

  const { data, loading, error, refetch } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    fetchPolicy: 'network-only',
    errorPolicy : "all"
  })
  const { orderLoading, orderData } = useHomeRestaurants()

  const recentOrderRestaurantsData = orderData?.recentOrderRestaurants ?? []

  useFocusEffect(
    useCallback(() => {
      // Only refetch if we're coming back from a screen that might have updated data
      const timeoutId = setTimeout(() => {
        refetch();
      }, 100); // Small delay to prevent immediate refetch
      
      return () => clearTimeout(timeoutId);
    }, [refetch])
  );

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_PROFILE)
    }
    Track()
  }, [])

  useLayoutEffect(() => {
    props?.navigation.setOptions({
      headerRight: null,
      headerLeft: null,
      headerTitleAlign: 'center',
      headerShown: false,
      headerTitleStyle: {
        color: currentTheme.newFontcolor
      },
      headerStyle: {
        backgroundColor: currentTheme.newHeaderbg,
        elevation: 0,
        shadowOpacity: 0
      },
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass
    })
  }, [props?.navigation, showPass, toggleView, themeContext.ThemeValue])

  const { isConnected:connect,setIsConnected :setConnect} = useNetworkStatus();
  if (!connect) return <ErrorView refetchFunctions={[refetch]} />
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: currentTheme.themeBackground }}
    >
      <ChangePassword
        modalVisible={modelVisible}
        hideModal={() => {
          setModalVisible(false)
        }}
      />
      <View style={styles(currentTheme).formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles(currentTheme).flex}
        >
          <ScrollView
            style={styles().flex}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
          >
            <TextDefault
              bolder
              style={[{ fontSize: scale(30) }, styles().padding]}
              isRTL
            >
              {t('Hi') + ' ' + profile?.name + '!'}
            </TextDefault>
            <View style={styles(currentTheme).mainContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles(currentTheme).nameView,
                  styles(currentTheme).flexRow,
                  styles().padding
                ]}
                onPress={() => navigation.navigate('MyOrders')}
              >
                <View
                  style={{
                    alignItems: 'center'
                  }}
                >
                  <View
                    style={{
                      flex: 1
                    }}
                  >
                    <TextDefault
                      H5
                      bold
                      textColor={currentTheme.fontThirdColor}
                      isRTL
                    >
                      {activeOrders?.length} {t('ActiveOrder')}
                    </TextDefault>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles(currentTheme).line} />

              {/* favourite section */}
              {loading ? (
                <Spinner
                  size={'small'}
                  backColor={currentTheme.themeBackground}
                  spinnerColor={currentTheme.main}
                />
              ) : (
                data?.userFavourite?.length >= 1 && (
                  <View style={styles().padding}>
                    <View
                      style={[
                        styles(currentTheme).flexRow,
                        styles(currentTheme).favView
                      ]}
                    >
                      <View>
                        <TextDefault
                          H2
                          bolder
                          textColor={currentTheme.fontThirdColor}
                        >
                          {t('YourFavourites')}
                        </TextDefault>
                      </View>
                      <View>
                        <TouchableOpacity
                          style={styles(currentTheme).seeAll}
                          onPress={() => navigation.navigate('Favourite')}
                        >
                          <TextDefault
                            H5
                            bolder
                            textColor={currentTheme.newButtonText}
                          >
                            {t('SeeAll')}
                          </TextDefault>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <FlatList
                      style={styles().offerScroll}
                      contentContainerStyle={{
                        flexGrow: 1,
                        ...alignment.MTsmall
                      }}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={sortRestaurantsByOpenStatus(data?.userFavourite || [])}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => {

                        
                        const averageRating = item?.reviewData?.ratings
                        const numberOfReviews = item?.reviewData?.total

                        const restaurantOpen = isOpen(item);
                        return (
                          <NewRestaurantCard
                            {...item}
                            reviewAverage={item.reviewAverage}
                            reviewCount={item.reviewCount}
                            isCategories
                            isOpen={restaurantOpen}
                            isAvailable={item.isAvailable || true}
                            
                          />
                        )
                      }}
                      inverted={currentTheme?.isRTL ? true : false}

                    />
                  </View>
                )
              )}

              <View style={[styles().quickLinkView]}>
                <TextDefault
                  H2
                  bolder
                  textColor={currentTheme.fontThirdColor}
                  style={styles().padding}
                  isRTL
                >
                  {t('QuickLinks')}
                </TextDefault>

                <ButtonContainer
                  icon={'people-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('Help')}
                  title={t('CustomerSupport')}
                  currentTheme={currentTheme}
                />
                <View style={styles(currentTheme).line} />
                <ButtonContainer
                  icon={'file-tray-stacked-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('MyOrders')}
                  title={t('OrderHistory')}
                  currentTheme={currentTheme}
                />
                <View style={styles(currentTheme).line} />
              </View>

              {/* order again */}
              {orderLoading ? (
                <Spinner
                  size={'small'}
                  backColor={currentTheme.themeBackground}
                  spinnerColor={currentTheme.main}
                />
              ) : (
                recentOrderRestaurantsData?.length >= 1 && (
                  <View style={styles().padding}>
                    <View
                      style={[
                        styles(currentTheme).flexRow,
                        styles(currentTheme).orderAgainView
                      ]}
                    >
                      <View>
                        <TextDefault
                          H2
                          bolder
                            textColor={currentTheme.fontThirdColor}
                            isRTL
                        >
                          {t('OrderAgain')}
                        </TextDefault>
                      </View>
                    </View>

                    <FlatList
                      // style={styles().offerScroll}
                      contentContainerStyle={{
                        flexGrow: 1,
                        ...alignment.MTsmall
                      }}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={sortRestaurantsByOpenStatus(recentOrderRestaurantsData || [])}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => {
                        return <OrderAgainCard {...item} />
                      }}
                      inverted={currentTheme?.isRTL ? true : false}
                    />
                  </View>
                )
              )}

              <View style={styles().settingView}>
                <TextDefault
                  H2
                  bolder
                  textColor={currentTheme.fontThirdColor}
                  style={styles().padding}
                  isRTL
                >
                  {t('titleSettings')}
                </TextDefault>

                <ButtonContainer
                  icon={'account-outline'}
                  iconType={'MaterialCommunityIcons'}
                  onPress={() => navigation.navigate('Account')}
                  title={t('Account')}
                  currentTheme={currentTheme}
                />
                <View style={styles(currentTheme).line} />
                <ButtonContainer
                  icon={'location-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('Addresses')}
                  title={t('myAddresses')}
                  currentTheme={currentTheme}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default Profile
