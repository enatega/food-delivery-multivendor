import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo
} from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
  ScrollView
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

const RESTAURANTS = gql`
  ${FavouriteRestaurant}
`

function Profile(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [toggleView, setToggleView] = useState(true)
  const [modelVisible, setModalVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { location } = useContext(LocationContext)

  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { orders } = useContext(OrdersContext)

  const activeOrders = useMemo(() => {
    const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
    return orders.filter((o) => orderStatusActive.includes(o.orderStatus))
  }, [orders])

  const { data, loading } = useQuery(RESTAURANTS, {
    variables: {
      longitude: location.longitude || null,
      latitude: location.latitude || null
    },
    fetchPolicy: 'network-only'
  })
  const { orderLoading, orderData } = useHomeRestaurants()

  const recentOrderRestaurantsData = orderData?.recentOrderRestaurants ?? []

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
    props.navigation.setOptions({
      title: t('Hi') + " " + profile.name + "!",
      headerRight: null,
      headerLeft: null,
      headerTitleAlign: 'left',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontSize: 35,
        fontWeight: 700
      },
      headerStyle: {
        backgroundColor: currentTheme.newHeaderbg,
        elevation: 0,
        shadow: 0,
        shadowOpacity: 0
      },
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass
    })
  }, [props.navigation, showPass, toggleView])

  return (
    <>
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
            <View style={styles(currentTheme).mainContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles(currentTheme).nameView,
                  styles().flexRow,
                  styles().padding
                ]}
                onPress={() => navigation.navigate('MyOrders')}
              >
                <View>
                  <TextDefault
                    H2
                    bolder
                    textColor={currentTheme.fontThirdColor}
                  >
                    {profile?.name}
                  </TextDefault>
                  <TextDefault H5 bold textColor={currentTheme.fontThirdColor}>
                    {activeOrders?.length} {t('ActiveOrder')}
                  </TextDefault>
                </View>
                <Entypo
                  name='chevron-right'
                  size={verticalScale(20)}
                  color={currentTheme.darkBgFont}
                />
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
                      data={data?.userFavourite}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => {
                        const averageRating = item?.reviewData?.ratings
                        const numberOfReviews = item?.reviewData?.total
                        return (
                          <NewRestaurantCard
                            {...item}
                            reviewAverage={averageRating}
                            reviewCount={numberOfReviews}
                            isCategories
                          />
                        )
                      }}
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
                >
                  {t('QuickLinks')}
                </TextDefault>

                <ButtonContainer
                  icon={'people-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('Help')}
                  title={t('CustomerSupport')}
                />
                <View style={styles(currentTheme).line} />
                <ButtonContainer
                  icon={'file-tray-stacked-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('MyOrders')}
                  title={t('OrderHistory')}
                />
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
                      data={recentOrderRestaurantsData}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => {
                        return <OrderAgainCard {...item} />
                      }}
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
                >
                  {t('titleSettings')}
                </TextDefault>

                <ButtonContainer
                  icon={'account-outline'}
                  iconType={'MaterialCommunityIcons'}
                  onPress={() => navigation.navigate('Account')}
                  title={t('Account')}
                />
                <View style={styles(currentTheme).line} />
                <ButtonContainer
                  icon={'location-outline'}
                  iconType={'Ionicons'}
                  onPress={() => navigation.navigate('Addresses')}
                  title={t('myAddresses')}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Profile
