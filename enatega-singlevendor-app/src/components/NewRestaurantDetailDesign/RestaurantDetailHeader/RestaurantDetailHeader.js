import React, { useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import ShimmerImage from '../../ShimmerImage/ShimmerImage'
import {
  MaterialCommunityIcons,
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
import { resolveLogoImage, resolveRestaurantImage } from '../../../utils/resolveImageUrl'

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

  const isOpen = restaurant?.isOpen ?? restaurant?.isAvailable
  const cuisineText = restaurant?.cuisines?.join(', ') ?? ''
  const heroImage = resolveRestaurantImage(restaurant)
  const logoImage = resolveLogoImage(restaurant)

  return (
    <View style={styles(currentTheme).mainContainer}>
      <View style={styles(currentTheme).imageContainer}>
        {heroImage
          ? (
            <ShimmerImage
              imageUrl={heroImage}
              style={styles(currentTheme).mainRestaurantImg}
              resizeMode='cover'
              defaultSource={require('../../../assets/images/food_placeholder.png')}
            />
            )
          : (
            <View style={styles(currentTheme).heroFallback}>
              <Ionicons
                name='storefront-outline'
                size={scale(42)}
                color={currentTheme.colors.textMuted}
              />
            </View>
            )}

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
              textColor={currentTheme.white}
              style={styles(currentTheme).detailLabel}
            >
              {t('deliveryCharges')}
            </TextDefault>
            <TextDefault
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.white}
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
              textColor={currentTheme.white}
              style={styles(currentTheme).detailLabel}
            >
              {t('minimumOrder')}
            </TextDefault>
            <TextDefault
              numberOfLines={1}
              ellipsizeMode='tail'
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              textColor={currentTheme.white}
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
                logoImage
                  ? { uri: logoImage }
                  : require('../../../assets/images/defaultLogo.png')
              }
              style={styles(currentTheme).restaurantImg}
            />
            <TextDefault
              numberOfLines={1}
              H3
              bolder
              textColor={currentTheme.colors.textPrimary}
              style={{ flex: 1, flexShrink: 1 }}
            >
              {restaurant?.name}
            </TextDefault>
          </View>
          <FavoriteButton iconSize={scale(24)} restaurantId={restaurant?._id} />
        </View>

        <View style={styles(currentTheme).cuisineContainer}>
          <TextDefault
            textColor={currentTheme.colors.textMuted}
            style={styles(currentTheme).cuisineText}
            numberOfLines={toggle ? undefined : 2}
          >
            {cuisineText}
          </TextDefault>
          {restaurant?.cuisines?.toString()?.length > 40 && (
            <IconButton
              icon={toggle ? 'arrow-up' : 'arrow-down'}
              iconColor={currentTheme.colors.textMuted}
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
              color={currentTheme.colors.textSecondary}
            />
            {restaurant?.reviewData?.total > 0
              ? (
              <>
                <TextDefault textColor={currentTheme.colors.textSecondary} bold>
                  {restaurant?.reviewData?.ratings}
                </TextDefault>
                <TextDefault textColor={currentTheme.colors.textSecondary}>
                  ({restaurant?.reviewData?.total} {t('reviews')})
                </TextDefault>
              </>
                )
              : (
              <TextDefault textColor={currentTheme.colors.textSecondary} bold>
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
              <TextDefault bolder textColor={currentTheme.colors.accent}>
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
              color={currentTheme.colors.textSecondary}
            />
            {todayOpeningTimes && (
              <View style={styles(currentTheme).timingRow}>
                <TextDefault
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                  textColor={currentTheme.colors.textSecondary}
                  bold
                  style={styles(currentTheme).timingLabel}
                >
                  {t(todayOpeningTimes?.day)}{' '}
                </TextDefault>
                {todayOpeningTimes?.times?.length < 1
                  ? (
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
                    )
                  : (
                  <TextDefault
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    textColor={currentTheme.colors.textSecondary}
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
              textColor={isOpen ? currentTheme.colors.accent : currentTheme.colors.danger}
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
              color={currentTheme.colors.textSecondary}
            />
          </View>
          <TextDefault
            textColor={currentTheme.colors.textSecondary}
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
