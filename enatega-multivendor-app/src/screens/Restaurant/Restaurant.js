import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Alert, StatusBar, Platform, Image, Dimensions, SectionList } from 'react-native'
import Animated, { Extrapolation, interpolate, useSharedValue, Easing as EasingNode, withTiming, withRepeat, useAnimatedStyle, useAnimatedScrollHandler } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Placeholder, PlaceholderMedia, PlaceholderLine, Fade } from 'rn-placeholder'
import ImageHeader from '../../components/Restaurant/ImageHeader'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import { useRestaurant } from '../../ui/hooks'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import { DAYS } from '../../utils/enums'
import { alignment } from '../../utils/alignment'
import TextError from '../../components/Text/TextError/TextError'
import { MaterialIcons } from '@expo/vector-icons'
import analytics from '../../utils/analytics'
import { gql, useApolloClient, useQuery } from '@apollo/client'
import { popularItems, food } from '../../apollo/queries'

import { useTranslation } from 'react-i18next'
import ItemCard from '../../components/ItemCards/ItemCards'
import { ScrollView } from 'react-native-gesture-handler'
import { IMAGE_LINK } from '../../utils/constants'
import PopularIcon from '../../assets/SVG/popular'

import { escapeRegExp } from '../../utils/regex'
import { isOpen } from '../../utils/customFunctions'

const { height } = Dimensions.get('screen')

// Animated Section List component
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT = Platform.OS === 'android' ? height * 0.65 : height * 0.61
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
const HALF_HEADER_SCROLL = HEADER_MAX_HEIGHT - TOP_BAR_HEIGHT

const POPULAR_ITEMS = gql`
  ${popularItems}
`
const FOOD = gql`
  ${food}
`

