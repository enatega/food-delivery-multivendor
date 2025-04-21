import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Alert, StatusBar, Platform, Image, Dimensions, SectionList, Text } from 'react-native'
import Animated, { Extrapolate, interpolateNode, concat, useValue, EasingNode, timing } from 'react-native-reanimated'
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
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import analytics from '../../utils/analytics'

const { height } = Dimensions.get('screen')

import { useTranslation } from 'react-i18next'
import { ItemCard } from '../../components/ItemCards/ItemCards'

// Animated Section List component
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT = height * 0.3
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
const HALF_HEADER_SCROLL = HEADER_MAX_HEIGHT - TOP_BAR_HEIGHT
const isPopular = 'Popular'
const config = (to) => ({
  duration: 250,
  toValue: to,
  easing: EasingNode.inOut(EasingNode.ease)
})

function Restaurant(props) {
  const Analytics = analytics()

  const { t } = useTranslation()
  const scrollRef = useRef(null)
  const flatListRef = useRef(null)
  const navigation = useNavigation()
  const route = useRoute()
  const inset = useSafeAreaInsets()
  const propsData = route.params
  const animation = useValue(0)
  const circle = useValue(0)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)
  const [selectedLabel, selectedLabelSetter] = useState(0)
  const [buttonClicked, buttonClickedSetter] = useState(false)
  const { restaurant: restaurantCart, setCartRestaurant, cartCount, addCartItem, addQuantity, clearCart, checkItemCart } = useContext(UserContext)
  const { data, refetch, networkStatus, loading, error } = useRestaurant(propsData._id)

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
    if (data && data.restaurant && (!data.restaurant.isAvailable || !isOpen())) {
      Alert.alert(
        '',
        'Restaurant Closed at the moment',
        [
          {
            text: 'Go back to restaurants',
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: 'See Menu',
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
    }
  }, [data])

  const isOpen = () => {
    if (data.restaurant.openingTimes.length < 1) return false
    const date = new Date()
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const todaysTimings = data.restaurant.openingTimes.find((o) => o.day === DAYS[day])
    if (todaysTimings === undefined) return false
    const times = todaysTimings.times.filter((t) => hours >= Number(t.startTime[0]) && minutes >= Number(t.startTime[1]) && hours <= Number(t.endTime[0]) && minutes <= Number(t.endTime[1]))

    return times.length > 0
  }
  const onPressItem = async (food) => {
    if (!data.restaurant.isAvailable || !isOpen()) {
      Alert.alert(
        '',
        'Restaurant Closed at the moment',
        [
          {
            text: 'Go back to restaurants',
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: 'See Menu',
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

  const addToCart = async (food, clearFlag) => {
    if (food.variations.length === 1 && food.variations[0].addons.length === 0) {
      await setCartRestaurant(food.restaurant)
      const result = checkItemCart(food._id)
      if (result.exist) await addQuantity(result.key)
      else await addCartItem(food._id, food.variations[0]._id, 1, [], clearFlag)
      animate()
    } else {
      if (clearFlag) await clearCart()
      navigation.navigate('ItemDetail', {
        food,
        addons: restaurant.addons,
        options: restaurant.options,
        restaurant: restaurant._id
      })
    }
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

  // button animation
  function animate() {
    timing(circle, {
      toValue: 1,
      duration: 500,
      easing: EasingNode.inOut(EasingNode.ease)
    }).start()
    circle.setValue(0)
  }

  const scrollToSection = (index) => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0
        // viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
        // viewPosition: 0
      })
    }
  }

  function changeIndex(index) {
    if (selectedLabel !== index) {
      selectedLabelSetter(index)
      buttonClickedSetter(true)
      scrollToSection(index)
      scrollToNavbar(index)
    }
  }
  function scrollToNavbar(value) {
    if (flatListRef.current != null) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: value,
        viewPosition: 0.5
      })
    }
  }

  function onViewableItemsChanged({ viewableItems }) {
    if (viewableItems.length === 0) return
    if (selectedLabel !== viewableItems[0].section.index && buttonClicked === false) {
      selectedLabelSetter(viewableItems[0].section.index)
      scrollToNavbar(viewableItems[0].section.index)
    }
  }
  // const onScrollEndSnapToEdge = event => {
  //   const y = event.nativeEvent.contentOffset.y
  //   if (y > 0 && y < HALF_HEADER_SCROLL / 2) {
  //     if (scrollRef.current) {
  //       timing(animation, config(0)).start(({ finished }) => {
  //         if (finished) {
  //           scrollRef.current.scrollToLocation({
  //             animated: false,
  //             sectionIndex: 0,
  //             itemIndex: 0,
  //             viewOffset: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
  //             viewPosition: 0
  //           })
  //         }
  //       })
  //     }
  //   } else if (HALF_HEADER_SCROLL / 2 <= y && y < HALF_HEADER_SCROLL) {
  //     if (scrollRef.current) {
  //       timing(animation, config(SCROLL_RANGE)).start(({ finished }) => {
  //         if (finished) {
  //           scrollRef.current.scrollToLocation({
  //             animated: false,
  //             sectionIndex: 0,
  //             itemIndex: 0,
  //             viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
  //             viewPosition: 0
  //           })
  //         }
  //       })
  //     }
  //   }
  //   buttonClickedSetter(false)
  // }

  // Important
  const headerHeight = interpolateNode(animation, {
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: Extrapolate.CLAMP
  })

  // const opacity = interpolateNode(animation, {
  //   inputRange: [0, height * 0.05, SCROLL_RANGE / 2],
  //   outputRange: [1, 0.8, 0],
  //   extrapolate: Extrapolate.CLAMP
  // })

  const iconColor = currentTheme.iconColorPink

  const iconBackColor = currentTheme.white

  const iconRadius = scale(15)

  const iconSize = scale(20)

  const iconTouchHeight = scale(30)

  const iconTouchWidth = scale(30)

  // const headerTextFlex = concat(
  //   interpolateNode(animation, {
  //     inputRange: [0, 80, SCROLL_RANGE],
  //     outputRange: [-10, -10, 0],
  //     extrapolate: Extrapolate.CLAMP
  //   }),
  //   '%'
  // )

  const circleSize = interpolateNode(circle, {
    inputRange: [0, 0.5, 1],
    outputRange: [scale(18), scale(24), scale(18)],
    extrapolate: Extrapolate.CLAMP
  })
  const radiusSize = interpolateNode(circle, {
    inputRange: [0, 0.5, 1],
    outputRange: [scale(9), scale(12), scale(9)],
    extrapolate: Extrapolate.CLAMP
  })
  const fontChange = interpolateNode(circle, {
    inputRange: [0, 0.5, 1],
    outputRange: [scale(8), scale(12), scale(8)],
    extrapolate: Extrapolate.CLAMP
  })

  if (loading) {
    return (
      <View style={[styles().flex]}>
        <ImageHeader
          iconColor={iconColor}
          iconSize={iconSize}
          height={headerHeight}
          iconBackColor={iconBackColor}
          iconRadius={iconRadius}
          iconTouchWidth={iconTouchWidth}
          iconTouchHeight={iconTouchHeight}
          // headerTextFlex={headerTextFlex}
          restaurantName={propsData.name}
          restaurantImage={propsData.image}
          restaurant={null}
          topaBarData={[]}
          loading={loading}
        />

        <View
          style={[
            styles().navbarContainer,
            styles().flex,
            {
              paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - TOP_BAR_HEIGHT
            }
          ]}
        >
          {Array.from(Array(10), (_, i) => (
            <Placeholder
              key={i}
              Animation={(props) => <Fade {...props} style={{ backgroundColor: currentTheme.fontSecondColor }} duration={600} />}
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
  const allDeals = restaurant.categories.filter((cat) => cat.foods.length)
  const deals = allDeals.map((c, index) => ({
    ...c,
    data: c.foods,
    index
  }))

  return (
    <>
      <SafeAreaView style={styles(currentTheme).flex}>
        <View style={styles(currentTheme).flex}>
          <ImageHeader
            ref={flatListRef}
            iconColor={iconColor}
            iconSize={iconSize}
            height={headerHeight}
            iconBackColor={iconBackColor}
            iconRadius={iconRadius}
            iconTouchWidth={iconTouchWidth}
            iconTouchHeight={iconTouchHeight}
            // headerTextFlex={headerTextFlex}
            restaurantName={propsData.name}
            restaurantImage={propsData.image}
            restaurant={data.restaurant}
            topaBarData={deals}
            changeIndex={changeIndex}
            selectedLabel={selectedLabel}
          />

          <AnimatedSectionList
            ref={scrollRef}
            sections={deals}
            // Important
            // contentContainerStyle={{
            //   paddingBottom: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
            // }}
            scrollEventThrottle={1}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            refreshing={networkStatus === 4}
            onRefresh={() => networkStatus === 7 && refetch()}
            onViewableItemsChanged={onViewableItemsChanged}
            // onMomentumScrollEnd={event => {
            //   onScrollEndSnapToEdge(event)
            // }}
            // // Important
            // onScroll={Animated.event([
            //   {
            //     nativeEvent: {
            //       contentOffset: {
            //         y: animation
            //       }
            //     }
            //   }
            // ])}
            keyExtractor={(item, index) => item + index}
            // ItemSeparatorComponent={() => (
            //   <View style={styles(currentTheme).listSeperator} />
            // )}
            // SectionSeparatorComponent={props => {
            //   if (!props?.leadingItem) return null
            //   return <View style={styles(currentTheme).sectionSeparator} />
            // }}
            renderSectionHeader={({ section: { title } }) => {
              return (
                <View style={{ backgroundColor: '#fff' }}>
                  <TextDefault style={styles(currentTheme).sectionHeaderText} textColor='#111827' bolder>
                    {title}
                  </TextDefault>
                  <Text
                    style={{
                      color: '#4B5563',
                      ...alignment.PLlarge,
                      fontSize: scale(12),
                      fontWeight: '400',
                      marginTop: scale(3)
                    }}
                  >
                    Most ordered right now.
                  </Text>
                </View>
              )
            }}
            renderItem={({ item, index, section }) => (
              <TouchableOpacity
                style={styles(currentTheme).dealSection}
                activeOpacity={0.7}
                onPress={() =>
                  onPressItem({
                    ...item,
                    restaurant: restaurant._id,
                    restaurantName: restaurant.name
                  })
                }
              >
                {section.title === isPopular ? (
                  <View style={styles().popularItemCards}>
                    <ItemCard />
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <View style={styles(currentTheme).deal}>
                      {item.image ? (
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
                          <TextDefault textColor={currentTheme.fontMainColor} style={styles(currentTheme).headerText} numberOfLines={1} bolder>
                            {item.title}
                          </TextDefault>
                          <TextDefault style={styles(currentTheme).priceText} small>
                            {wrapContentAfterWords(item.description, 5)}
                          </TextDefault>
                          <View style={styles(currentTheme).dealPrice}>
                            <TextDefault numberOfLines={1} textColor={currentTheme.fontMainColor} style={styles(currentTheme).priceText} bolder small>
                              {configuration.currencySymbol} {parseFloat(item.variations[0].price).toFixed(2)}
                            </TextDefault>
                            {item.variations[0].discounted > 0 && (
                              <TextDefault numberOfLines={1} textColor={currentTheme.fontSecondColor} style={styles().priceText} small lineOver>
                                {configuration.currencySymbol} {(item.variations[0].price + item.variations[0].discounted).toFixed(2)}
                              </TextDefault>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles().addToCart}>
                      <MaterialIcons name='add' size={scale(20)} color='#fff' />
                    </View>
                  </View>
                )}
                {tagCart(item._id)}
              </TouchableOpacity>
            )}
          />
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
                      }
                    ]}
                  >
                    <Animated.Text style={[styles(currentTheme).buttonTextLeft, { fontSize: fontChange }]}>{cartCount}</Animated.Text>
                  </Animated.View>
                </View>
                <TextDefault style={styles().buttonText} textColor={currentTheme.buttonTextPink} uppercase center bolder small>
                  {t('viewCart')}
                </TextDefault>
                <View style={styles().buttonTextRight} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  )
}

export default Restaurant
