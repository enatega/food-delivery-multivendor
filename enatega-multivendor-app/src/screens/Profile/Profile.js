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
import { Divider, SectionHeader, useMultivendorTheme } from '../../ui/designSystem'


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
  const { tokens } = useMultivendorTheme()
  const { orders } = useContext(OrdersContext)

  const activeOrders = useMemo(() => {
    const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
    return orders.filter((o) => orderStatusActive.includes(o.orderStatus))
  }, [orders])

  const { data, loading, error, refetch } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location?.longitude || null,
      latitude: location?.latitude || null
    },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    skip: !location?.latitude || !location?.longitude
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
              textColor={tokens.colors.textPrimary}
              style={styles(tokens).greeting}
              isRTL
            >
              {`${t('Hi')}${profile?.name ? ` ${profile.name}` : ''}!`}
            </TextDefault>
            <View style={styles(currentTheme).mainContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles(tokens).activeOrderRow}
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
                      textColor={tokens.colors.textPrimary}
                      isRTL
                    >
                      {activeOrders?.length} {t('ActiveOrder')}
                    </TextDefault>
                  </View>
                </View>
              </TouchableOpacity>

              <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />

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
                    <SectionHeader
                      style={styles(tokens).flushSectionHeader}
                      title={t('YourFavourites')}
                      action={<TouchableOpacity onPress={() => navigation.navigate('Favourite')} style={styles(tokens).quietAction}>
                        <TextDefault bolder textColor={tokens.colors.accent}>{t('SeeAll')}</TextDefault>
                      </TouchableOpacity>}
                    />

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

              <View style={styles().quickLinkView}>
                <SectionHeader title={t('QuickLinks')} />

                <ButtonContainer
                  icon={'people-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('CustomerSupport')}
                  title={t('CustomerSupport')}
                  currentTheme={currentTheme}
                />
                <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                <ButtonContainer
                  icon={'help-circle-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('Help')}
                  title={t('titleFAQ')}
                  currentTheme={currentTheme}
                />
                <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
                <ButtonContainer
                  icon={'file-tray-stacked-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('MyOrders')}
                  title={t('OrderHistory')}
                  currentTheme={currentTheme}
                />
                <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
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
                    <SectionHeader style={styles(tokens).flushSectionHeader} title={t('OrderAgain')} />

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
                <SectionHeader title={t('titleSettings')} />

                <ButtonContainer
                  icon={'account-outline'}
                  iconType={'MaterialCommunityIcons'}
                  onPress={() => navigation.navigate('Account')}
                  title={t('Account')}
                  currentTheme={currentTheme}
                />
                <Divider insetStart={tokens.spacing.lg} insetEnd={tokens.spacing.lg} />
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