// const concat = (...args) => args.join('')
function Restaurant(props) {
  const { _id: restaurantId } = props.route.params
  const Analytics = analytics()
  const { t, i18n } = useTranslation()
  const scrollRef = useRef(null)
  const flatListRef = useRef(null)
  const navigation = useNavigation()
  const route = useRoute()
  const propsData = route.params
  const animation = useSharedValue(0)
  const translationY = useSharedValue(0)
  const circle = useSharedValue(0)
  const themeContext = useContext(ThemeContext)

  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const configuration = useContext(ConfigurationContext)
  const [selectedLabel, selectedLabelSetter] = useState(0)
  const [buttonClicked, buttonClickedSetter] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const { restaurant: restaurantCart, setCartRestaurant, cartCount, addCartItem, addQuantity, clearCart, checkItemCart } = useContext(UserContext)
  const { data, refetch, networkStatus, loading, error } = useRestaurant(propsData._id)

  const client = useApolloClient()
  const { data: popularItems } = useQuery(POPULAR_ITEMS, {
    variables: { restaurantId }
  })

  const fetchFoodDetails = (itemId) => {
    return client.readFragment({ id: `Food:${itemId}`, fragment: FOOD })
  }

  const dataList =
    popularItems &&
    popularItems?.popularItems?.map((item) => {
      const foodDetails = fetchFoodDetails(item?.id)
      return foodDetails
    })

  const searchHandler = () => {
    setSearchOpen(!searchOpen)
    setShowSearchResults(!showSearchResults)
  }

  const searchPopupHandler = () => {
    setSearchOpen(!searchOpen)
    setSearch('')
    translationY.value = 0
  }

  useEffect(() => {
    if (search === '') {
      // setFilterData([])
      const filteredData = []
      deals?.forEach((category) => {
        category.data.forEach((deals) => {
          filteredData.push(deals)
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(false)
    } else if (deals) {
      const escapedSearchText = escapeRegExp(search)
      const regex = new RegExp(escapedSearchText, 'i')
      const filteredData = []
      deals.forEach((category) => {
        category.data.forEach((deals) => {
          const title = deals.title.search(regex)
          if (title < 0) {
            const description = deals.description.search(regex)
            if (description > 0) {
              filteredData.push(deals)
            }
          } else {
            filteredData.push(deals)
          }
        })
      })
      setFilterData(filteredData)
      setShowSearchResults(true)
    }
  }, [search, searchOpen])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS)
    }
    Track()
  }, [])
  useEffect(() => {
    if (data && data?.restaurant && (!data?.restaurant?.isAvailable || !isOpen(data?.restaurant))) {
      Alert.alert(
        '',
        t('Restaurant Closed at the moment'),
        [
          {
            text: t('Go back to restaurants'),
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: t('See Menu'),
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
    }
  }, [data])

  // Fixed zIndexAnimation with integer values
  const zIndexAnimation = useAnimatedStyle(() => {
    const zIndex = interpolate(translationY.value, [0, TOP_BAR_HEIGHT, SCROLL_RANGE / 2], [-1, 1, 99], Extrapolation.CLAMP)
    return {
      zIndex: Math.round(zIndex) // Ensure integer values
    }
  })

  const onPressItem = async (food) => {
    if (!data?.restaurant?.isAvailable || !isOpen(data?.restaurant)) {
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('backToRestaurants'),
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
      return
    }
    if (!restaurantCart || food.restaurant === restaurantCart) {
      await addToCart(food, food.restaurant !== restaurantCart)
    } else if (food.restaurant !== restaurantCart) {
      Alert.alert(
        '',
        t('clearCartText'),
        [
          {
            text: t('Cancel'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: t('okText'),
            onPress: async () => {
              await addToCart(food, true)
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  function wrapContentAfterWords(content, numWords) {
    const words = content.split(' ')
    const wrappedContent = []

    for (let i = 0; i < words.length; i += numWords) {
      wrappedContent.push(words.slice(i, i + numWords).join(' '))
    }

    return wrappedContent.join('\n')
  }

  // navigate every item to itemDetails screen
  const addToCart = async (food, clearFlag) => {
    if (clearFlag) await clearCart()

    navigation.navigate('ItemDetail', {
      food,
      addons: restaurant?.addons || [],
      options: restaurant?.options || [],
      restaurant: restaurant?._id
    })
  }

  function tagCart(itemId) {
    if (checkItemCart) {
      const cartValue = checkItemCart(itemId)
      if (cartValue.exist) {
        return (
          <>
            <View style={styles(currentTheme).triangleCorner} />
            <TextDefault style={styles(currentTheme).tagText} numberOfLines={1} textColor={currentTheme.fontWhite} bold small center>
              {cartValue.quantity}
            </TextDefault>
          </>
        )
      }
    }
    return null
  }

  const scaleValue = useSharedValue(1)

  const scaleStyles = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(0.1, scaleValue.value) }] // Ensure minimum scale
  }))

  // Fixed button animation with safety checks
  function animate() {
    scaleValue.value = withRepeat(withTiming(1.5, { duration: 250 }), 2, true, () => {
      // Ensure value returns to 1 after animation
      scaleValue.value = 1
    })
  }

  const config = (to) => ({
    duration: 250,
    toValue: to,
    easing: EasingNode.inOut(EasingNode.ease)
  })

  const scrollToSection = (index) => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
        viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
        viewPosition: 0
      })
    }
  }

  const onScrollEndSnapToEdge = (event) => {
    event.persist()
    const y = event.nativeEvent.contentOffset.y

    if (y > 0 && y < HALF_HEADER_SCROLL / 2) {
      if (scrollRef.current) {
        withTiming(translationY.value, config(0), (finished) => {
          if (finished) {
            scrollRef.current.scrollToLocation({
              animated: false,
              sectionIndex: 0,
              itemIndex: 0,
              viewOffset: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
              viewPosition: 0
            })
          }
        })
      }
    } else if (HALF_HEADER_SCROLL / 2 <= y && y < HALF_HEADER_SCROLL) {
      if (scrollRef.current) {
        withTiming(translationY.value, config(SCROLL_RANGE), (finished) => {
          if (finished) {
            scrollRef.current.scrollToLocation({
              animated: false,
              sectionIndex: 0,
              itemIndex: 0,
              viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
              viewPosition: 0
            })
          }
        })
      }
    }
    buttonClickedSetter(false)
  }

  // Fixed scroll handler with safety checks
  const scrollHandler = useAnimatedScrollHandler((event) => {
    const offsetY = event.contentOffset.y
    // Clamp the value to prevent extremely small or negative values
    translationY.value = Math.max(0, offsetY)
  })

  function changeIndex(index) {
    if (selectedLabel !== index) {
      selectedLabelSetter(index)
      buttonClickedSetter(true)
      scrollToSection(index)
      scrollToNavbar(index)
    }
  }
  function scrollToNavbar(value = 0) {
    if (flatListRef.current != null) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: value,
        viewPosition: 0.5
      })
    }
  }

  function onViewableItemsChanged({ viewableItems }) {
    buttonClickedSetter(false)
    if (viewableItems.length === 0) return
    if (selectedLabel !== viewableItems[0].section.index && buttonClicked === false) {
      selectedLabelSetter(viewableItems[0].section.index)
      scrollToNavbar(viewableItems[0].section.index)
    }
  }

  const iconColor = currentTheme.white
  const iconBackColor = currentTheme.white
  const iconRadius = scale(15)
  const iconSize = scale(20)
  const iconTouchHeight = scale(30)
  const iconTouchWidth = scale(30)

  // Fixed circle size - using constants instead of interpolation to prevent precision errors
  const circleSize = scale(18)
  const radiusSize = scale(9)

  // If you need animation for the circle, use transform scale instead
  const animatedCircleStyles = useAnimatedStyle(() => {
    const progress = circle.value
    const scaleValue = interpolate(progress, [0, 0.5, 1], [1, 1.33, 1], Extrapolation.CLAMP)

    return {
      transform: [{ scale: Math.max(0.1, scaleValue) }] // Ensure minimum scale
    }
  })

  // Fixed font styles with safer interpolation
  const fontStyles = useAnimatedStyle(() => {
    const fontSize = interpolate(circle.value, [0, 0.5, 1], [8, 12, 8], Extrapolation.CLAMP)
    return {
      fontSize: Math.max(8, Math.round(fontSize)) // Ensure minimum and integer font size
    }
  })

  if (loading) {
    return (
      <View style={[styles(currentTheme).flex]}>
        <ImageHeader iconColor={iconColor} iconSize={iconSize} iconBackColor={iconBackColor} iconRadius={iconRadius} iconTouchWidth={iconTouchWidth} iconTouchHeight={iconTouchHeight} restaurantName={propsData?.name ?? data?.restaurant?.name} restaurantId={propsData?._id} restaurantImage={propsData?.image ?? data?.restaurant?.image} restaurant={null} topaBarData={[]} loading={loading} minimumOrder={propsData?.minimumOrder ?? data?.restaurant?.minimumOrder} tax={propsData?.tax ?? data?.restaurant?.tax} updatedDeals={[]} searchOpen={searchOpen} showSearchResults={showSearchResults} setSearch={setSearch} search={search} searchHandler={searchHandler} searchPopupHandler={searchPopupHandler} translationY={translationY} />

        <View
          style={[
            styles(currentTheme).navbarContainer,
            styles(currentTheme).flex,
            {
              paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - TOP_BAR_HEIGHT
            }
          ]}
        >
          {Array.from(Array(10), (_, i) => (
            <Placeholder
              key={i}
              Animation={(props) => <Fade {...props} style={{ backgroundColor: currentTheme.gray }} duration={600} />}
              Left={PlaceholderMedia}
              style={{
                padding: 12
              }}
            >
              <PlaceholderLine width={80} />
              <PlaceholderLine width={80} />
            </Placeholder>
          ))}
        </View>
      </View>
    )
  }
  if (error) return <TextError text={JSON.stringify(error)} />
  const restaurant = data.restaurant
  const allDeals = restaurant?.categories.filter((cat) => cat?.foods?.length)
  const deals = allDeals.map((c, index) => ({
    ...c,
    data: c.foods,
    index: dataList?.length > 0 ? index + 1 : index
  }))

  const updatedDeals =
    dataList?.length > 0
      ? [
          {
            title: 'Popular',
            id: new Date().getTime(),
            data: dataList?.slice(0, 4),
            index: 0
          },
          ...deals
        ]
      : [...deals]

  return (
    <>
      <SafeAreaView style={styles(currentTheme).flex}>
        <Animated.View style={styles(currentTheme).flex}>
          <ImageHeader
            ref={flatListRef}
            iconColor={iconColor}
            iconSize={iconSize}
            iconBackColor={iconBackColor}
            iconRadius={iconRadius}
            iconTouchWidth={iconTouchWidth}
            iconTouchHeight={iconTouchHeight}
            restaurantName={propsData?.name ?? data?.restaurant?.name}
            restaurantId={propsData?._id}
            restaurantImage={propsData?.image ?? data?.restaurant?.image}
            restaurant={data?.restaurant}
            topaBarData={updatedDeals}
            changeIndex={changeIndex}
            selectedLabel={selectedLabel}
            minimumOrder={propsData?.minimumOrder ?? data?.restaurant?.minimumOrder}
            tax={propsData?.tax ?? data?.restaurant?.tax}
            updatedDeals={updatedDeals}
            searchOpen={searchOpen}
            showSearchResults={showSearchResults}
            setSearch={setSearch}
            search={search}
            searchHandler={searchHandler}
            searchPopupHandler={searchPopupHandler}
            translationY={translationY}
          />

          {showSearchResults || searchOpen ? (
            <ScrollView
              style={{
                flexGrow: 1,
                marginTop: TOP_BAR_HEIGHT,
                backgroundColor: currentTheme.themeBackground
              }}
            >
              {filterData.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={
                      // styles(currentTheme).searchDealSection
                      (styles(currentTheme).searchDealSection, { opacity: item.isOutOfStock ? 0.5 : 1 })
                    }
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.isOutOfStock) {
                        // Display an alert if the item is out of stock
                        Alert.alert('Currently Unavailable', 'Item Out of Stock')
                      } else {
                        onPressItem({
                          ...item,
                          restaurant: restaurant?._id,
                          restaurantName: restaurant?.name
                        })
                      }
                    }}
                  >
                    <View
                      style={{
                        flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: scale(10)
                      }}
                    >
                      <View style={styles(currentTheme).deal}>
                        {item?.image ? (
                          <Image
                            style={{
                              height: scale(60),
                              width: scale(60),
                              borderRadius: 30
                            }}
                            source={{ uri: item?.image }}
                          />
                        ) : null}
                        <View style={styles(currentTheme).flex}>
                          <View style={styles(currentTheme).dealDescription}>
                            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).headerText} numberOfLines={1} bolder isRTL>
                              {item?.title}
                            </TextDefault>
                            <TextDefault style={styles(currentTheme).priceText} small isRTL>
                              {wrapContentAfterWords(item?.description, 5)}
                            </TextDefault>
                            <View style={styles(currentTheme).dealPrice}>
                              <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} style={styles(currentTheme).priceText} bolder small isRTL>
                                {configuration.currencySymbol} {parseFloat(item?.variations[0].price).toFixed(2)}
                              </TextDefault>
                              {item?.variations[0]?.discounted > 0 && (
                                <TextDefault numberOfLines={1} textColor={currentTheme.fontSecondColor} style={styles(currentTheme).priceText} small lineOver isRTL>
                                  {configuration.currencySymbol} {(item?.variations[0].price + item?.variations[0].discounted).toFixed(2)}
                                </TextDefault>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles(currentTheme).addToCart}>
                        <MaterialIcons name='add' size={scale(20)} color={currentTheme.themeBackground} />
                      </View>
                    </View>
                    {/* )} */}
                    {tagCart(item?._id)}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <AnimatedSectionList
              style={[
                {
                  flexGrow: 1,
                  paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                  marginTop: HEADER_MIN_HEIGHT,
                  zIndex: -1
                }
                // zIndexAnimation
              ]}
              contentContainerStyle={{
                paddingBottom: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
              }}
              ref={scrollRef}
              sections={updatedDeals}
              scrollEventThrottle={1}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              refreshing={networkStatus === 4}
              onRefresh={() => networkStatus === 7 && refetch()}
              onViewableItemsChanged={onViewableItemsChanged}
              onMomentumScrollEnd={(event) => {
                onScrollEndSnapToEdge(event)
              }}
              onScroll={scrollHandler}
              keyExtractor={(item, index) => item + index}
              // contentContainerStyle={{ paddingBottom: 150 }}
              renderSectionHeader={({ section: { title, data } }) => {
                if (title === 'Popular') {
                  if (!dataList || dataList?.length === 0) {
                    return null // Don't render the section header if dataList is empty
                  }
                  return (
                    <View style={styles(currentTheme).restaurantItems}>
                      <View style={styles(currentTheme).popularHeading}>
                        <PopularIcon color={currentTheme.iconColorDark} />
                        <TextDefault style={styles(currentTheme).popularText} textColor={currentTheme.fontFourthColor} bolder>
                          {t(title)}
                        </TextDefault>
                      </View>
                      <TextDefault
                        textColor={currentTheme.fontFourthColor}
                        style={{
                          ...alignment.PLmedium,
                          ...alignment.PRmedium,
                          fontSize: scale(12),
                          fontWeight: '400',
                          marginTop: scale(3)
                        }}
                        isRTL
                      >
                        {t('mostOrderedNow')}
                      </TextDefault>
                      <View style={styles(currentTheme).popularItemCards}>
                        {data.map((item) => (
                          <ItemCard
                            key={item?._id}
                            item={item}
                            onPressItem={() => {
                              if (item?.isOutOfStock) {
                                // Display an alert if the item is out of stock
                                Alert.alert('Currently Unavailable', 'Item Out of Stock')
                                return
                              }

                              onPressItem({
                                ...item,
                                restaurant: restaurant?._id,
                                restaurantName: restaurant?.name
                              })
                            }}
                            restaurant={restaurant}
                            tagCart={tagCart}
                          />
                        ))}
                      </View>
                    </View>
                  )
                }
                // Render other section headers as usual
                return (
                  <View style={[styles(currentTheme).sectionHeader, { marginBottom: scale(20) }]}>
                    <TextDefault style={styles(currentTheme).sectionHeaderText} textColor={currentTheme.fontFourthColor} bolder isRTL>
                      {title}
                    </TextDefault>
                  </View>
                )
              }}
              renderItem={({ item, section }) => {
                const imageUrl = item?.image && item?.image.trim() !== '' ? item?.image : IMAGE_LINK
                if (section.title === 'Popular') {
                  if (!dataList || dataList?.length === 0) {
                    return null
                  }
                  return null
                }
                return (
                  <TouchableOpacity
                    style={
                      // styles(currentTheme).dealSection
                      [{ paddingHorizontal: scale(12) }, (styles(currentTheme).dealSection, { opacity: item.isOutOfStock ? 0.5 : 1 })]
                    }
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item?.isOutOfStock) {
                        // Display an alert if the item is out of stock
                        Alert.alert('Currently Unavailable', 'Item Out of Stock')
                      } else {
                        onPressItem({
                          ...item,
                          restaurant: restaurant?._id,
                          restaurantName: restaurant?.name
                        })
                      }
                    }}
                  >
                    <View
                      style={{
                        flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <View style={styles(currentTheme).deal}>
                        <Image
                          style={{
                            height: scale(60),
                            width: scale(60),
                            borderRadius: 30
                          }}
                          source={{ uri: imageUrl }}
                        />
                        <View style={styles(currentTheme).flex}>
                          <View style={styles(currentTheme).dealDescription}>
                            <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).headerText} numberOfLines={1} bolder isRTL>
                              {item?.title}
                            </TextDefault>
                            {item?.description && (
                              <TextDefault style={styles(currentTheme).priceText} small isRTL>
                                {wrapContentAfterWords(item?.description, 5)}
                              </TextDefault>
                            )}
                            <View style={styles(currentTheme).dealPrice}>
                              <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} style={styles(currentTheme).priceText} bolder small isRTL>
                                {configuration.currencySymbol} {parseFloat(item?.variations[0].price).toFixed(2)}
                              </TextDefault>
                              {item?.variations[0]?.discounted > 0 && (
                                <TextDefault numberOfLines={1} textColor={currentTheme.fontSecondColor} style={styles(currentTheme).priceText} small lineOver isRTL>
                                  {configuration.currencySymbol} {(item?.variations[0].price + item?.variations[0].discounted).toFixed(2)}
                                </TextDefault>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles(currentTheme).addToCart}>
                        <MaterialIcons name='add' size={scale(20)} color={currentTheme.themeBackground} />
                      </View>
                    </View>
                    {/* )} */}
                    {tagCart(item?._id)}
                  </TouchableOpacity>
                )
              }}
            />
          )}
          {/* </View> */}

          {cartCount > 0 && (
            <View style={styles(currentTheme).buttonContainer}>
              <TouchableOpacity activeOpacity={0.7} style={styles(currentTheme).button} onPress={() => navigation.navigate('Cart')}>
                <View style={styles().buttontLeft}>
                  <Animated.View
                    style={[
                      styles(currentTheme).buttonLeftCircle,
                      {
                        width: circleSize,
                        height: circleSize,
                        borderRadius: radiusSize
                      },
                      animatedCircleStyles, // Use the safer animation
                      scaleStyles
                    ]}
                  >
                    <Animated.Text style={[styles(currentTheme).buttonTextLeft, fontStyles]}>{cartCount}</Animated.Text>
                  </Animated.View>
                </View>
                <TextDefault style={styles().buttonText} textColor={currentTheme.buttonTextPink} uppercase center bolder small>
                  {t('viewCart')}
                </TextDefault>
                <View style={styles().buttonTextRight} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </>
  )
}

export default Restaurant
