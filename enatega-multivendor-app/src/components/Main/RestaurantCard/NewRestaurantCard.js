import { useNavigation } from '@react-navigation/native'
import React, { useContext, useMemo } from 'react'
import { TouchableOpacity, View, Image, Alert, Platform } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { addFavouriteRestaurant } from '../../../apollo/mutations'
import UserContext from '../../../context/User'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { profile, FavouriteRestaurant } from '../../../apollo/queries'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import Spinner from '../../Spinner/Spinner'
import Bicycle from '../../../assets/SVG/Bicycle'
import { storeSearch } from '../../../utils/recentSearch'
import Ripple from 'react-native-material-ripple'
import { useCachedMediaUri } from '../../../utils/mediaCache'
import { resolveRestaurantImage } from '../../../utils/resolveImageUrl'

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`
const FAVOURITERESTAURANTS = gql`
  ${FavouriteRestaurant}
`

function NewRestaurantCard(props) {
  const { t, i18n } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(
    () => ({
      isRTL: i18n.dir() === 'rtl',
      ...theme[themeContext.ThemeValue]
    }),
    [i18n.language, themeContext.ThemeValue]
  )

  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(props?._id) : false
  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    refetchQueries: [PROFILE, FAVOURITERESTAURANTS]
  })
  const isRestaurantOpen = props?.isOpen
  const isAvailable = props?.isAvailable
  const shopType = props?.shopType
  const isDarkMode = themeContext.ThemeValue === 'Dark'
  const shopLabel = shopType === 'grocery' ? t('Store') : t('Restaurant')
  const categoryLabel = props?.categories
    ? props.categories
      .map((category) => category?.title)
      .filter(Boolean)
      .join(' • ')
    : props?.tags?.join(' • ')

  const isRestaurantClosed = !isRestaurantOpen || !isAvailable
  const imageUri = useCachedMediaUri(resolveRestaurantImage(props), 'image')

  function onCompleted() {
    FlashMessage({ message: t('favouritelistUpdated') })
  }

  const handleAddToFavorites = () => {
    if (!loadingMutation && profile) {
      mutate({ variables: { id: props?._id } })
    } else if (!profile) {
      FlashMessage({ message: t('loginRequired') })
      navigation.navigate('Profile')
    }
  }

  const handleRestaurantClick = () => {
    if (isRestaurantClosed) {
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('close'),
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => {
              if (props.shopType === 'grocery') {
                navigation.navigate('NewRestaurantDetailDesign', { ...props })
              } else {
                navigation.navigate('Restaurant', { ...props })
              }
            }
          }
        ],
        { cancelable: true }
      )
    } else {
      if (props?.shopType === 'grocery') {
        navigation.navigate('NewRestaurantDetailDesign', { ...props })
      } else {
        navigation.navigate('Restaurant', { ...props })
      }
    }
    if (props?.isSearch) {
      storeSearch(props?.isSearch)
    }
  }
  return (
    <View style={[
      styles(currentTheme).offerContainer, 
      props?.fullWidth && { width: '100%' },
      { position: 'relative' }
    ]}>
      <Ripple 
        rippleColor={'#F5F5F5'} 
        style={[
          styles(currentTheme).cardSurface,
          Platform.OS === 'android' && {
            overflow: 'hidden'
          }
        ]} 
        activeOpacity={0.8} 
        onPress={handleRestaurantClick}
        rippleContainerBorderRadius={22}
        rippleDuration={Platform.OS === 'android' ? 300 : 400}
        rippleSize={Platform.OS === 'android' ? 150 : 200}
        disabled={false}
      >
        <View style={styles(currentTheme).cardBody}>
          <View style={styles().imageContainer}>
            <Image
              resizeMode='cover'
              source={{ uri: imageUri }}
              style={[styles().restaurantImage, props?.fullWidth && { width: '100%' }]}
            />
            <View style={styles(currentTheme).badgeRow}>
              <View style={styles(currentTheme).typeBadge}>
                <TextDefault textColor={isDarkMode ? currentTheme.white : currentTheme.fontFourthColor} small bolder>
                  {shopLabel}
                </TextDefault>
              </View>
            </View>
            {isRestaurantClosed && (
              <View style={styles(currentTheme).closedOverlay}>
                <TextDefault H4 textColor={currentTheme.white} bold>
                  Closed
                </TextDefault>
              </View>
            )}
          </View>
          <View style={styles().descriptionContainer}>
            <View style={styles(currentTheme).titleRow}>
              <TextDefault H4 numberOfLines={1} textColor={currentTheme.fontFourthColor} bolder style={styles(currentTheme).titleText}>
                {props?.name}
              </TextDefault>
              <View style={styles(currentTheme).ratingBadge}>
                <FontAwesome5 name='star' size={12} color={currentTheme.orange} />
                <TextDefault textColor={isDarkMode ? currentTheme.white : currentTheme.fontFourthColor} small bolder>
                  {props?.reviewAverage}
                </TextDefault>
              </View>
            </View>
            <TextDefault
              textColor={currentTheme.gray600}
              numberOfLines={1}
              Normal
              style={styles(currentTheme).offerCategoty}
            >
              {categoryLabel}
            </TextDefault>
            <View style={styles().border} />
            <View style={styles(currentTheme).metaRow}>
              <View style={styles(currentTheme).metaPill}>
                <AntDesign name='clockcircleo' size={13} color={currentTheme.editProfileButton} />
                <TextDefault textColor={isDarkMode ? currentTheme.white : currentTheme.editProfileButton} numberOfLines={1} small bolder>
                  {props?.deliveryTime + ' '}
                  {t('min')}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).metaPill}>
                <Bicycle color={currentTheme.newFontcolor} />
                <TextDefault textColor={isDarkMode ? currentTheme.white : currentTheme.newFontcolor} numberOfLines={1} small bolder>
                  {configuration.currencySymbol} {configuration.deliveryRate}
                </TextDefault>
              </View>
              <View style={styles(currentTheme).metaPill}>
                <FontAwesome5 name='star' size={12} color={currentTheme.orange} />
                <TextDefault textColor={isDarkMode ? currentTheme.white : currentTheme.newFontcolor} numberOfLines={1} small bolder>
                  {props?.reviewCount}
                </TextDefault>
              </View>
            </View>
          </View>
        </View>
      </Ripple>
      
      <TouchableOpacity 
        activeOpacity={0.7} 
        disabled={loadingMutation} 
        onPress={handleAddToFavorites}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ 
          position: 'absolute',
          top: 10,
          ...(currentTheme?.isRTL ? { left: 10 } : { right: 10 }),
          width: scale(38),
          height: scale(28),
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          elevation: 1000
        }}
      >
        <View style={styles(currentTheme).favouriteOverlay}>
          {loadingMutation ? <Spinner size={'small'} backColor={'transparent'} spinnerColor={currentTheme.iconColorDark} /> : <AntDesign name={heart ? 'heart' : 'hearto'} size={scale(15)} color={currentTheme.iconColor} />}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(NewRestaurantCard)
