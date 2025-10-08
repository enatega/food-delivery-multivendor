import React, { useContext, useEffect } from 'react'
import { View, Dimensions, Text, Image, FlatList, Platform } from 'react-native'
import {
  Ionicons,
  Entypo,
  SimpleLineIcons,
  MaterialCommunityIcons,
  FontAwesome5
} from '@expo/vector-icons'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useNavigation } from '@react-navigation/native'
import { DAYS } from '../../../utils/enums'
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import TextError from '../../Text/TextError/TextError'
import { textStyles } from '../../../utils/textStyles'
import { useTranslation } from 'react-i18next'
import Search from '../../../components/Main/Search/Search'
import { calculateDistance, isOpen } from '../../../utils/customFunctions'
import { LocationContext } from '../../../context/Location'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import FavoriteButton from '../../FavButton/FavouriteButton'
import Bicycle from '../../../assets/SVG/Bicycle'
import ConfigurationContext from '../../../context/Configuration'

const AnimatedText = Animated.createAnimatedComponent(Text)
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const { height } = Dimensions.get('screen')
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT =
  Platform.OS === 'android' ? height * 0.65 : height * 0.61
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

function ImageTextCenterHeader(props, ref) {
  const { t, i18n } = useTranslation()
  const { translationY } = props
  const flatListRef = ref
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { location } = useContext(LocationContext)
  const configuration = useContext(ConfigurationContext)
  const newheaderColor = currentTheme.backgroundColor
  const cartContainer = currentTheme.gray500

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
    isAvailable: props?.restaurant ? props?.restaurant?.isAvailable : true,
    openingTimes: props?.restaurant ? props?.restaurant?.openingTimes : [],
    phone: props?.restaurant ? props?.restaurant?.phone : '',
    restaurantUrl: props?.restaurant ? props?.restaurant?.restaurantUrl : '',
    IsOpen: isOpen(props?.restaurant ? props?.restaurant : ''),
    reviewsCount: props?.restaurant ? props?.restaurant?.reviewCount : '...',
    reviewsAverage: props?.reviewAverage
  }

  const currentDayShort = new Date()
    .toLocaleString('en-US', { weekday: 'short' })
    .toUpperCase()

  const todayOpeningTimes = aboutObject?.openingTimes.find(
    (opening) => opening.day === currentDayShort
  )

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
  })

  const distance = calculateDistance(
    aboutObject?.latitude,
    aboutObject?.longitude,
    location?.latitude,
    location?.longitude
  )

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

  return (
    <Animated.View style={[styles(currentTheme).mainContainer, headerHeight]}>
      <Animated.View style={[headerHeightWithoutTopbar]}>
        <Animated.View style={[styles().overlayContainer]}>
          <View style={[styles().fixedViewNavigation]}>
            <View style={styles().backIcon}>
              {props?.searchOpen ? (
                <AnimatedTouchable
                  activeOpacity={0.7}
                  style={[
                    styles(currentTheme).touchArea,
                    {
                      // backgroundColor: props?.themeBackground,
                      borderRadius: props?.iconRadius,
                      height: props?.iconTouchHeight
                    }
                  ]}
                  onPress={props?.searchPopupHandler}
                >
                  <Entypo
                    name='cross'
                    color={currentTheme.newIconColor}
                    size={scale(22)}
                  />
                </AnimatedTouchable>
              ) : (
                <AnimatedTouchable
                  activeOpacity={0.7}
                  style={[
                    styles(currentTheme).touchArea,
                    {
                      // backgroundColor: props?.themeBackground,
                      borderRadius: props?.iconRadius,
                      height: props?.iconTouchHeight
                    }
                  ]}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons
                    name='arrow-back'
                    color={currentTheme.newIconColor}
                    size={scale(22)}
                  />
                </AnimatedTouchable>
              )}
            </View>
            <View style={styles().center}>
              {!props?.searchOpen && (
                <AnimatedText
                  numberOfLines={1}
                  style={[styles(currentTheme).headerTitle, minutesOpacity]}
                >
                  {t('delivery')} {aboutObject.deliveryTime} {t('Min')}
                </AnimatedText>
              )}
            </View>
            <View style={styles().fixedIcons}>
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
                        // backgroundColor: props?.themeBackground,
                        borderRadius: props?.iconRadius,
                        height: props?.iconTouchHeight
                      }
                    ]}
                    onPress={props?.searchHandler}
                  >
                    <Ionicons
                      name='search-outline'
                      style={{
                        fontSize: props?.iconSize
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
                pointerEvents="box-none"
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
                <View style={[styles(currentTheme).subContainer]} pointerEvents="box-none">
                  <View style={styles(currentTheme).titleContainer}>
                    <Image
                      resizeMode='cover'
                      source={
                        aboutObject.restaurantLogo
                          ? { uri: aboutObject.restaurantLogo }
                          : require('../../../assets/images/defaultLogo.png')
                      }
                      style={[styles().restaurantImg]}
                    />
                    <TextDefault
                      numberOfLines={2}
                      H3
                      bolder
                      textColor={currentTheme.fontThirdColor}
                      style={{ flex: 1, flexShrink: 1, marginRight: scale(10) }}
                    >
                      {aboutObject?.restaurantName}
                    </TextDefault>
                  </View>
                  <FavoriteButton
                    iconSize={scale(24)}
                    restaurantId={aboutObject.restaurantId}
                  />
                </View>
                <TextDefault
                  textColor={currentTheme.fontThirdColor}
                  H5
                  bold
                  isRTL
                >
                  {aboutObject?.restaurantCuisines?.join(', ')}
                </TextDefault>
              </Animated.View>

              <View
                style={{
                  flexDirection: currentTheme.isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  marginTop: scale(5)
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
                    size={scale(20)}
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
                  { marginTop: scale(5) }
                ]}
              >
                <Bicycle size={20} color={currentTheme.newFontcolor} />

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

      {!props?.search && (
        <>
          {!props?.loading && (
            <FlatList
              ref={flatListRef}
              style={styles(currentTheme).flatListStyle}
              contentContainerStyle={{ flexGrow: 1 }}
              data={props?.loading ? [] : [...props?.topaBarData]}
              horizontal={true}
              ListEmptyComponent={emptyView()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              inverted={currentTheme.isRTL ? true : false}
              renderItem={({ item, index }) => (
                <View
                  style={
                    props?.selectedLabel === index
                      ? styles(currentTheme).activeHeader
                      : null
                  }
                >
                  <RectButton
                    rippleColor={currentTheme.rippleColor}
                    onPress={() => props?.changeIndex(index)}
                    style={styles(currentTheme).headerContainer}
                  >
                    <View style={styles().navbarTextContainer}>
                      <TextDefault
                        style={
                          props?.selectedLabel === index
                            ? textStyles.Bolder
                            : textStyles.H5
                        }
                        textColor={
                          props?.selectedLabel === index
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
              )}
            />
          )}
        </>
      )}
    </Animated.View>
  )
}

export default React.forwardRef(ImageTextCenterHeader)
