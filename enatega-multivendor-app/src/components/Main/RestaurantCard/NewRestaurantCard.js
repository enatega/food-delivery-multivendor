import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { TouchableOpacity, View, Image, Text, Alert } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import {
  AntDesign,
  FontAwesome5
} from '@expo/vector-icons'
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
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(props?._id) : false
  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    refetchQueries: [PROFILE, FAVOURITERESTAURANTS]
  })
  // const isRestaurantOpen = props?.isOpen
  const isAvailable = props?.isAvailable

  const isRestaurantClosed = !isAvailable || !props?.isOpen;
// console.log("isAvailable--->>",isAvailable)
  function onCompleted() {
    FlashMessage({ message: t('favouritelistUpdated') })
  }

  const handleAddToFavorites = (e) => {
     // Prevent the ripple/card click event
    e.preventDefault();
    e.stopPropagation();
    if (!loadingMutation && profile) {
      mutate({ variables: { id: props?._id } })
    } else if (!profile) {
      FlashMessage({ message: t('loginRequired') })
      navigation.navigate('Profile')
    }
     // Return false to ensure the event doesn't bubble up
     return false;
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
            onPress: () => navigation.navigate('Restaurant', { ...props })
          }
        ],
        { cancelable: true }
      )
    } else {
      navigation.navigate('Restaurant', { ...props })
    }
    if (props?.isSearch) {
      storeSearch(props?.isSearch)
    }
  }

  return (
    <View style={[styles(currentTheme).offerContainer, props?.fullWidth && { width: '100%' },{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // For Android
    }]}>
    {/* Main Card with Ripple Effect */}
    <Ripple
      rippleColor={'#F5F5F5'}
      style={{ width: '100%', height: '100%' }}
      activeOpacity={1}
      onPress={handleRestaurantClick}
    >
      <View style={styles().container}>
        <View style={styles().imageContainer}>
          <Image
            resizeMode='cover'
            source={{ uri: props?.image }}
            style={[
              styles().restaurantImage,
              props?.fullWidth && { width: '100%' }
            ]}
          />
          {isRestaurantClosed && (
            <View style={styles(currentTheme).closedOverlay}>
              <TextDefault H4 textColor={currentTheme.white} bold>
                Closed
              </TextDefault>
            </View>
          )}
        </View>
        <View style={styles().descriptionContainer}>
          <View style={styles(currentTheme).aboutRestaurant}>
            <TextDefault
              H4
              numberOfLines={1}
              textColor={currentTheme.fontThirdColor}
              bolder
            >
              {props?.name}
            </TextDefault>
          </View>
          <TextDefault
            textColor={currentTheme.gray600}
            numberOfLines={1}
            bold
            Normal
            style={styles(currentTheme).offerCategoty}
          >
            {props?.categories
              ? props?.categories.map((category) => category?.title + ', ')
              : props?.tags?.join(',')}
          </TextDefault>
          <View style={styles().border} />
          <View style={styles(currentTheme).deliveryInfo}>
            <View style={styles(currentTheme).deliveryTime}>
              <AntDesign
                name='clockcircleo'
                size={15}
                color={currentTheme.editProfileButton}
              />
              <TextDefault
                textColor={currentTheme.editProfileButton}
                numberOfLines={1}
                bold
                Normal
              >
                {props?.deliveryTime + ' '}
                {t('min')}
              </TextDefault>
            </View>
            <View style={styles(currentTheme).deliveryTime}>
              <Bicycle color={currentTheme.newFontcolor} />
              <TextDefault
                textColor={currentTheme.newFontcolor}
                numberOfLines={1}
                bold
                Normal
              >
                {configuration.currencySymbol} {configuration.deliveryRate}
              </TextDefault>
            </View>
            <View style={styles(currentTheme).aboutRestaurant}>
              <FontAwesome5
                name='star'
                size={14}
                color={currentTheme.newFontcolor}
              />
              <TextDefault textColor={currentTheme.newFontcolor} bold Normal>
                {props?.reviewAverage}
              </TextDefault>
              <TextDefault textColor={currentTheme.newFontcolor} bold Normal>
                ({props?.reviewCount})
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
    </Ripple>
    
    {/* Place it outside Ripple otherwise fav icon will not work on pressing */}
     <View
     style={[
       styles().overlayContainer,
       props?.fullWidth && { width: '100%' },
      ]}
      // pointerEvents="box-none"--> This would prevent the underlying Ripple component from receiving touch events
      pointerEvents="box-none"
   >
     <TouchableOpacity
       activeOpacity={0.7}
       disabled={loadingMutation}
       onPress={handleAddToFavorites}
     >
       <View style={styles(currentTheme).favouriteOverlay}>
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
             color={currentTheme.iconColor}
           />
         )}
       </View>
     </TouchableOpacity>
   </View>
   </View>
  )
}

export default React.memo(NewRestaurantCard)
