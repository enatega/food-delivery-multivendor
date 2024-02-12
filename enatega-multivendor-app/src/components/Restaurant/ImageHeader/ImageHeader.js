import React, { useContext } from 'react'
import { View, Dimensions, Text } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { scale, verticalScale } from '../../../utils/scaling'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useNavigation } from '@react-navigation/native'
import { DAYS } from '../../../utils/enums'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated'
import {
  BorderlessButton,
  FlatList,
  RectButton,
  TouchableOpacity
} from 'react-native-gesture-handler'
import { alignment } from '../../../utils/alignment'
import TextError from '../../Text/TextError/TextError'
import { textStyles } from '../../../utils/textStyles'
import { useTranslation } from 'react-i18next'

const { height } = Dimensions.get('screen')
const TOP_BAR_HEIGHT = height * 0.05
const AnimatedIon = Animated.createAnimatedComponent(Ionicons)
const AnimatedBorderless = Animated.createAnimatedComponent(BorderlessButton)
const AnimatedText = Animated.createAnimatedComponent(Text)

const HEADER_MAX_HEIGHT = height * 0.3
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

function ImageTextCenterHeader(props, ref) {
  const { translationY } = props
  const flatListRef = ref
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const aboutObject = {
    latitude: props.restaurant ? props.restaurant.location.coordinates[1] : '',
    longitude: props.restaurant ? props.restaurant.location.coordinates[0] : '',
    address: props.restaurant ? props.restaurant.address : '',
    restaurantName: props.restaurantName,
    restaurantImage: props.restaurantImage,
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

  const emptyView = () => {
    return (
      <View
        style={{
          width: '100%',
          height: verticalScale(40),
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TextError text={t('noItemsExists')} />
      </View>
    )
  }

  return (
    <Animated.View
      style={[
        styles(currentTheme).mainContainer,
        headerHeight,
        {
          backgroundColor: props.loading ? 'transparent' : 'null'
        }
      ]}
    >
      <Animated.View
        style={[
          headerHeightWithoutTopbar,
          {
            backgroundColor: 'white'
          }
        ]}
      >
        <Animated.Image
          resizeMode='cover'
          source={{ uri: aboutObject.restaurantImage }}
          style={[
            styles().flex,
            opacity,
            {
              borderBottomLeftRadius: scale(20),
              borderBottomRightRadius: scale(20)
            }
          ]}
        />
        <Animated.View style={styles().overlayContainer}>
          <View style={styles().fixedViewNavigation}>
            <View style={styles().fixedIcons}>
              <AnimatedBorderless
                activeOpacity={0.7}
                rippleColor={currentTheme.rippleColor}
                style={[
                  styles().touchArea,
                  {
                    backgroundColor: iconBackColor,
                    borderRadius: iconRadius,
                    height: iconTouchHeight,
                    width: scale(60)
                  }
                ]}
                onPress={() => navigation.goBack()}
              >
                <AnimatedIon
                  name='arrow-back'
                  style={{
                    color: props.black,
                    fontSize: iconSize
                  }}
                />
              </AnimatedBorderless>
              <AnimatedText
                numberOfLines={1}
                style={[
                  styles(currentTheme).headerTitle,
                  minutesOpacity,
                  headerTextFlex
                ]}
              >
                {t('delivery')} {aboutObject.deliveryTime} {t('Min')}
              </AnimatedText>
              {!props.loading && (
                <>
                  <AnimatedBorderless
                    activeOpacity={0.7}
                    rippleColor={currentTheme.rippleColor}
                    style={[
                      styles().touchArea,
                      {
                        backgroundColor: iconBackColor,
                        borderRadius: iconRadius,
                        height: iconTouchHeight,
                        width: iconTouchWidth
                      }
                    ]}
                    onPress={() => {
                      navigation.navigate('About', {
                        restaurantObject: {
                          ...aboutObject,
                          isOpen: null
                        },
                        tab: true
                      })
                    }}
                  >
                    {
                      <AnimatedIon
                        name='information-circle-outline'
                        style={{
                          color: props.black,
                          fontSize: iconSize
                        }}
                      />
                    }
                  </AnimatedBorderless>
                </>
              )}
            </View>
          </View>
          <Animated.View style={[styles().fixedView, opacity]}>
            <View style={styles().fixedText}>
              <TextDefault
                H4
                bolder
                Center
                textColor={currentTheme.fontWhite}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {aboutObject.restaurantName.length > 12
                  ? `${aboutObject.restaurantName.slice(0, 15)}...`
                  : aboutObject.restaurantName}
              </TextDefault>

              {!props.loading && (
                <View style={styles(currentTheme).deliveryBox}>
                  <TextDefault
                    style={[alignment.PRxSmall, alignment.PLxSmall]}
                    textColor='white'
                    bold
                  >
                    {t('delivery')} {aboutObject.deliveryTime} {t('Min')}
                  </TextDefault>
                </View>
              )}
              {!props.loading && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles().ratingBox}
                  onPress={() => {
                    navigation.navigate('About', {
                      restaurantObject: { ...aboutObject, isOpen: null },
                      tab: false
                    })
                  }}
                >
                  <MaterialIcons
                    name='star'
                    size={scale(15)}
                    color={currentTheme.white}
                  />
                  <TextDefault
                    style={[alignment.PRxSmall, alignment.PLxSmall]}
                    textColor='white'
                    bold
                  >
                    {aboutObject.average} ({aboutObject.total})
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {!props.loading && (
        <FlatList
          ref={flatListRef}
          style={[styles(currentTheme).flatListStyle]}
          contentContainerStyle={{ flexGrow: 1 }}
          data={props.loading ? [] : props.topaBarData}
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
                activeOpacity={0.05}
                rippleColor={currentTheme.rippleColor}
                onPress={() => props.changeIndex(index)}
                style={styles(currentTheme).headerContainer}
              >
                <View style={styles().navbarTextContainer}>
                  <TextDefault
                    style={
                      props.selectedLabel === index
                        ? textStyles.Bolder
                        : textStyles.Small
                    }
                    textColor={
                      props.selectedLabel === index
                        ? currentTheme.tagColor
                        : currentTheme.fontMainColor
                    }
                    center
                    uppercase
                    small
                  >
                    {item.title}
                  </TextDefault>
                </View>
              </RectButton>
            </View>
          )}
        />
      )}
    </Animated.View>
  )
}

export default React.forwardRef(ImageTextCenterHeader)
