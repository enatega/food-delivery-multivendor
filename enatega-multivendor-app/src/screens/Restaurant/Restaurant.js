// Hooks
import {
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  Extrapolation,
  interpolate,
  Easing as EasingNode,
  withTiming,
} from 'react-native-reanimated'
import { useRestaurant } from '../../ui/hooks'
import { gql, useApolloClient, useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import useNetworkStatus from '../../utils/useNetworkStatus'
import PopularIcon from '../../assets/SVG/popular'
import ErrorView from '../../components/ErrorView/ErrorView'
import ItemCard from '../../components/ItemCards/ItemCards'

// React Native
import {
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  SectionList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

// Placeholder
import { PlaceholderMedia } from 'rn-placeholder'

// Contexts
import UserContext from '../../context/User'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'

// Components
import ImageHeader from '../../components/Restaurant/ImageHeader'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import TextError from '../../components/Text/TextError/TextError'
// import ItemCard from '../../components/ItemCards/ItemCards'

// Styles
import styles from './styles'

// Utils
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import analytics from '../../utils/analytics'
import { popularItems, food, GET_SUB_CATEGORIES } from '../../apollo/queries'
import { escapeRegExp } from '../../utils/regex'
import { isOpen } from '../../utils/customFunctions'

// Icons
import { MaterialIcons } from '@expo/vector-icons'
import RestaurantProductsScreenLoader from '../../components/RestaurantProductsScreenLoader'

// screen dimensions
const { height } = Dimensions.get('screen')

// Animated Section List component
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT =
  Platform.OS === 'android' ? height * 0.65 : height * 0.61
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

// Queries
const POPULAR_ITEMS = gql`
  ${popularItems}
`
const FOOD = gql`
  ${food}
`


function Restaurant(props) {
  // Params & Analytics
  const { _id: restaurantId } = props?.route.params
  const Analytics = analytics()
 
  const scrollRef = useRef(null)
  const flatListRef = useRef(null)

  // Hooks
  const client = useApolloClient()
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const propsData = route.params
  const translationY = useSharedValue(0)
  const circle = useSharedValue(0)

  // States
  const [selectedLabel, selectedLabelSetter] = useState(0)
  const [buttonClicked, buttonClickedSetter] = useState(false)
  const [relatedSubCategories, setRelatedSubCategories] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedSubCtg, setSelectedSubCtg] = useState('')
  const [selectedPrntCtg, setSelectedPrntCtg] = useState('')
  const { data, refetch, networkStatus, loading, error } = useRestaurant(
    propsData._id
  )
  // console.log("restaurantdata",data)

  // Queries
  const fetchFoodDetails = (itemId) => {
    return client.readFragment({ id: `Food:${itemId}`, fragment: FOOD })
  }
  
  const { data: popularItems } = useQuery(POPULAR_ITEMS, {
    variables: { restaurantId }
  })
  
  const { data: subCategoriesData, loading: subCategoriesLoading } = useQuery(
    GET_SUB_CATEGORIES,

    {
      onError: (error) => {
        FlashMessage({
          message:
            error.message ||
            error.clientErrors[0].message ||
            error.cause.message ||
            'Failed to fetch sub-categories'
        })
      }
    }
  )

 

  const dataList =
    popularItems &&
    popularItems?.popularItems?.map((item) => {
      const foodDetails = fetchFoodDetails(item?.id)
      return foodDetails
    })

  // Contexts
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const configuration = useContext(ConfigurationContext)
  const {
    restaurant: restaurantCart,
    cartCount,
    clearCart,
    checkItemCart
  } = useContext(UserContext)

  // Handlers
  const searchHandler = () => {
    setSelectedPrntCtg(merged_food_items[0]?.parentCategoryTitle)
    setSelectedSubCtg(merged_food_items[0]?.subCategoryTitle)
    scrollElementById(merged_food_items[0]?.parentCategoryTitle, 'parentCategory')
    scrollElementById(merged_food_items[0]?.subCategoryTitle, 'subCategory')
    setSearchOpen(!searchOpen)
    setShowSearchResults(!showSearchResults)
  }

  const searchPopupHandler = () => {
    setSearchOpen(!searchOpen)
    setSearch('')
    translationY.value = 0
  }

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y
  })

  const zIndexAnimation = useAnimatedStyle(() => {
    return {
      zIndex: interpolate(
        translationY.value,
        [0, TOP_BAR_HEIGHT, SCROLL_RANGE / 2],
        [-1, 1, 99],
        Extrapolation.CLAMP
      )
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
      restaurant: restaurant?._id,
    })
  }

  function tagCart(itemId) {
    if (checkItemCart) {
      const cartValue = checkItemCart(itemId)
      if (cartValue.exist) {
        return (
          <>
            <View style={styles(currentTheme).triangleCorner} />
            <TextDefault
              style={styles(currentTheme).tagText}
              numberOfLines={1}
              textColor={currentTheme.fontWhite}
              bold
              small
              center
            >
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
    transform: [{ scale: scaleValue.value }]
  }))

  // Modify existing navigation logic to use these indices
  const onViewableItemsChanged = ({ viewableItems }) => {
    buttonClickedSetter(false)
    if (viewableItems.length === 0) return;
    const current_item = viewableItems[0].item.title;
    if (current_item.parentCategoryTitle) {
      setSelectedPrntCtg(current_item.parentCategoryTitle)
    }
    if (current_item.subCategoryTitle) {
      setSelectedSubCtg(current_item.subCategoryTitle)
    }
  }

  const iconColor = currentTheme.white

  const iconBackColor = currentTheme.white

  const iconRadius = scale(15)

  const iconSize = scale(20)

  const iconTouchHeight = scale(30)

  const iconTouchWidth = scale(30)

  const circleSize = interpolate(
    circle.value,
    [0, 0.5, 1],
    [scale(18), scale(24), scale(18)],
    Extrapolation.CLAMP
  )
  const radiusSize = interpolate(
    circle.value,
    [0, 0.5, 1],
    [scale(9), scale(12), scale(9)],
    Extrapolation.CLAMP
  )

  const fontStyles = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        circle.value,
        [0, 0.5, 1],
        [8, 12, 8],
        Extrapolation.CLAMP
      )
    }
  })



  // UseFocusEffects
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  // UseEffects
  useEffect(() => {
    if (search === '') {
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

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS)
    }
    Track()
  }, [])
  useEffect(() => {
    if (
      data &&
      data?.restaurant &&
      (!data?.restaurant?.isAvailable || !isOpen(data?.restaurant))
    ) {
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

  const { isConnected:connect,setIsConnected :setConnect} = useNetworkStatus();

  console.log(connect)
  if (!connect) return <ErrorView/>

  if (loading || subCategoriesLoading)
    return (
      <RestaurantProductsScreenLoader
        styles={styles}
        HEADER_MAX_HEIGHT={HEADER_MAX_HEIGHT}
        HEADER_MIN_HEIGHT={HEADER_MIN_HEIGHT}
        TOP_BAR_HEIGHT={TOP_BAR_HEIGHT}
        PlaceholderMedia={PlaceholderMedia}
        currentTheme={currentTheme}
        data={data}
        iconBackColor={iconBackColor}
        iconColor={iconColor}
        iconRadius={iconRadius}
        iconSize={iconSize}
        iconTouchHeight={iconTouchHeight}
        iconTouchWidth={iconTouchWidth}
        loading={loading}
        propsData={propsData}
        searchHandler={searchHandler}
        searchOpen={searchOpen}
        searchPopupHandler={searchPopupHandler}
        showSearchResults={showSearchResults}
        translationY={translationY}
        setSearch={setSearch}
      />
    )
  if (error) return <TextError text={JSON.stringify(error)} />
  const restaurant = data.restaurant
  
  const allDeals = restaurant?.categories.filter((cat) => cat?.foods?.length)

  // Sorting food items with respect to their parent and sub categories
  const map = new Map()
  const subCategories = subCategoriesData?.subCategories || []
  const grouped_subcategories_obj = subCategories?.reduce((acc, sub_ctg) => {

    if (!acc[sub_ctg.parentCategoryId]) {
      acc[sub_ctg.parentCategoryId] = []
    }
    acc[sub_ctg.parentCategoryId].push(sub_ctg)
    return acc
  }, {});
  const grouped_subcategories_arr = Object.values(
    grouped_subcategories_obj
  ).flat()

  let parentCategories = allDeals?.filter((ctg) => grouped_subcategories_arr?.some((sub_ctg) => sub_ctg?.parentCategoryId !== ctg?._id && ctg?.foods?.some((_food) => _food?.subCategory !== sub_ctg?.parentCategoryId)));
  const foodItemsWithoutSubCtgs = allDeals.flatMap((ctg) => {
    const foodsWithoutSubCtgs = ctg.foods.filter((food) => !food.subCategory && !food.isOutOfStock);
    if (foodsWithoutSubCtgs.length > 0) {
      return [{
        parentCategoryTitle: ctg.title,
        subCategoryTitle: null,
        foods: foodsWithoutSubCtgs,
      }];
    }
    return [];
  });

  const sortedDeals = allDeals.flatMap((ctg) => {
    if (!ctg?.foods?.length) return;
    const sortedFoodsArray = grouped_subcategories_arr?.filter((sub_ctg) => sub_ctg.parentCategoryId === ctg._id).flatMap((sub_ctg) => {
      let item = {
        subCategoryTitle: ctg.foods?.some((fd) => fd?.subCategory === sub_ctg?._id && !fd.isOutOfStock) && sub_ctg?.title,
        parentCategoryTitle: '',
        foods: sub_ctg?._id ? ctg.foods.filter((fd) => fd?.subCategory === sub_ctg?._id && !fd.isOutOfStock) : ctg.foods.filter((fd) => fd?.subCategory === ctg?._id && !fd.isOutOfStock)
      }
      if (ctg._id === sub_ctg?.parentCategoryId || ctg?._id !== null && sub_ctg?.parentCategoryId !== ctg?._id) {
        if (!map.get(ctg._id)) {
          item['parentCategoryTitle'] = ctg?.title
          map.set(ctg._id, true)
        }
      }
      return [item]
    })
    return sortedFoodsArray
  })
  // merging ctg & sub_ctg food items
  const merged_food_items = [
    ...sortedDeals,
    ...foodItemsWithoutSubCtgs,
    ...parentCategories.map((ctg) => ({
      parentCategoryId: ctg?._id,
      subCategoryTitle: null,
      foods: ctg?.foods?.filter((_food) => !_food.subCategory && !food?.isOutOfStock)
    }))
  ]

  const scrollElementById = (title, type = 'subCategory') => {
    if (merged_food_items) {
      let sectionIndex = -1
      
      if (type === 'parentCategory') {
        // Find index for parent category
        sectionIndex = merged_food_items?.filter((sub_ctg) => sub_ctg?.foods.length && (sub_ctg?.parentCategoryTitle || sub_ctg?.subCategoryTitle)).findIndex(
          (section) =>
            section.parentCategoryTitle === title &&
            section.parentCategoryTitle !== ''
        )

        if (sectionIndex !== -1) {

          // Update parent category index
          if (scrollRef.current) {
            scrollRef.current.scrollToLocation({
              animated: true,
              sectionIndex: sectionIndex,
              itemIndex: 0,
              viewOffset: (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) - 400 ,
              viewPosition: 0
            })

            // Update selected label and navbar for parent category
            selectedLabelSetter(sectionIndex)
            // scrollToNavbar(sectionIndex)
          }
        }
      } else {
        // Find index for sub-category
        sectionIndex = merged_food_items?.filter((sub_ctg) => sub_ctg?.foods.length && (sub_ctg?.parentCategoryTitle || sub_ctg?.subCategoryTitle)).findIndex(
          (section) => section.subCategoryTitle === title
        )
        if (sectionIndex !== -1) {
          if (scrollRef.current) {
            scrollRef.current.scrollToLocation({
              animated: true,
              sectionIndex: sectionIndex,
              itemIndex: 0,
              viewOffset: (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) - 400,
              viewPosition: 0
            })
          }
        }
      }
    }
  }
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
    <SafeAreaView style={[styles(currentTheme).flex]}>
      <Animated.View style={[styles(currentTheme).flex]}>
        <ImageHeader
          ref={flatListRef}
          iconColor={iconColor}
          iconSize={iconSize}
          iconBackColor={iconBackColor}
          iconRadius={iconRadius}
          iconTouchWidth={iconTouchWidth}
          iconTouchHeight={iconTouchHeight}
          sortedDeals={sortedDeals}
          restaurantName={propsData?.name ?? data?.restaurant?.name}
          restaurantId={propsData?._id}
          restaurantImage={propsData?.image ?? data?.restaurant?.image}
          restaurant={data?.restaurant}
          topBarData={updatedDeals.filter(_item => _item?.foods?.some((_food) => !_food?.isOutOfStock))} // filtering deals based on is the foods inside them are in stock
          selectedLabel={selectedLabel}
          minimumOrder={
            propsData?.minimumOrder ?? data?.restaurant?.minimumOrder
          }
          tax={propsData?.tax ?? data?.restaurant?.tax}
          selectedLabelSetter={selectedLabelSetter}
          updatedDeals={updatedDeals}
          searchOpen={searchOpen}
          showSearchResults={showSearchResults}
          setSearch={setSearch}
          search={search}
          searchHandler={searchHandler}
          searchPopupHandler={searchPopupHandler}
          translationY={translationY}
          scrollElementById={scrollElementById}
          selectedSubCtg={selectedSubCtg}
          setSelectedSubCtg={setSelectedSubCtg}
          selectedPrntCtg={selectedPrntCtg}
          setSelectedPrntCtg={setSelectedPrntCtg}
          buttonClickedSetter={buttonClickedSetter}
          relatedSubCategories={relatedSubCategories}
          setRelatedSubCategories={setRelatedSubCategories}
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
                  style={styles(currentTheme).searchDealSection}
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressItem({
                      ...item,
                      restaurant: restaurant?._id,
                      restaurantName: restaurant?.name
                    })
                  }}
                >
                  <View
                    style={{
                      flexDirection: currentTheme?.isRTL
                        ? 'row-reverse'
                        : 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                          <TextDefault
                            textColor={currentTheme.fontMainColor}
                            style={styles(currentTheme).headerText}
                            numberOfLines={1}
                            bolder
                            isRTL
                          >
                            {item?.title}
                          </TextDefault>
                          <TextDefault
                            style={styles(currentTheme).priceText}
                            small
                            isRTL
                          >
                            {wrapContentAfterWords(item?.description, 5)}
                          </TextDefault>
                          <View style={styles(currentTheme).dealPrice}>
                            <TextDefault
                              numberOfLines={1}
                              textColor={currentTheme.fontMainColor}
                              style={styles(currentTheme).priceText}
                              bolder
                              small
                              isRTL
                            >
                              {configuration.currencySymbol}{' '}
                              {parseFloat(item?.variations[0].price).toFixed(2)}
                            </TextDefault>
                            {item?.variations[0]?.discounted > 0 && (
                              <TextDefault
                                numberOfLines={1}
                                textColor={currentTheme.fontSecondColor}
                                style={styles(currentTheme).priceText}
                                small
                                lineOver
                                isRTL
                              >
                                {configuration.currencySymbol}{' '}
                                {(
                                  item?.variations[0].price +
                                  item?.variations[0].discounted
                                ).toFixed(2)}
                              </TextDefault>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles(currentTheme).addToCart}>
                      <MaterialIcons
                        name='add'
                        size={scale(20)}
                        color={currentTheme.themeBackground}
                      />
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
            sections={
              updatedDeals
            }
            style={[
              {
                flexGrow: 1,
                paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                marginTop: relatedSubCategories.length>0?125:70
              },
              zIndexAnimation
            ]}
            contentContainerStyle={{
              paddingBottom: !sortedDeals.length === 1 ? HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT : HEADER_MAX_HEIGHT + HEADER_MIN_HEIGHT
            }}
            ref={scrollRef}
            scrollEventThrottle={16}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            refreshing={networkStatus === 4}
            onRefresh={() => networkStatus === 7 && refetch()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50, 
              minimumViewTime: 0
            }}

            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10
            }}
            removeClippedSubviews={false}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={50}
            onScroll={scrollHandler}
            keyExtractor={(item, index) =>
              `${item._id}-${index}` + Math.random() * 1000
            }

            renderSectionHeader={({ section: { title, data } }) => {
              if (title === 'Popular') {
                if (!dataList || dataList?.length === 0) {
                  return null // Don't render the section header if dataList is empty
                }
                return (
                  <View style={styles(currentTheme).restaurantItems}>
                    <View style={styles().popularHeading}>
                      <PopularIcon color={currentTheme.iconColorDark} />
                      <TextDefault
                        style={styles(currentTheme).popularText}
                        textColor={currentTheme.fontFourthColor}
                        bolder
                      >
                        {title}
                      </TextDefault>
                    </View>
                    {/* <TextDefault
                      textColor={currentTheme.fontFourthColor}
                      style={{
                        // ...alignment.PLmedium,
                        // ...alignment.PRmedium,
                        fontSize: scale(12),
                        fontWeight: '400',
                        marginTop: scale(3)
                      }}
                    >
                      {t('mostOrderedNow')}
                    </TextDefault> */}
                    <View style={styles().popularItemCards}>
                      {data?.map((item) => (
                        item?._id ?
                        <ItemCard
                          key={item._id}
                          item={item}
                          onPressItem={onPressItem}
                          restaurant={restaurant}
                          tagCart={tagCart}
                        /> : ""
                      ))}
                    </View>
                  </View>
                  )
                
              }
              // Render other section headers as usual
              return (
                <View style={styles(currentTheme).sectionHeader}>
                  <TextDefault
                    style={styles(currentTheme).sectionHeaderText}
                    textColor={currentTheme.fontFourthColor}
                    bolder
                  >
                    {title}
                  </TextDefault>
                </View>
              )
            }}
            renderItem={({ item: food, section: food_section }) => {
              const imageUrl = food?.image;

              if (food_section.title === 'Popular') {
                if (!dataList || dataList?.length === 0) {
                  return null
                }
                return null
              }
              return (
                <TouchableOpacity
                  id={`section-${food?._id}` + Math.random() * 1000}
                  key={`section-${food?._id}` + Math.random() * 1000}
                  style={styles(currentTheme).dealSection}
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressItem({
                      ...food,
                      restaurant: restaurant?._id,
                      restaurantName: restaurant?.name
                    })
                  }}
                >
                  <View
                    style={{
                      flexDirection: currentTheme?.isRTL
                        ? 'row-reverse'
                        : 'row',
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
                          <TextDefault
                            textColor={currentTheme.fontMainColor}
                            style={styles(currentTheme).headerText}
                            numberOfLines={1}
                            bolder
                            isRTL
                          >
                            {food?.title}
                          </TextDefault>
                          <TextDefault
                            style={styles(currentTheme).priceText}
                            small
                            isRTL
                          >
                            {wrapContentAfterWords(food?.description, 4)}
                          </TextDefault>
                          <View style={styles(currentTheme).dealPrice}>
                            <TextDefault
                              numberOfLines={1}
                              textColor={currentTheme.fontMainColor}
                              style={styles(currentTheme).priceText}
                              bolder
                              small
                              isRTL
                            >
                              {configuration.currencySymbol}{' '}
                              {parseFloat(food?.variations[0].price).toFixed(2)}
                            </TextDefault>
                            {food?.variations[0]?.discounted > 0 && (
                              <TextDefault
                                numberOfLines={1}
                                textColor={currentTheme.fontSecondColor}
                                style={styles(currentTheme).priceText}
                                small
                                lineOver
                                isRTL
                              >
                                {configuration.currencySymbol}{' '}
                                {(
                                  food?.variations[0].price +
                                  food?.variations[0].discounted
                                ).toFixed(2)}
                              </TextDefault>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles(currentTheme).addToCart}>
                      <MaterialIcons
                        name='add'
                        size={scale(20)}
                        color={currentTheme.themeBackground}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        )}
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
                      width: circleSize,
                      height: circleSize,
                      borderRadius: radiusSize
                    },
                    scaleStyles
                  ]}
                >
                  <Animated.Text
                    style={[styles(currentTheme).buttonTextLeft, fontStyles]}
                  >
                    {cartCount}
                  </Animated.Text>
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
      </Animated.View>
    </SafeAreaView>
  )
}

export default Restaurant