import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
// import { TouchableOpacity } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import ShimmerImage from '../../ShimmerImage/ShimmerImage'
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  SimpleLineIcons
} from '@expo/vector-icons'
import { IconButton } from 'react-native-paper'

// Components
import TextDefault from '../../Text/TextDefault/TextDefault'
import FavoriteButton from '../../FavButton/FavouriteButton'

// Utils
import { scale } from '../../../utils/scaling'
import styles from './styles'
import CachedImage from '../../CachedImage'

function RestaurantDetailHeader({
  restaurant,
  configuration,
  currentTheme,
  t,
  navigation,
  onOpenSearch
}) {
  const [toggle, setToggle] = useState(false)

  const currentDayShort = new Date()
    .toLocaleString('en-US', { weekday: 'short' })
    .toUpperCase()

  const todayOpeningTimes = restaurant?.openingTimes?.find(
    (opening) => opening.day === currentDayShort
  )

  const handleNavigateToReviews = useCallback(() => {
    navigation.navigate('Reviews', {
      restaurantObject: { ...restaurant }
    })
  }, [navigation, restaurant])

  const handleNavigateToAbout = useCallback(() => {
    navigation.navigate('About', {
      restaurantObject: { ...restaurant }
    })
  }, [navigation, restaurant])

  const isOpen = restaurant?.isAvailable

  return (
    <View style={styles(currentTheme).mainContainer}>
      <View style={styles(currentTheme).imageContainer}>
        <ShimmerImage
          imageUrl={restaurant?.image}
          style={styles(currentTheme).mainRestaurantImg}
        />

        {/* Header icons overlay */}
        <View style={styles(currentTheme).headerIconsContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name='arrow-back'
              color={currentTheme.white}
              size={scale(17)}
            />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', gap: scale(8) }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).iconButton}
              onPress={onOpenSearch}
            >
              <Ionicons
                name='search'
                size={scale(17)}
                color={currentTheme.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).iconButton}
              onPress={handleNavigateToAbout}
            >
              <SimpleLineIcons
                name='info'
                size={scale(17)}
                color={currentTheme.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery details overlay */}
        <View style={styles(currentTheme).deliveryDetailsOverlay}>
          <View style={styles(currentTheme).detailPill}>
            <TextDefault
              small
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).detailLabel}
            >
              {t('deliveryCharges')}
            </TextDefault>
            <TextDefault
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.fontMainColor}
              bold
            >
              {configuration.currencySymbol}{configuration?.deliveryRate}
            </TextDefault>
          </View>

          <View style={styles(currentTheme).detailPill}>
            <TextDefault
              small
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.fontMainColor}
              style={styles(currentTheme).detailLabel}
            >
              {t('minimumOrder')}
            </TextDefault>
            <TextDefault
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.fontMainColor}
              bold
            >
              {configuration.currencySymbol}{restaurant?.minimumOrder}
            </TextDefault>
          </View>
        </View>
      </View>

      <View style={styles(currentTheme).contentContainer}>
        {/* Rest of the content remains the same */}
        <View style={styles(currentTheme).subContainer}>
          <View style={styles(currentTheme).titleContainer}>
            <CachedImage
              resizeMode='cover'
              source={
                restaurant?.logo
                  ? { uri: restaurant.logo }
                  : require('../../../assets/images/defaultLogo.png')
              }
              style={styles(currentTheme).restaurantImg}
            />
            <TextDefault
              numberOfLines={1}
              H3
              bolder
              textColor={currentTheme.fontThirdColor}
              style={{ flex: 1, flexShrink: 1 }}
            >
              {restaurant?.name?.substring(0, 25) + '...'}
            </TextDefault>
          </View>
          <FavoriteButton iconSize={scale(24)} restaurantId={restaurant?._id} />
        </View>

        <View style={[styles(currentTheme).cuisineContainer, { paddingRight: scale(14) }]}>
          <TextDefault textColor={currentTheme.fontThirdColor} H5 bold>
            {toggle
              ? restaurant?.cuisines?.join(', ')
              : restaurant?.cuisines?.join(', ').substring(0, 40) + '...'}
          </TextDefault>
          {restaurant?.cuisines?.toString()?.length > 40 && (
            <IconButton
              icon={toggle ? 'arrow-up' : 'arrow-down'}
              iconColor='gray'
              style={{ width: 25 }}
              onPress={() => setToggle((prev) => !prev)}
            />
          )}
        </View>

        <View style={styles(currentTheme).infoContainer}>
          <View style={styles(currentTheme).ratingBox}>
            <MaterialCommunityIcons
              name='star-outline'
              size={scale(20)}
              color={currentTheme.newIconColor}
            />
            {restaurant?.reviewData?.total > 0 ? (
              <>
                <TextDefault textColor={currentTheme.fontNewColor} bold H5>
                  {restaurant?.reviewData?.ratings}
                </TextDefault>
                <TextDefault textColor={currentTheme.fontNewColor} H5>
                  ({restaurant?.reviewData?.total} {t('reviews')})
                </TextDefault>
              </>
            ) : (
              <TextDefault textColor={currentTheme.fontNewColor} bold H5>
                {t('noReviewsYet', 'No reviews yet')}
              </TextDefault>
            )}
          </View>

          {restaurant?.reviewData?.total > 0 && (
            <TouchableOpacity
              style={styles(currentTheme).reviewButton}
              activeOpacity={0.8}
              onPress={handleNavigateToReviews}
            >
              <TextDefault bolder textColor={currentTheme.main}>
                {t('seeReviews')}
              </TextDefault>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles(currentTheme).timingContainer}>
          <View style={styles(currentTheme).ratingBox}>
            <MaterialCommunityIcons
              name='timer-outline'
              size={scale(21)}
              color={currentTheme.newIconColor}
            />
            {todayOpeningTimes && (
              <View style={styles(currentTheme).timingRow}>
                <TextDefault
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                  textColor={currentTheme.fontThirdColor}
                  bold
                  style={styles(currentTheme).timingLabel}
                >
                  {t(todayOpeningTimes?.day)}{' '}
                </TextDefault>
                {todayOpeningTimes?.times?.length < 1 ? (
                  <TextDefault
                    small
                    bold
                    center
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    style={styles(currentTheme).timingValue}
                  >
                    {t('ClosedAllDay')}
                  </TextDefault>
                ) : (
                  <TextDefault
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    textColor={currentTheme.fontThirdColor}
                    bold
                    style={styles(currentTheme).timingValue}
                  >
                    {todayOpeningTimes?.times
                      ?.map(
                        (timing) =>
                          `${timing.startTime[0]}:${timing.startTime[1]} - ${timing.endTime[0]}:${timing.endTime[1]}`
                      )
                      .join('  ')}
                  </TextDefault>
                )}
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles(currentTheme).statusButton}
            disabled={true}
          >
            <TextDefault
              bolder
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.main}
            >
              {!isOpen ? t('Closed') : t('Open')}
            </TextDefault>
          </TouchableOpacity>
        </View>

        <View style={styles(currentTheme).deliveryContainer}>
          <View style={styles(currentTheme).deliveryIconContainer}>
            <MaterialCommunityIcons
              name='bike-fast'
              size={scale(18)}
              color={currentTheme.newIconColor}
            />
          </View>
          <TextDefault
            textColor={currentTheme.fontNewColor}
            bold
            H5
            style={styles(currentTheme).deliveryText}
          >
            {restaurant?.deliveryTime} {t('Min')}
          </TextDefault>
        </View>
      </View>
    </View>
  )
}

export default React.memo(RestaurantDetailHeader)
