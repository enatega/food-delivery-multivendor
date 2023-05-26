/* eslint-disable react/display-name */
import React, { useLayoutEffect, useEffect } from 'react'
import { Modalize } from 'react-native-modalize'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  RefreshControl
} from 'react-native'
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'

import Search from '../../components/Main/Search/Search'
import Item from '../../components/Main/Item/Item'
import { scale } from '../../utils/scaling'
import styles from './styles'
import TextError from '../../components/Text/TextError/TextError'
import { useFocusEffect } from '@react-navigation/native'
import navigationOptions from './navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import { alignment } from '../../utils/alignment'

import Analytics from '../../utils/analytics'
import Categories from '../../components/Main/Categories/Categories'
import MapSection from '../../components/Main/MapSection'
import useMainScreen from './useMainScreen'
import {
  EmptyComponent,
  LoadingComponent,
  ModalFooter,
  ModalHeader
} from './Main.components'

function Main({ navigation }) {
  const {
    currentTheme,
    onOpen,
    themeContext,
    setCurrentLocation,
    busy,
    error,
    loading,
    mutationLoading,
    loadingOrders,
    data,
    isLoggedIn,
    modalRef,
    search,
    setSearch,
    networkStatus,
    refetch,
    profile,
    setAddressLocation,
    addressIcons,
    location
  } = useMainScreen()

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop
  } = useCollapsibleSubHeader()

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  useEffect(() => {
    Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        headerMenuBackground: currentTheme.headerMenuBackground,
        horizontalLine: currentTheme.horizontalLine,
        fontMainColor: currentTheme.fontMainColor,
        iconColorPink: currentTheme.iconColorPink,
        open: onOpen
      })
    )
  }, [navigation, currentTheme])

  if (error) return <TextError text={'Error menu ' + JSON.stringify(error)} />

  if (loading || mutationLoading || loadingOrders) {
    return <LoadingComponent currentTheme={currentTheme} />
  }

  const { restaurants, sections } = data.nearByRestaurants

  const searchRestaurants = searchText => {
    const data = []
    const regex = new RegExp(searchText, 'i')
    restaurants.forEach(restaurant => {
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

  // Flatten the array. That is important for data sequence
  const restaurantSections = sections.map(sec => ({
    ...sec,
    restaurants: sec.restaurants
      .map(id => restaurants.filter(res => res._id === id))
      .flat()
  }))
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <View style={styles().restaurantsContainer}>
        <Animated.FlatList
          contentInset={{ top: containerPaddingTop }}
          contentContainerStyle={{
            paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
          }}
          // style={{ marginBottom: 75 }}
          contentOffset={{ y: -containerPaddingTop }}
          onScroll={onScroll}
          scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            search ? (
              <View style={styles().aboveFilterContainer}>
                <Search setSearch={setSearch} search={search} open={onOpen} />
                <Categories />
              </View>
            ) : (
              <>
                <View>
                  <MapSection location={location} restaurants={restaurants} />
                  <View style={styles().filterContainer}>
                    <Search
                      setSearch={setSearch}
                      search={search}
                      open={onOpen}
                    />
                    <Categories />
                  </View>
                </View>
                <ActiveOrdersAndSections sections={restaurantSections} />
              </>
            )
          }
          ListEmptyComponent={<EmptyComponent currentTheme={currentTheme} />}
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
          data={search ? searchRestaurants(search) : restaurants}
          renderItem={({ item }) => <Item item={item} />}
        />
      </View>
      <Modalize
        ref={modalRef}
        modalStyle={styles(currentTheme).modal}
        modalHeight={350}
        overlayStyle={styles().overlay}
        handleStyle={styles().handle}
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
          ListHeaderComponent: (
            <ModalHeader
              currentTheme={currentTheme}
              setCurrentLocation={setCurrentLocation}
              location={location}
              busy={busy}
            />
          ),
          ListFooterComponent: (
            <ModalFooter
              currentTheme={currentTheme}
              isLoggedIn={isLoggedIn}
              navigation={navigation}
              modalRef={modalRef}
            />
          ),
          showsVerticalScrollIndicator: false,
          keyExtractor: item => item._id,
          renderItem: ({ item: address }) => (
            <View style={styles().addressbtn}>
              <TouchableOpacity
                style={styles(currentTheme).addressContainer}
                activeOpacity={0.7}
                onPress={() => setAddressLocation(address)}>
                <View style={styles().addressSubContainer}>
                  <SimpleLineIcons
                    name={addressIcons[address.label]}
                    size={scale(12)}
                    color={currentTheme.iconColorPink}
                  />
                  <View style={styles().mL5p} />
                  <TextDefault bold>{address.label}</TextDefault>
                </View>
                <View style={styles().addressTextContainer}>
                  <TextDefault
                    style={{ ...alignment.PLlarge }}
                    textColor={currentTheme.fontSecondColor}
                    small>
                    {address.deliveryAddress}
                  </TextDefault>
                </View>
              </TouchableOpacity>
              <View style={styles().addressTick}>
                {address.selected &&
                  !['Current Location', 'Selected Location'].includes(
                    location.label
                  ) && (
                  <MaterialIcons
                    name="check"
                    size={scale(15)}
                    color={currentTheme.iconColorPink}
                  />
                )}
              </View>
            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}

export default Main
