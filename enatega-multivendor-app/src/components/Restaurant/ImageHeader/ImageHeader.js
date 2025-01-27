// Hooks
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'

// React Native
import { View, Dimensions, Text, Image, FlatList, Platform } from 'react-native'
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler'


// Icons
import {
  Ionicons,
  Entypo,
  SimpleLineIcons,
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons'
import Bicycle from '../../../assets/SVG/Bicycle'

// Styles
import styles from './styles'

// Utils
import TextDefault from '../../Text/TextDefault/TextDefault'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import TextError from '../../Text/TextError/TextError'
import { textStyles } from '../../../utils/textStyles'
import { isOpen } from '../../../utils/customFunctions'

// Components
import Search from '../../../components/Main/Search/Search'
import FavoriteButton from '../../FavButton/FavouriteButton'

// Contexts
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../../context/Configuration'
import { useQuery } from '@apollo/client'
import { GET_SUB_CATEGORIES } from '../../../apollo/queries'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import { Icon, IconButton } from 'react-native-paper'
// Animation
const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

// Screen Dimensions & Scroll Range
const { height } = Dimensions.get('screen');
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT =
  Platform.OS === 'android' ? height * 0.65 : height * 0.61
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

function ImageTextCenterHeader(props, ref) {
  // Queries
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

  // States
  const [toggle, setToggle] = useState(false)

  // Hooks
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const { location } = useContext(LocationContext)
  const configuration = useContext(ConfigurationContext)

  // Contexts & Constants
  const { translationY } = props
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const newheaderColor = currentTheme.backgroundColor
  const cartContainer = currentTheme.gray500

  // Ref
  const flatListRef = ref
//  console.log("c",props?.restaurant?.reviewData)
  
  const aboutObject = {
    latitude: props?.restaurant
      ? props?.restaurant.location.coordinates[1]
      : '',
    longitude: props?.restaurant
      ? props?.restaurant.location.coordinates[0]
      : '',
    address: props?.restaurant ? props?.restaurant.address : '',
    restaurantId: props?.restaurantId,
    restaurantName: props?.restaurantName,
    restaurantImage: props?.restaurantImage,
    restaurantLogo: props?.restaurant ? props?.restaurant.logo : '',
    restaurantCuisines: props?.restaurant ? props?.restaurant.cuisines : '',
    restaurantTax: props?.tax,
    restaurantMinOrder: props?.minimumOrder,
    deliveryTime: props?.restaurant ? props?.restaurant.deliveryTime : '...',
    minimumOrder: props?.restaurant ? props?.restaurant.minimumOrder : '...',
    average: props?.restaurant ? props?.restaurant?.reviewData?.ratings : '...',
    total: props?.restaurant ? props?.restaurant?.reviewData?.total : '...',
    reviews: props?.restaurant ? props?.restaurant?.reviewData?.reviews : '...',
    reviewsCount: props?.restaurant ? props?.restaurant?.reviewCount: '...',
    isAvailable: props?.restaurant ? props?.restaurant?.isAvailable : true,
    openingTimes: props?.restaurant ? props?.restaurant?.openingTimes : [],
    phone: props?.restaurant ? props?.restaurant?.phone : '',
    restaurantUrl: props?.restaurant ? props?.restaurant?.restaurantUrl : '',
    IsOpen: isOpen(props?.restaurant ? props?.restaurant : '')
  }
  // console.log("aboutObject",aboutObject)

  // Constants
  const currentDayShort = new Date()
    .toLocaleString('en-US', { weekday: 'short' })
    .toUpperCase()

  const todayOpeningTimes = aboutObject?.openingTimes?.find(
    (opening) => opening.day === currentDayShort
  )

  // Local Hooks
  const minutesOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, TOP_BAR_HEIGHT, SCROLL_RANGE / 2],
        [0, 0.8, 1],
        Extrapolation.CLAMP
      )
    }
  })

  const headerHeight = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translationY.value,
        [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        Extrapolation.CLAMP
      )
    }
  })

  const headerHeightWithoutTopbar = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translationY.value,
        [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        [
          HEADER_MAX_HEIGHT - TOP_BAR_HEIGHT,
          HEADER_MIN_HEIGHT - TOP_BAR_HEIGHT
        ],
        Extrapolation.CLAMP
      )
    }
  })

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, height * 0.05, SCROLL_RANGE / 2],
        [1, 0.8, 0],
        Extrapolation.CLAMP
      )
    }
  });

  // Empty View
  const emptyView = () => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TextError text={t('noItemsExists')} />
      </View>
    )
  }

  function getSubCategoryFoodCount(topBarData) {
    const subCategoryFoodMap = new Map();

    topBarData.forEach((category) => {
      if (category.foods) {
        // filtering out the out of stock sub-categories
        category.foods.filter((_food) => !_food.isOutOfStock).forEach((food) => {
          const subCategoryId = food?.subCategory;
          // Increment count for the subCategory in the map
          if (subCategoryFoodMap.has(subCategoryId)) {
            subCategoryFoodMap.set(subCategoryId, subCategoryFoodMap.get(subCategoryId) + 1);
          } else {
            subCategoryFoodMap.set(subCategoryId, 1);
          }
        });
      }
    });
    return subCategoryFoodMap;
  }


  async function getRelatedSubCategories(parentCategoryId) {
    try {
      // First, get the food count map
      const foodCountMap = getSubCategoryFoodCount(props?.topBarData);

      // Filter subcategories based on two conditions:
      // 1. Parent Category matches
      // 2. Subcategory has food items (count > 0)
      const filteredSubCategories = subCategoriesData?.subCategories.filter(
        (sub_category) =>
          sub_category.parentCategoryId === parentCategoryId &&
          (foodCountMap.get(sub_category._id) || 0) > 0
      );
      props.setRelatedSubCategories(filteredSubCategories);
    } catch (error) {
      console.log(error);
    }
  }

  // Handlers
  /*1. Parent Category Button Click */
  const handleParentCategoryButtonClick = async (item) => {
    await props.setSelectedPrntCtg(item.title)
    await getRelatedSubCategories(item._id)
    await props.scrollElementById(item.title, 'parentCategory')
    await props.buttonClickedSetter(true)
    await props.setSelectedPrntCtg(item.title)
  }
  /* 2. Child Category Button Click */
  const handleSubCategoryButtonClick = async (item) => {
    await props?.setSelectedSubCtg(item.title)
    await props.scrollElementById(item.title, 'subCategory')
    await props.buttonClickedSetter(true)
    await props?.setSelectedSubCtg(item.title)
  }

  // UseEffects
  useEffect(() => {
    if (props.selectedLabel !== null || props.selectedPrntCtg) {
      const selectedItem = props?.topBarData[props.selectedLabel] || props?.topBarData?.find((prnt_ctg) => prnt_ctg._id === props.selectedPrntCtg)
      const newItem = props?.topBarData?.find((prnt_ctg) => prnt_ctg.title === props.selectedPrntCtg)
      if (selectedItem?._id) {
        getRelatedSubCategories(selectedItem._id)
      }
      if (newItem?._id) {
        getRelatedSubCategories(newItem?._id)
      }
    }
  }, [props.selectedLabel, props.selectedPrntCtg, props.selectedSubCtg])

  return (
    <Animated.View style={[styles(currentTheme).mainContainer, headerHeight ]}>
      <Animated.View style={[headerHeightWithoutTopbar]}>
        <Animated.View style={[styles().overlayContainer]}>
          <View style={[styles().fixedViewNavigation]}>
            <View style={[styles().backIcon]}>
              {props?.searchOpen ? (  
                <AnimatedTouchable
                  activeOpacity={0.7}
                  style={[
                    styles(currentTheme).touchArea,
                    {
                      // backgroundColor: props?.themeBackground,
                      borderRadius: props?.iconRadius,
                      height: props?.iconTouchHeight,
                      marginTop:28
                    }
                  ]}
                  onPress={props?.searchPopupHandler}
                >
                  <Entypo
                    name='cross'
                    color={currentTheme.newIconColor}
                    size={scale(18)}
                  />
                </AnimatedTouchable>
              ) : (
                <AnimatedTouchable
                  activeOpacity={0.7}
                  style={[
                    styles(currentTheme).touchArea,
                    {
                      borderRadius: props?.iconRadius,
                      height: props?.iconTouchHeight,
                      marginTop:15.5
                    }
                  ]}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons
                    name='arrow-back'
                    color={currentTheme.newIconColor}
                    size={scale(17)}
                  />
                </AnimatedTouchable>
              )}
            </View>
            <View style={[styles().center]}>
              {!props?.searchOpen && (
                <AnimatedText
                  numberOfLines={1}
                  style={[styles(currentTheme).headerTitle,minutesOpacity, {marginTop:12}]}
                >
                  {t('delivery')} {aboutObject.deliveryTime} {t('Min')}
                </AnimatedText>
              )}
            </View>
            <View style={[styles().fixedIcons, {}]}>
              {props?.searchOpen ? (
                <>
                  <Search
                    setSearch={props?.setSearch}
                    search={props?.search}
                    newheaderColor={newheaderColor}
                    cartContainer={cartContainer}
                    placeHolder={t('searchItems')}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles(currentTheme).touchArea,
                      {
                        // backgroundColor: props?.themeBackground,
                        borderRadius: props?.iconRadius,
                        height: props?.iconTouchHeight
                      }
                    ]}
                    onPress={() => {
                      navigation.navigate('About', {
                        restaurantObject: { ...aboutObject },
                        tab: false
                      })
                    }}
                  >
                    <SimpleLineIcons
                      name='info'
                      size={scale(17)}
                      color={currentTheme.newIconColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles(currentTheme).touchArea,
                      {
                        borderRadius: props?.iconRadius,
                        height: props?.iconTouchHeight
                      }
                    ]}
                    onPress={props?.searchHandler}
                  >
                    <Ionicons
                      name='search-outline'
                      style={{
                        fontSize: 18
                      }}
                      color={currentTheme.newIconColor}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          {!props?.search && !props?.loading && (
            <Animated.View style={[styles().restaurantDetails, opacity]}>
              <Animated.View>
                <Image
                  resizeMode='cover'
                  source={{ uri: aboutObject?.restaurantImage }}
                  style={[
                    styles().mainRestaurantImg,
                    props?.searchOpen ? { opacity: 0 } : {}
                  ]}
                />
                <View style={styles(currentTheme).mainDetailsContainer}>
                  <View style={styles(currentTheme).subDetailsContainer}>
                    <TextDefault textColor={currentTheme.fontMainColor}>
                      {t('deliveryCharges')} {configuration.currencySymbol}
                      {configuration?.deliveryRate}
                    </TextDefault>
                  </View>

                  <View style={styles(currentTheme).subDetailsContainer}>
                    <TextDefault textColor={currentTheme.fontMainColor} isRTL>
                      {t('minimumOrder')} {configuration.currencySymbol}{' '}
                      {aboutObject?.restaurantMinOrder}
                    </TextDefault>
                  </View>
                </View>
              </Animated.View>
              <Animated.View
                style={[
                  {
                    display: 'flex',
                    gap: scale(10),
                    marginBottom: scale(10),
                    ...alignment.PLmedium,
                    ...alignment.PRmedium
                  }
                ]}
              >
                <View style={[styles(currentTheme).subContainer]}>
                  <View style={styles(currentTheme).titleContainer}>
                    <Image
                      resizeMode='cover'
                      source={
                        aboutObject.restaurantLogo
                          ? { uri: aboutObject?.restaurantLogo }
                          : require('../../../assets/images/defaultLogo.png')
                      }
                      style={[styles().restaurantImg]}
                    />
                    <TextDefault
                      numberOfLines={2}
                      H3
                      bolder
                      textColor={currentTheme.fontThirdColor}
                    >
                      {aboutObject?.restaurantName}
                    </TextDefault>
                  </View>
                  <FavoriteButton
                    iconSize={scale(24)}
                    restaurantId={aboutObject.restaurantId}
                  />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: toggle ? 'auto' : 20, backgroundColor:'' }}>
                  <TextDefault
                    textColor={currentTheme.fontThirdColor}
                    H5
                    bold
                    isRTL
                  >
                    {aboutObject?.restaurantCuisines?.length ?
                      toggle ? aboutObject?.restaurantCuisines?.join(', ') : aboutObject?.restaurantCuisines?.join(', ').substring(0, 40) + '...' : ''}
                  </TextDefault>
                  {aboutObject?.restaurantCuisines?.toString()?.length > 40 && <IconButton icon={toggle ? 'arrow-up' : 'arrow-down'} iconColor='gray' style={{ width: 25 }} onPress={() => setToggle((prev) => !prev)} />}
                </View>
              </Animated.View>

              <View
                style={{
                  flexDirection: currentTheme.isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  marginTop: scale(5),
                  alignItems: 'center'
                }}
              >
                <AnimatedTouchable
                  activeOpacity={0.7}
                  style={styles(currentTheme).ratingBox}
                  onPress={() => {
                    navigation.navigate('Reviews', {
                      restaurantObject: { ...aboutObject, isOpen: null },
                      tab: false
                    })
                  }}
                >
                  <FontAwesome5
                    name='smile'
                    size={scale(20)}
                    color={currentTheme.newIconColor}
                  />

                  <TextDefault
                    textColor={currentTheme.fontNewColor}
                    bold
                    H5
                    isRTL
                  >
                    {aboutObject?.average}
                  </TextDefault>
                  <TextDefault
                    textColor={currentTheme.fontNewColor}
                    style={{ marginLeft: -10 }}
                    bold
                    H5
                    isRTL
                  >
                    {aboutObject?.reviewsCount ?? 0} review(s)
                  </TextDefault>
                </AnimatedTouchable>
                <AnimatedTouchable
                  style={styles(currentTheme).seeReviewsBtn}
                  activeOpacity={0.8}
                  disabled={props?.loading}
                  onPress={() => {
                    navigation.navigate('Reviews', {
                      restaurantObject: { ...aboutObject, isOpen: null },
                      tab: false
                    })
                  }}
                >
                  <TextDefault bolder textColor={currentTheme.main}>
                    {t('seeReviews')}
                  </TextDefault>
                </AnimatedTouchable>
              </View>

              <View
                style={{
                  flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  marginTop: scale(5)
                }}
              >
                <View
                  activeOpacity={0.7}
                  style={styles(currentTheme).ratingBox}
                >
                  <MaterialCommunityIcons
                    name='timer-outline'
                    size={scale(21)}
                    color={currentTheme.newIconColor}
                  />

                  {todayOpeningTimes && (
                    <View style={styles(currentTheme).timingRow}>
                      <TextDefault
                        textColor={currentTheme.fontThirdColor}
                        bold
                        isRTL
                      >
                        {t(todayOpeningTimes?.day)}{' '}
                      </TextDefault>
                      {todayOpeningTimes?.times?.length < 1 ? (
                        <TextDefault small bold center isRTL>
                          {t('ClosedAllDay')}
                        </TextDefault>
                      ) : (
                        todayOpeningTimes?.times?.map((timing, index) => (
                          <TextDefault
                            key={index}
                            textColor={currentTheme.fontThirdColor}
                            bold
                            isRTL
                          >
                            {timing.startTime[0]}:{timing.startTime[1]} -{' '}
                            {timing.endTime[0]}:{timing.endTime[1]}
                          </TextDefault>
                        ))
                      )}
                    </View>
                  )}
                </View>
                <AnimatedTouchable
                  style={styles(currentTheme).seeReviewsBtn}
                  disabled={true}
                >
                  <TextDefault bolder textColor={currentTheme.main}>
                    {!aboutObject?.IsOpen ? t('Closed') : t('Open')}
                  </TextDefault>
                </AnimatedTouchable>
              </View>

              <View
                style={[
                  styles(currentTheme).ratingBox,
                  { marginTop: scale(5)}
                ]}
              >
                <Bicycle size={24} color={currentTheme.newFontcolor} />

                <TextDefault
                  textColor={currentTheme.fontNewColor}
                  bold
                  H5
                  isRTL
                >
                  {aboutObject.deliveryTime} {t('Min')}
                </TextDefault>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>

      {/* Parent Categories  */}

      {!props?.search && !props?.searchOpen && (
        <View style={{  height: 100, marginTop: props?.relatedSubCategories?.length>0?-32:-36}}>
          {!props?.loading && (
            <FlatList
              ref={flatListRef}
              style={[styles(currentTheme).flatListStyle,]}
              contentContainerStyle={{ flexGrow: 1, top: 0 }}
              data={props?.loading ? [] : [...props?.topBarData.filter((_item)=>!_item.foods.some((_food)=>_food?.isOutOfStock))]}
              horizontal={true}
              ListEmptyComponent={emptyView()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => {
                index.toString() + Math.random()
              }}
              inverted={currentTheme.isRTL ? true : false}
              renderItem={({ item, index }) => {
                if(item.title){return (
                  <View
                    key={`category-${index}`}
                    style={
                      [props?.selectedPrntCtg === item.title
                        ? styles(currentTheme).activeHeaderCtg
                        : styles(currentTheme).nonActiveHeader
                      ]
                    }
                  >
                    <RectButton
                      rippleColor={currentTheme.rippleColor}
                      onPress={() => handleParentCategoryButtonClick(item)}
                      style={styles(currentTheme).headerContainer}
                    >
                      <View style={styles().navbarTextContainer}>
                        <TextDefault
                          style={
                            props?.selectedPrntCtg === item.title
                              ? textStyles.Bolder
                              : textStyles.H5
                          }
                          textColor={
                            props?.selectedPrntCtg === item.title
                              ? currentTheme.newButtonText
                              : currentTheme.gray500
                          }
                          center
                          H5
                        >
                          {t(item.title)}
                        </TextDefault>
                      </View>
                    </RectButton>
                  </View>
                )}else {
                  return;
                }
              }}
            />
          )}
          {/* SUB-CATEGORIES-LIST  */}
          {(!subCategoriesLoading && props?.relatedSubCategories?.length> 0)  && (
            <FlatList
              data={props.relatedSubCategories}
              style={[styles(currentTheme).SubCategoryflatListStyle]}
              contentContainerStyle={{ flexGrow: 1, top: 0 }}
              horizontal={true}
              // ListEmptyComponent={emptyView()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(sub_ctg) => sub_ctg._id}
              inverted={currentTheme.isRTL ? true : false}
              renderItem={({ item: sub_ctg, index }) => {
               if(sub_ctg.title){ return (
                  <View
                    style={
                      props.selectedSubCtg === sub_ctg.title
                        ? styles(currentTheme).activeHeader
                        : null
                    }
                  >
                    <RectButton
                      rippleColor={currentTheme.rippleColor}
                      onPress={() => handleSubCategoryButtonClick(sub_ctg)}
                      style={styles(currentTheme).headerContainer}
                    >
                      <View style={styles().navbarTextContainerSubCtg}>
                        <TextDefault
                          style={
                            props.selectedSubCtg === sub_ctg.title
                              ? textStyles.Bolder
                              : textStyles.H5
                          }
                          textColor={
                            props.selectedSubCtg === sub_ctg.title
                              ? currentTheme.newButtonText
                              : currentTheme.gray500
                          }
                          center
                          H5
                        >
                          {t(sub_ctg.title)}
                        </TextDefault>
                      </View>
                    </RectButton>
                  </View>
                )
              }else{
                return;
              }
              }}
            
            />
          )}
        </View>
      )}
    </Animated.View>
  )
}

export default React.forwardRef(ImageTextCenterHeader)