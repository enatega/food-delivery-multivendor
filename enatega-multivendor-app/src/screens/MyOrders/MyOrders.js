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
import analytics from '../../utils/analytics'
import OrdersContext from '../../context/Orders'
import { HeaderBackButton } from '@react-navigation/elements'
import i18n from '../../../i18n'

const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
const orderStatusInactive = ['DELIVERED', 'COMPLETED']

function MyOrders(props) {
  const configuration = useContext(ConfigurationContext)
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
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  useLayoutEffect(() => {
    // props.navigation.setOptions(screenOptions(currentTheme.headerText))
    props.navigation.setOptions({
      title: i18n.t('titleCart'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleContainerStyle: {
        marginBottom: scale(10),
        paddingLeft: scale(20),
        paddingRight: scale(20),
        backgroundColor: currentTheme.black,
        borderRadius: scale(10),
        borderColor: currentTheme.white,
        borderWidth: 1,
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.headerColor,
        shadowColor: 'transparent',
        shadowRadius: 0
      },
      headerLeft: () => (
        <HeaderBackButton
          backImage={() => (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 50,
                marginLeft: 10,
                width: 55,
                alignItems: 'center'
              }}>
              <Entypo name="cross" size={30} color="black" />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation])

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
              style={{ ...alignment.MBsmall }}
              textColor={currentTheme.fontMainColor}
              bolder
              center
              H4>
              No orders yet
            </TextDefault>
            <TextDefault textColor={currentTheme.fontSecondColor} center>
              You don&#39;t have any past order yet. Try one of our awesome
              restaurants and place your first order!
            </TextDefault>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={() =>
              props.navigation.navigate({
                name: 'Main',
                merge: true
              })
            }>
            <TextDefault
              textColor={currentTheme.buttonText}
              bolder
              B700
              center
              uppercase>
              Browse RESTAURANTS IN YOUR AREA
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
        contentContainerStyle={styles().contentContainer}
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
            navigation={props.navigation}
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
              props.navigation.navigate('OrderDetail', {
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
                source={{ uri: item.restaurant.image }}
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
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: 10,
                      marginBottom: 10,
                      justifyContent: 'space-around',
                      alignItems: 'flex-end'
                    }}>
                    {!item.review && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles(currentTheme).subContainerReviewButton}
                        onPress={() =>
                          props.navigation.navigate('OrderDetail', {
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
                          Rate Order
                        </TextDefault>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles(currentTheme).subContainerButton}
                      onPress={() =>
                        props.navigation.navigate('Reorder', { item })
                      }>
                      <TextDefault
                        textColor={currentTheme.white}
                        smaller
                        bolder
                        B700
                        center
                        uppercase>
                        {' '}
                        Reorder
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
