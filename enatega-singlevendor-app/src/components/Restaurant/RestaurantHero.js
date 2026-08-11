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
import { useMultivendorTheme } from '../../ui/designSystem'

const HERO_IMAGE_HEIGHT = scale(250)
const HERO_CARD_OFFSET = scale(34)
const HERO_TRANSLATE_DISTANCE = scale(18)

function RestaurantHero({ aboutObject, displayedDeliveryMinutes, scrollY, fadeDistance }) {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const { t, i18n } = useTranslation()
  const { tokens } = useMultivendorTheme()
  const currentTheme = useMemo(
    () => ({
      isRTL: i18n.dir() === 'rtl',
      ...theme[themeContext.ThemeValue],
      ...tokens
    }),
    [i18n, themeContext.ThemeValue, tokens]
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
            <TextDefault numberOfLines={2} H3 bolder textColor={currentTheme.colors.textPrimary} style={styles(currentTheme).titleText}>
              {aboutObject?.restaurantName}
            </TextDefault>
          </View>
          <FavoriteButton iconSize={scale(24)} restaurantId={aboutObject?.restaurantId} />
        </View>

        <TextDefault textColor={currentTheme.colors.textMuted} style={styles(currentTheme).cuisineText} isRTL>
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
            <FontAwesome5 name='smile' size={scale(18)} color={currentTheme.colors.textSecondary} />
            <TextDefault textColor={currentTheme.colors.textSecondary} bold isRTL>
              {aboutObject?.average}
            </TextDefault>
            <TextDefault textColor={currentTheme.colors.textSecondary} isRTL>
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
            <TextDefault bolder textColor={currentTheme.colors.accent}>
              {t('seeReviews')}
            </TextDefault>
          </TouchableOpacity>
        </View>

        <View style={styles(currentTheme).spacedRow}>
          <View style={styles(currentTheme).ratingBox}>
            <MaterialCommunityIcons name='timer-outline' size={scale(18)} color={currentTheme.colors.textSecondary} />
            {todayOpeningTimes && (
              <View style={styles(currentTheme).timingRow}>
                <TextDefault textColor={currentTheme.colors.textSecondary} bold isRTL>
                  {t(todayOpeningTimes?.day)}{' '}
                </TextDefault>
                {todayOpeningTimes?.times?.length < 1
                  ? (
                  <TextDefault small bold center isRTL>
                    {t('ClosedAllDay')}
                  </TextDefault>
                    )
                  : (
                      todayOpeningTimes?.times?.map((timing, index) => (
                    <TextDefault key={index} textColor={currentTheme.colors.textSecondary} bold isRTL>
                      {timing.startTime[0]}:{timing.startTime[1]} - {timing.endTime[0]}:{timing.endTime[1]}
                    </TextDefault>
                      ))
                    )}
              </View>
            )}
          </View>

          <View style={[styles(currentTheme).actionButton, styles(currentTheme).statusButton]}>
            <View style={[
              styles(currentTheme).statusDot,
              !aboutObject?.IsOpen && styles(currentTheme).closedStatusDot
            ]} />
            <TextDefault
              bolder
              textColor={aboutObject?.IsOpen ? currentTheme.colors.accent : currentTheme.colors.danger}
            >
              {!aboutObject?.IsOpen ? t('Closed') : t('Open')}
            </TextDefault>
          </View>
        </View>

        <View style={[styles(currentTheme).ratingBox, styles(currentTheme).deliveryRow]}>
          <Bicycle size={20} color={currentTheme.colors.textSecondary} />
          <TextDefault textColor={currentTheme.colors.textSecondary} bold isRTL>
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
      backgroundColor: props.colors.canvas,
      paddingBottom: scale(22)
    },
    heroImage: {
      width: '100%',
      height: HERO_IMAGE_HEIGHT
    },
    card: {
      marginTop: -HERO_CARD_OFFSET,
      marginHorizontal: scale(12),
      paddingTop: scale(14),
      paddingBottom: scale(14),
      borderRadius: scale(18),
      backgroundColor: props.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props.colors.borderSubtle,
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    titleRow: {
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: scale(56),
      marginBottom: scale(8)
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
      width: scale(54),
      height: scale(54),
      borderRadius: scale(12),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props.colors.borderSubtle
    },
    cuisineText: {
      ...props.typeScale.body,
      marginTop: scale(3)
    },
    spacedRow: {
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: scale(10),
      marginTop: scale(12)
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
      gap: scale(8),
      alignItems: 'center'
    },
    actionButton: {
      borderRadius: scale(999),
      paddingHorizontal: scale(12),
      paddingVertical: scale(7),
      backgroundColor: props.colors.accentSubtle,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: props.colors.borderSubtle,
      justifyContent: 'center',
      alignItems: 'center'
    },
    statusButton: {
      flexDirection: props.isRTL ? 'row-reverse' : 'row',
      gap: scale(6)
    },
    statusDot: {
      width: scale(6),
      height: scale(6),
      borderRadius: scale(999),
      backgroundColor: props.colors.accent
    },
    closedStatusDot: {
      backgroundColor: props.colors.danger
    },
    deliveryRow: {
      marginTop: scale(12)
    }
  })

export default memo(RestaurantHero)
