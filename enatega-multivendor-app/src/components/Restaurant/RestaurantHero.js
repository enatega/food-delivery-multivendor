import React, { memo, useContext, useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import TextDefault from '../Text/TextDefault/TextDefault'
import FavoriteButton from '../FavButton/FavouriteButton'
import Bicycle from '../../assets/SVG/Bicycle'
import ShimmerImage from '../ShimmerImage/ShimmerImage'
import { resolveLogoImage, resolveRestaurantImage } from '../../utils/resolveImageUrl'

const HERO_IMAGE_HEIGHT = scale(250)
const HERO_CARD_OFFSET = scale(34)
const HERO_TRANSLATE_DISTANCE = scale(18)

function RestaurantHero({ aboutObject, displayedDeliveryMinutes, scrollY, fadeDistance }) {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const currentTheme = useMemo(
    () => ({
      isRTL: i18n.dir() === 'rtl',
      ...theme[themeContext.ThemeValue]
    }),
    [i18n, themeContext.ThemeValue]
  )

  const currentDayShort = useMemo(() => new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase(), [])
  const todayOpeningTimes = aboutObject?.openingTimes?.find((opening) => opening.day === currentDayShort)
  const heroImageUrl = useMemo(() => resolveRestaurantImage(aboutObject) || null, [aboutObject])
  const logoImageUrl = useMemo(() => resolveLogoImage(aboutObject) || heroImageUrl, [aboutObject, heroImageUrl])

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, fadeDistance * 0.6, fadeDistance], [1, 0.45, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, fadeDistance], [0, -HERO_TRANSLATE_DISTANCE], Extrapolation.CLAMP)
      }
    ]
  }))

  return (
    <Animated.View style={[styles(currentTheme).container, heroAnimatedStyle]}>
      <ShimmerImage
        imageUrl={heroImageUrl}
        style={styles(currentTheme).heroImage}
        resizeMode='cover'
        defaultSource={require('../../assets/images/food_placeholder.png')}
      />

      <View style={styles(currentTheme).card}>
        <View style={styles(currentTheme).titleRow}>
          <View style={styles(currentTheme).titleContainer}>
            <ShimmerImage
              resizeMode='cover'
              style={styles(currentTheme).logo}
              imageUrl={logoImageUrl}
              defaultSource={require('../../assets/images/defaultLogo.png')}
            />
            <TextDefault numberOfLines={2} H3 bolder textColor={currentTheme.fontThirdColor} style={styles(currentTheme).titleText}>
              {aboutObject?.restaurantName}
            </TextDefault>
          </View>
          <FavoriteButton iconSize={scale(24)} restaurantId={aboutObject?.restaurantId} />
        </View>

        <TextDefault textColor={currentTheme.fontThirdColor} H5 bold isRTL>
          {aboutObject?.restaurantCuisines?.join(', ')}
        </TextDefault>

        <View style={styles(currentTheme).spacedRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).ratingBox}
            onPress={() => {
              navigation.navigate('Reviews', {
                restaurantObject: { ...aboutObject, isOpen: null },
                tab: false
              })
            }}
          >
            <FontAwesome5 name='smile' size={scale(20)} color={currentTheme.newIconColor} />
            <TextDefault textColor={currentTheme.fontNewColor} bold H5 isRTL>
              {aboutObject?.average}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontNewColor} bold H5 isRTL>
              {aboutObject?.reviewsCount ?? 0} review(s)
            </TextDefault>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles(currentTheme).actionButton}
            activeOpacity={0.8}
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
          </TouchableOpacity>
        </View>

        <View style={styles(currentTheme).spacedRow}>
          <View style={styles(currentTheme).ratingBox}>
            <MaterialCommunityIcons name='timer-outline' size={scale(20)} color={currentTheme.newIconColor} />
            {todayOpeningTimes && (
              <View style={styles(currentTheme).timingRow}>
                <TextDefault textColor={currentTheme.fontThirdColor} bold isRTL>
                  {t(todayOpeningTimes?.day)}{' '}
                </TextDefault>
                {todayOpeningTimes?.times?.length < 1 ? (
                  <TextDefault small bold center isRTL>
                    {t('ClosedAllDay')}
                  </TextDefault>
                ) : (
                  todayOpeningTimes?.times?.map((timing, index) => (
                    <TextDefault key={index} textColor={currentTheme.fontThirdColor} bold isRTL>
                      {timing.startTime[0]}:{timing.startTime[1]} - {timing.endTime[0]}:{timing.endTime[1]}
                    </TextDefault>
                  ))
                )}
              </View>
            )}
          </View>

          <View style={styles(currentTheme).actionButton}>
            <TextDefault bolder textColor={currentTheme.main}>
              {!aboutObject?.IsOpen ? t('Closed') : t('Open')}
            </TextDefault>
          </View>
        </View>

        <View style={[styles(currentTheme).ratingBox, styles(currentTheme).deliveryRow]}>
          <Bicycle size={20} color={currentTheme.newFontcolor} />
          <TextDefault textColor={currentTheme.fontNewColor} bold H5 isRTL>
            {displayedDeliveryMinutes} {t('Min')}
          </TextDefault>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      backgroundColor: props.themeBackground,
      paddingBottom: scale(18)
    },
    heroImage: {
      width: '100%',
      height: HERO_IMAGE_HEIGHT
    },
    card: {
      marginTop: -HERO_CARD_OFFSET,
      marginHorizontal: props.themeBackground === '#fff' ? 0 : scale(14),
      paddingTop: scale(16),
      paddingBottom: scale(14),
      borderRadius: scale(22),
      backgroundColor: props.themeBackground,
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    titleRow: {
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: scale(60),
      marginBottom: scale(10)
    },
    titleContainer: {
      flex: 1,
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(10),
      marginRight: props.isRTL ? 0 : scale(10),
      marginLeft: props.isRTL ? scale(10) : 0
    },
    titleText: {
      flex: 1,
      flexShrink: 1,
      marginRight: scale(10)
    },
    logo: {
      width: scale(60),
      height: scale(60),
      borderRadius: 12
    },
    spacedRow: {
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(12),
      marginTop: scale(10)
    },
    timingRow: {
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: scale(5),
      flexWrap: 'wrap',
      flex: 1
    },
    ratingBox: {
      flex: 1,
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      gap: scale(10),
      alignItems: 'center'
    },
    actionButton: {
      borderRadius: 8,
      paddingHorizontal: scale(16),
      paddingVertical: scale(10),
      backgroundColor: props.newButtonBackground,
      justifyContent: 'center',
      alignItems: 'center'
    },
    deliveryRow: {
      marginTop: scale(12)
    }
  })

export default memo(RestaurantHero)
