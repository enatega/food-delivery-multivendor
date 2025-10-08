import React, { useCallback, useState } from 'react'
import { View, Image } from 'react-native'
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
import Bicycle from '../../../assets/SVG/Bicycle'

// Utils
import { scale } from '../../../utils/scaling'
import styles from './styles'

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
            <TextDefault textColor={currentTheme.fontMainColor}>
              {t('deliveryCharges')} {configuration.currencySymbol}
              {configuration?.deliveryRate}
            </TextDefault>
          </View>

          <View style={styles(currentTheme).detailPill}>
            <TextDefault textColor={currentTheme.fontMainColor}>
              {t('minimumOrder')} {configuration.currencySymbol}{' '}
              {restaurant?.minimumOrder}
            </TextDefault>
          </View>
        </View>
      </View>

      <View style={styles(currentTheme).contentContainer}>
        {/* Rest of the content remains the same */}
        <View style={styles(currentTheme).subContainer}>
          <View style={styles(currentTheme).titleContainer}>
            <Image
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
            <FontAwesome5
              name='smile'
              size={scale(20)}
              color={currentTheme.newIconColor}
            />
            <TextDefault textColor={currentTheme.fontNewColor} bold H5>
              {restaurant?.reviewData?.ratings ?? '0'}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontNewColor} bold H5>
              ({restaurant?.reviewData?.total ?? '0'} {t('reviews')})
            </TextDefault>
          </View>

          <TouchableOpacity
            style={styles(currentTheme).reviewButton}
            activeOpacity={0.8}
            onPress={handleNavigateToReviews}
          >
            <TextDefault bolder textColor={currentTheme.main}>
              {t('seeReviews')}
            </TextDefault>
          </TouchableOpacity>
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
                <TextDefault textColor={currentTheme.fontThirdColor} bold>
                  {t(todayOpeningTimes?.day)}{' '}
                </TextDefault>
                {todayOpeningTimes?.times?.length < 1 ? (
                  <TextDefault small bold center>
                    {t('ClosedAllDay')}
                  </TextDefault>
                ) : (
                  todayOpeningTimes?.times?.map((timing, index) => (
                    <TextDefault
                      key={index}
                      textColor={currentTheme.fontThirdColor}
                      bold
                    >
                      {timing.startTime[0]}:{timing.startTime[1]} -{' '}
                      {timing.endTime[0]}:{timing.endTime[1]}
                    </TextDefault>
                  ))
                )}
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles(currentTheme).statusButton}
            disabled={true}
          >
            <TextDefault bolder textColor={currentTheme.main}>
              {!isOpen ? t('Closed') : t('Open')}
            </TextDefault>
          </TouchableOpacity>
        </View>

        <View style={styles(currentTheme).deliveryContainer}>
          <Bicycle size={24} color={currentTheme.newFontcolor} />
          <TextDefault textColor={currentTheme.fontNewColor} bold H5>
            {restaurant?.deliveryTime} {t('Min')}
          </TextDefault>
        </View>
      </View>
    </View>
  )
}

export default React.memo(RestaurantDetailHeader)
