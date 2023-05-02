import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  Pressable
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import ActiveOrders from '../../components/MyOrders/ActiveOrders'
import Spinner from '../../components/Spinner/Spinner'
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
import InActiveOrders from '../../components/MyOrders/InActiveOrders'
const orderStatusActive = ['PENDING', 'PICKED', 'ACCEPTED', 'ASSIGNED']
const orderStatusInactive = ['DELIVERED', 'COMPLETED']

function MyOrders(props) {
  const {
    orders,
    loadingOrders,
    errorOrders,
    reFetchOrders,
    fetchMoreOrdersFunc,
    networkStatusOrders
  } = useContext(OrdersContext)
  const [active, setActive] = useState(0)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()
  const activeOrdersLength = orders.filter(o =>
    orderStatusActive.includes(o.orderStatus)
  ).length
  const inActiveOrdersLength = orders.filter(o =>
    orderStatusInactive.includes(o.orderStatus)
  ).length

  useEffect(async() => {
    await analytics.track(analytics.events.NAVIGATE_TO_MYORDERS)
  }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  useLayoutEffect(() => {
    props.navigation.setOptions(screenOptions(currentTheme.headerText))
  }, [props.navigation])

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
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.menuBar }}>
      <View style={styles(currentTheme).topContainer}>
        <Image
          source={require('../../assets/images/my-orders.png')}
          PlaceholderContent={<ActivityIndicator />}
          style={{ resizeMode: 'contain', flex: 1, aspectRatio: 1 }}
        />
      </View>
      <View
        style={[
          styles(currentTheme).lowerContainer,
          {
            backgroundColor: currentTheme.white
          }
        ]}>
        <View style={styles(currentTheme).barContainer}>
          <Pressable
            onPress={() => setActive(0)}
            style={[
              styles(currentTheme).barContent,
              {
                backgroundColor:
                  active === 0
                    ? currentTheme.themeBackground
                    : currentTheme.tagColor
              }
            ]}>
            <TextDefault bolder style={{ color: currentTheme.fontMainColor }}>
              Active Orders
            </TextDefault>
            {active === 1 && activeOrdersLength > 0 && (
              <View style={styles(currentTheme).badge}>
                <TextDefault style={{ color: currentTheme.tagColor }}>
                  {activeOrdersLength}
                </TextDefault>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => setActive(1)}
            style={[
              styles(currentTheme).barContent,
              {
                backgroundColor:
                  active === 1
                    ? currentTheme.themeBackground
                    : currentTheme.tagColor
              }
            ]}>
            <TextDefault bolder style={{ color: currentTheme.fontMainColor }}>
              Past Orders
            </TextDefault>
            {active === 0 && activeOrdersLength > 0 && (
              <View style={styles(currentTheme).badge}>
                <TextDefault style={{ color: currentTheme.tagColor }}>
                  {inActiveOrdersLength}
                </TextDefault>
              </View>
            )}
          </Pressable>
        </View>
        {active === 0 ? (
          <FlatList
            data={
              loadingOrders || errorOrders
                ? []
                : orders.filter(o => orderStatusActive.includes(o.orderStatus))
            }
            showsVerticalScrollIndicator={false}
            style={styles(currentTheme).container}
            contentContainerStyle={styles(currentTheme).contentContainer}
            ListEmptyComponent={emptyView()}
            keyExtractor={item => item._id}
            refreshing={networkStatusOrders === 4}
            onRefresh={() => networkStatusOrders === 7 && reFetchOrders()}
            renderItem={({ item }) => (
              <ActiveOrders
                navigation={props.navigation}
                order={item}
                loading={loadingOrders}
                error={errorOrders}
              />
            )}
            onEndReached={fetchMoreOrdersFunc}
          />
        ) : (
          <FlatList
            data={
              loadingOrders || errorOrders
                ? []
                : orders.filter(o =>
                  orderStatusInactive.includes(o.orderStatus)
                )
            }
            showsVerticalScrollIndicator={false}
            style={styles(currentTheme).container}
            contentContainerStyle={styles().contentContainer}
            ListEmptyComponent={emptyView()}
            keyExtractor={item => item._id}
            refreshing={networkStatusOrders === 4}
            onRefresh={() => networkStatusOrders === 7 && reFetchOrders()}
            renderItem={({ item }) => (
              <InActiveOrders
                navigation={props.navigation}
                order={item}
                loading={loadingOrders}
                error={errorOrders}
              />
            )}
            onEndReached={fetchMoreOrdersFunc}
          />
        )}
        <View
          style={{
            paddingBottom: inset.bottom,
            backgroundColor: currentTheme.menuBar
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default MyOrders
