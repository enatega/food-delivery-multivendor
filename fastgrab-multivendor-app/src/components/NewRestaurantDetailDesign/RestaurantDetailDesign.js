import React, { useContext, useRef, useState, useEffect } from 'react'
import { View, StatusBar, Platform, Animated, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useRestaurant } from '../../ui/hooks'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import RestaurantDetailHeader from './RestaurantDetailHeader/RestaurantDetailHeader'
import RestaurantSections from './RestaurantSection/RestaurantSection'
import { Text } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { scale } from '../../utils/scaling'
import styles from './styles'
import UserContext from '../../context/User'
import SearchOverlay from '../SearchOverlay/searchOverlay'
import { useNavigation } from '@react-navigation/native'
import TextDefault from '../Text/TextDefault/TextDefault'
import RestaurantCompactHeader from './RestaurntCompactHeader/RestaurantCompactHeader'
import RestaurantDetailSkeleton from './RestaurantDetailSkeleton'

const HEADER_MAX_HEIGHT = Platform.OS === 'ios' ? 520 : 490
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 120 : 120
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

function NewRestaurantDetailDesign(props) {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const { cartCount } = useContext(UserContext)
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)

  // Extract restaurant data from route params
  const restaurant = props?.route.params
  const restaurantId = restaurant?._id

  const scrollOffsetY = useRef(new Animated.Value(0)).current

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  // Animation for cart button
  const scaleValue = useRef(new Animated.Value(1)).current

  // Add effect to animate when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [cartCount])

  // Add search overlay state
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const { data: restaurantData, loading } = useRestaurant(restaurantId)

  // Use both route params and API data to determine if restaurant is closed
  const isRestaurantOpen =
    restaurant?.isOpen ?? restaurantData?.restaurant?.isOpen
  const isAvailable =
    restaurant?.isAvailable ?? restaurantData?.restaurant?.isAvailable

  // Calculate header animation values
  const headerHeight = scrollOffsetY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  })

  const headerOpacity = scrollOffsetY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })

  const collapsedHeaderOpacity = scrollOffsetY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  // Handler for opening search overlay
  const handleOpenSearch = () => {
    setIsSearchVisible(true)
  }

  // Handler for closing search overlay
  const handleCloseSearch = () => {
    setIsSearchVisible(false)
  }

  const handleNavigateToAbout = () => {
    navigation.navigate('About', {
      restaurantObject: { ...restaurantData?.restaurant }
    })
  }

  // Merge restaurant data from route params and API
  const mergedRestaurant = {
    ...(restaurantData?.restaurant || {}),
    ...restaurant,
    latitude: restaurantData?.restaurant
      ? restaurantData?.restaurant.location.coordinates[1]
      : '',
    longitude: restaurantData?.restaurant
      ? restaurantData?.restaurant.location.coordinates[0]
      : '',
    isOpen: isRestaurantOpen,
    isAvailable: isAvailable
  }

  // Render the skeleton loader when data is loading
  if (loading) {
    return (
      <SafeAreaView
        style={styles(currentTheme).container}
        edges={['right', 'left', 'bottom']}
      >
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent={true}
        />
        <RestaurantDetailSkeleton currentTheme={currentTheme} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={styles(currentTheme).container}
      edges={['right', 'left', 'bottom']}
    >
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent={true}
      />

      {/* Main Header */}
      <Animated.View
        style={[
          styles(currentTheme).headerContainer,
          {
            height: headerHeight,
            zIndex: 1
          }
        ]}
      >
        {/* Original Header */}
        <Animated.View
          style={{ opacity: headerOpacity }}
          pointerEvents={collapsedHeaderOpacity._value > 0.1 ? 'none' : 'auto'}
        >
          <RestaurantDetailHeader
            restaurant={mergedRestaurant}
            configuration={configuration}
            currentTheme={currentTheme}
            t={t}
            navigation={props.navigation}
            onOpenSearch={handleOpenSearch}
          />
        </Animated.View>

        {/* Collapsed Header */}
        <Animated.View
          pointerEvents={collapsedHeaderOpacity._value > 0.1 ? 'auto' : 'none'}
          style={[
            {
              opacity: collapsedHeaderOpacity,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: HEADER_MIN_HEIGHT,
              zIndex: 999
            }
          ]}
        >
          <RestaurantCompactHeader
            navigation={navigation}
            restaurantData={{ restaurant: mergedRestaurant }}
            currentTheme={currentTheme}
            handleOpenSearch={handleOpenSearch}
            handleNavigateToAbout={handleNavigateToAbout}
          />
        </Animated.View>
      </Animated.View>

      {/* Scrollable Content with Restaurant Sections */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        style={styles(currentTheme).scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles(currentTheme).contentContainer,
            { marginTop: HEADER_MAX_HEIGHT }
          ]}
        >
          <RestaurantSections
            restaurantId={restaurantId}
            configuration={configuration}
            navigation={props.navigation}
            currentTheme={currentTheme}
            restaurant={mergedRestaurant}
          />
        </View>
      </Animated.ScrollView>

      {/* Search Overlay */}
      <SearchOverlay
        isVisible={isSearchVisible}
        onClose={handleCloseSearch}
        currentTheme={currentTheme}
        configuration={configuration}
        restaurant={mergedRestaurant}
        navigation={props.navigation}
      />

      {cartCount > 0 && (
        <View style={styles(currentTheme).buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).button}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={styles().buttontLeft}>
              <Animated.View
                style={[
                  styles(currentTheme).buttonLeftCircle,
                  {
                    width: scale(18),
                    height: scale(18),
                    borderRadius: scale(9),
                    transform: [{ scale: scaleValue }]
                  }
                ]}
              >
                <Text
                  style={[
                    styles(currentTheme).buttonTextLeft,
                    { fontSize: scale(10) }
                  ]}
                >
                  {cartCount}
                </Text>
              </Animated.View>
            </View>
            <TextDefault
              style={styles().buttonText}
              textColor={currentTheme.buttonTextPink}
              uppercase
              center
              bolder
              small
            >
              {t('viewCart')}
            </TextDefault>
            <View style={styles().buttonTextRight} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

export default NewRestaurantDetailDesign
