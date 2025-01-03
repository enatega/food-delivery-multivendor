import React, { useContext, useEffect, useLayoutEffect } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image
} from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ActiveOrders from '../../components/MyOrders/ActiveOrders'
import Spinner from '../../components/Spinner/Spinner'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './style'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import TextError from '../../components/Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import { useFocusEffect } from '@react-navigation/native'
import SearchFood from '../../assets/SVG/imageComponents/SearchFood'
import { scale } from '../../utils/scaling'
import Analytics from '../../utils/analytics'
import OrdersContext from '../../context/Orders'
import { HeaderBackButton } from '@react-navigation/elements'
import { useTranslation } from 'react-i18next'

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
const orderStatusInactive = ['DELIVERED', 'COMPLETED']

function MyOrders(props) {
  const analytics = Analytics()

  const configuration = useContext(ConfigurationContext)
  const { t } = useTranslation()
  const {
    orders,
    loadingOrders,
    errorOrders,
    reFetchOrders,
    fetchMoreOrdersFunc,
    networkStatusOrders
  } = useContext(OrdersContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_MYORDERS)
    }
    Track()
  }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.themeBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions([currentTheme.headerText, currentTheme.darkBgFont])
    )
  }, [props?.navigation])

  const getItems = items => {
    return items
      .map(
        item =>
          `${item.quantity}x ${item.title}${
            item.variation.title ? `(${item.variation.title})` : ''
          }`
      )
      .join('\n')
  }

  function emptyView() {
    if (loadingOrders) return <Spinner visible={loadingOrders} />
    if (errorOrders) return <TextError text={errorOrders.message} />
    else {
      const hasActiveOrders =
        orders.filter(o => orderStatusActive.includes(o.orderStatus)).length > 0

      const hasPastOrders =
        orders.filter(o => orderStatusInactive.includes(o.orderStatus)).length >
        0
      if (hasActiveOrders || hasPastOrders) return null
      return (
        <View style={styles().subContainerImage}>
          <View style={styles().imageContainer}>
            <SearchFood width={scale(300)} height={scale(300)} />
          </View>
          <View style={styles().descriptionEmpty}>
            <TextDefault
              style={{ ...alignment.MBlarge }}
              textColor={currentTheme.fontMainColor}
              bolder
              center
              H2>
              {t('unReadOrders')}
            </TextDefault>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bold
              center
              H5
              style={{ ...alignment.MBxLarge }}>
              {t('dontHaveAnyOrderYet')}
            </TextDefault>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={() =>
              props?.navigation.navigate({
                name: 'Main',
                merge: true
              })
            }>
            <TextDefault
              style={{ ...alignment.Psmall }}
              textColor={currentTheme.fontMainColor}
              bolder
              B700
              center
              uppercase>
              {t('BrowseRESTAURANTS')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <>
      <FlatList
        data={
          loadingOrders || errorOrders
            ? []
            : orders.filter(o => orderStatusInactive.includes(o.orderStatus))
        }
        showsVerticalScrollIndicator={false}
        style={styles(currentTheme).container}
        contentContainerStyle={styles(currentTheme).contentContainer}
        ListEmptyComponent={emptyView()}
        ListHeaderComponent={
          <ActiveOrders
            showActiveHeader={
              orders.filter(o => orderStatusActive.includes(o.orderStatus))
                .length > 0
            }
            showPastHeader={
              orders.filter(o => orderStatusInactive.includes(o.orderStatus))
                .length > 0
            }
            navigation={props?.navigation}
            activeOrders={orders.filter(o =>
              orderStatusActive.includes(o.orderStatus)
            )}
            loading={loadingOrders}
            error={errorOrders}
          />
        }
        keyExtractor={item => item._id}
        refreshing={networkStatusOrders === 4}
        onRefresh={() => networkStatusOrders === 7 && reFetchOrders()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              props?.navigation.navigate('OrderDetail', {
                _id: item._id,
                currencySymbol: configuration.currencySymbol,
                restaurant: item.restaurant,
                user: item.user
              })
            }>
            <View style={styles(currentTheme).subContainer}>
              <Image
                style={styles(currentTheme).restaurantImage}
                resizeMode="cover"
                source={{ uri: item?.restaurant?.image }}
              />
              <View style={styles(currentTheme).textContainer}>
                <View style={styles().subContainerLeft}>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    uppercase
                    bolder
                    style={alignment.MBxSmall}>
                    {' '}
                    {item.restaurant.name}
                  </TextDefault>
                  <TextDefault
                    numberOfLines={1}
                    style={{ ...alignment.MTxSmall }}
                    textColor={currentTheme.fontSecondColor}
                    small>
                    {' '}
                    {new Date(item.createdAt).toDateString()}
                  </TextDefault>
                  <TextDefault
                    numberOfLines={1}
                    style={{ ...alignment.MTxSmall }}
                    textColor={currentTheme.fontMainColor}
                    bolder
                    small>
                    {' '}
                    {getItems(item.items)}
                  </TextDefault>
                  <View style={styles().rateOrderContainer}>
                    {!item.review && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles(currentTheme).subContainerReviewButton}
                        onPress={() =>
                          props?.navigation.navigate('OrderDetail', {
                            _id: item._id,
                            currencySymbol: configuration.currencySymbol,
                            restaurant: item.restaurant,
                            user: item.user
                          })
                        }>
                        <TextDefault
                          textColor={currentTheme.Black}
                          smaller
                          bolder
                          B700
                          center
                          uppercase>
                          {' '}
                          {t('RateOrder')}
                        </TextDefault>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles(currentTheme).subContainerButton}
                      onPress={() =>
                        props?.navigation.navigate('Reorder', { item })
                      }>
                      <TextDefault
                        textColor={currentTheme.black}
                        smaller
                        bolder
                        B700
                        center
                        uppercase>
                        {' '}
                        {t('reOrder')}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles().subContainerRight}>
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.fontMainColor}
                  small
                  right
                  bolder>
                  {' '}
                  {configuration.currencySymbol}
                  {parseFloat(item.orderAmount).toFixed(2)}
                </TextDefault>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={fetchMoreOrdersFunc}
      />
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default MyOrders
