import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import {
  MaterialIcons,
  Ionicons,
  Entypo,
  AntDesign,
  SimpleLineIcons
} from '@expo/vector-icons'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useNavigation } from '@react-navigation/native'
import { DAYS } from '../../../utils/enums'
import { RectButton } from 'react-native-gesture-handler'
import { scale } from '../../../utils/scaling'
import { alignment } from '../../../utils/alignment'
import TextError from '../../Text/TextError/TextError'
import { textStyles } from '../../../utils/textStyles'
import { useTranslation } from 'react-i18next'
import Search from '../../../components/Main/Search/Search'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import Spinner from '../../Spinner/Spinner'
import UserContext from '../../../context/User'
import { addFavouriteRestaurant } from '../../../apollo/mutations'
import { profile } from '../../../apollo/queries'
import { calculateDistance } from '../../../utils/customFunctions'
import { LocationContext } from '../../../context/Location'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'

const AnimatedText = Animated.createAnimatedComponent(Text)
const { height } = Dimensions.get('screen')
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT = height * .35
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`

function ImageTextCenterHeader(props, ref) {
  const { translationY } = props
  const flatListRef = ref
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  const { t } = useTranslation()
  const newheaderColor = currentTheme.backgroundColor
  const cartContainer = currentTheme.gray500
  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(props.restaurantId) : false
  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    refetchQueries: [{ query: PROFILE }]
  })

  function onCompleted() {
    FlashMessage({ message: t('favouritelistUpdated') })
  }

  const handleAddToFavorites = () => {
    if (!loadingMutation && profile) {
      mutate({ variables: { id: props.restaurantId } })
    }
  }

  const aboutObject = {
    latitude: props.restaurant ? props.restaurant.location.coordinates[1] : '',
    longitude: props.restaurant ? props.restaurant.location.coordinates[0] : '',
    address: props.restaurant ? props.restaurant.address : '',
    restaurantName: props.restaurantName,
    restaurantImage: props.restaurantImage,
    restaurantTax: props.tax,
    restaurantMinOrder: props.minimumOrder,
    deliveryTime: props.restaurant ? props.restaurant.deliveryTime : '...',
    average: props.restaurant ? props.restaurant.reviewData.ratings : '...',
    total: props.restaurant ? props.restaurant.reviewData.total : '...',
    reviews: props.restaurant ? props.restaurant.reviewData.reviews : '...',
    isAvailable: props.restaurant ? props.restaurant.isAvailable : true,
    openingTimes: props.restaurant ? props.restaurant.openingTimes : [],
    isOpen: () => {
      if (!props.restaurant) return true
      const date = new Date()
      const day = date.getDay()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const todaysTimings = props.restaurant.openingTimes.find(
        (o) => o.day === DAYS[day]
      )
      const times = todaysTimings.times.filter(
        (t) =>
          hours >= Number(t.startTime[0]) &&
          minutes >= Number(t.startTime[1]) &&
          hours <= Number(t.endTime[0]) &&
          minutes <= Number(t.endTime[1])
      )

      return times.length > 0
    }
  }

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

      const headerTextFlex = useAnimatedStyle(() => {
        const concat = (...args) => args.join('')
        return {
          marginBottom: concat(
            interpolate(
              translationY.value,
              [0, 80, SCROLL_RANGE],
              [-10, -10, 0],
              Extrapolation.CLAMP
            ),
            '%'
          )
        }
      })

      const iconBackColor = currentTheme.white

      const iconRadius = scale(15)

      const iconSize = scale(20)

      const iconTouchHeight = scale(30)

      const iconTouchWidth = scale(30)

  const distance = calculateDistance(
    aboutObject?.latitude,
    aboutObject?.longitude,
    location?.latitude,
    location?.longitude
  )

  const hideKeyboard = () => {
    Keyboard.dismiss()
  }

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
    // <TouchableWithoutFeedback onPress={hideKeyboard}>
    <Animated.View style={[styles(currentTheme).mainContainer, headerHeight]}>
      {/* <Animated.View style={[styles().topBar]}> */}
        <Animated.View
          style={[styles().overlayContainer, headerHeightWithoutTopbar]}
        >
          <View style={styles().fixedViewNavigation}>
            <View style={styles().backIcon}>
              {props.searchOpen ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles().touchArea,
                    {
                      backgroundColor: props.iconBackColor,
                      borderRadius: props.iconRadius,
                      height: props.iconTouchHeight
                    }
                  ]}
                  onPress={props.searchPopupHandler}
                >
                  <Entypo
                    name='cross'
                    style={{
                      color: props.black,
                      fontSize: props.iconSize
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles().touchArea,
                    {
                      backgroundColor: props.iconBackColor,
                      borderRadius: props.iconRadius,
                      height: props.iconTouchHeight
                    }
                  ]}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons
                    name='ios-arrow-back'
                    style={{
                      color: props.black,
                      fontSize: props.iconSize
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles().fixedIcons}>
              {props.searchOpen ? (
                <>
                  <Search
                    setSearch={props.setSearch}
                    search={props.search}
                    newheaderColor={newheaderColor}
                    cartContainer={cartContainer}
                    placeHolder={t('searchItems')}
                  />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={loadingMutation}
                    style={[
                      styles().touchArea,
                      {
                        backgroundColor: props.iconBackColor,
                        borderRadius: props.iconRadius,
                        height: props.iconTouchHeight
                      }
                    ]}
                    onPress={handleAddToFavorites}
                  >
                    <View>
                      {loadingMutation ? (
                        <Spinner
                          size={'small'}
                          backColor={'transparent'}
                          spinnerColor={currentTheme.iconColorDark}
                        />
                      ) : (
                        <AntDesign
                          name={heart ? 'heart' : 'hearto'}
                          size={scale(15)}
                          color={currentTheme.iconColorDark}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles().touchArea,
                      {
                        backgroundColor: props.iconBackColor,
                        borderRadius: props.iconRadius,
                        height: props.iconTouchHeight
                      }
                    ]}
                    onPress={() => {
                      navigation.navigate('About', {
                        restaurantObject: { ...aboutObject, isOpen: null },
                        tab: false
                      })
                    }}
                  >
                    <SimpleLineIcons
                      name='info'
                      size={scale(17)}
                      color={currentTheme.iconColorDark}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles().touchArea,
                      {
                        backgroundColor: props.iconBackColor,
                        borderRadius: props.iconRadius,
                        height: props.iconTouchHeight
                      }
                    ]}
                    onPress={props.searchHandler}
                  >
                    <Ionicons
                      name='search-outline'
                      style={{
                        fontSize: props.iconSize
                      }}
                      color={currentTheme.iconColorDark}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Animated.View>
      {/* </Animated.View> */}

      {!props.search && (
        <>
          <Animated.View style={[(styles().restaurantDetails, opacity)]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: scale(15),
                marginBottom: scale(20)
              }}
            >
              <View style={styles().restImageContainer}>
                <Image
                  resizeMode='cover'
                  source={{ uri: aboutObject.restaurantImage }}
                  style={[styles().restaurantImg]}
                />
              </View>
              <View style={styles().restaurantTitle}>
                <TextDefault
                  H4
                  bolder
                  Center
                  textColor={currentTheme.fontMainColor}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {aboutObject.restaurantName}
                </TextDefault>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 7 }}>
              <Text style={styles().restaurantAbout}>
                {distance.toFixed(2)}km {t('away')}
              </Text>
              <Text style={styles().restaurantAbout}>|</Text>
              <Text style={styles().restaurantAbout}>
                ${aboutObject.restaurantTax} {t('deliveryCharges')}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 7,
                marginTop: scale(5)
              }}
            >
              <Text style={styles().restaurantAbout}>
                ${aboutObject.restaurantMinOrder} {t('minimum')}
              </Text>
              <Text style={styles().restaurantAbout}>|</Text>
              <Text style={styles().restaurantAbout}>
                {t('serviceFeeApply')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: scale(15)
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles().ratingBox}
                onPress={() => {
                  navigation.navigate('Reviews', {
                    restaurantObject: { ...aboutObject, isOpen: null },
                    tab: false
                  })
                }}
              >
                <MaterialIcons
                  name='star-border'
                  size={scale(20)}
                  color='#111827'
                />

                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: scale(16),
                    color: '#374151'
                  }}
                >
                  {aboutObject.average}
                </Text>
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: scale(14),
                    color: '#6B7280',
                    marginLeft: scale(5)
                  }}
                >
                  ({aboutObject.total})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles().ratingBox}
                disabled={props.loading}
                onPress={() =>
                  navigation.navigate('Reviews', {
                    restaurantObject: { ...aboutObject, isOpen: null },
                    tab: false
                  })
                }
              >
                <Text
                  style={{
                    fontSize: scale(14),
                    fontWeight: '600',
                    color: '#3B82F6'
                  }}
                >
                  {t('seeReviews')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles().ratingBox, { marginTop: scale(9) }]}>
              <MaterialIcons name='timer' size={scale(20)} color='#111827' />
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: scale(14),
                  color: '#6B7280'
                }}
              >
                {aboutObject.deliveryTime} {t('Min')}
              </Text>
            </View>
          </Animated.View>
          <View>
            {!props.loading && (
              <FlatList
                ref={flatListRef}
                style={styles(currentTheme).flatListStyle}
                contentContainerStyle={{ flexGrow: 1 }}
                data={props.loading ? [] : [...props.topaBarData]}
                horizontal={true}
                ListEmptyComponent={emptyView()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View
                    style={
                      props.selectedLabel === index
                        ? styles(currentTheme).activeHeader
                        : null
                    }
                  >
                    <RectButton
                      rippleColor={currentTheme.rippleColor}
                      onPress={() => props.changeIndex(index)}
                      style={styles(currentTheme).headerContainer}
                    >
                      <View style={styles().navbarTextContainer}>
                        <TextDefault
                          style={
                            props.selectedLabel === index
                              ? textStyles.Bolder
                              : textStyles.H5
                          }
                          textColor={
                            props.selectedLabel === index
                              ? '#111827'
                              : '#6B7280'
                          }
                          center
                          H5
                        >
                          {item.title}
                        </TextDefault>
                      </View>
                    </RectButton>
                  </View>
                )}
              />
            )}
          </View>
        </>
      )}
    </Animated.View>
    // </TouchableWithoutFeedback>
  )
}

export default React.forwardRef(ImageTextCenterHeader)
