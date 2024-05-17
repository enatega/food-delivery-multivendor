import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons
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
  const { t } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(props._id) : false
  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    // refetchQueries: [{ query: PROFILE }]
    refetchQueries: [PROFILE, FAVOURITERESTAURANTS]
  })
  // console.log('PROPS => ', JSON.stringify(props, null, 3))

  function onCompleted() {
    FlashMessage({ message: t('favouritelistUpdated') })
    // alert("favv list updated")
  }

  const handleAddToFavorites = () => {
    if (!loadingMutation && profile) {
      mutate({ variables: { id: props._id } })
    }
  }

  const handleRestaurantClick = () => { 
    navigation.navigate('Restaurant', { ...props })
    if (props?.isSearch) {
      storeSearch(props?.isSearch)
    }
   }

  return (
    <TouchableOpacity
      style={[
        styles(currentTheme).offerContainer,
        props?.fullWidth && { width: '100%' }
      ]}
      activeOpacity={1}
      onPress={() => handleRestaurantClick()}
    >
      <View style={styles().container}>
        <View style={styles().imageContainer}>
          <Image
            resizeMode='cover'
            source={{ uri: props.image }}
            style={[
              styles().restaurantImage,
              props?.fullWidth && { width: '100%' }
            ]}
          />
        </View>
        <View style={styles().descriptionContainer}>
          <View style={styles().aboutRestaurant}>
            <TextDefault
              H4
              numberOfLines={1}
              textColor={currentTheme.fontThirdColor}
              bolder
            >
              {props.name}
            </TextDefault>
            {props.fullWidth && (
              <View style={styles(currentTheme).deliveryTimeNew}>
                <TextDefault bolder Normal textColor={currentTheme.main}>
                  {props.deliveryTime} mins
                </TextDefault>
              </View>
            )}
          </View>
          <TextDefault
            textColor={currentTheme.gray600}
            numberOfLines={1}
            bold
            Normal
            style={styles().offerCategoty}
          >
            {props?.categories ? props.categories.map((category) => category.title + ', ') : props?.tags?.join(',')}
          </TextDefault>
          <View style={styles().border} />
          <View style={styles().deliveryInfo}>
            <View style={styles().deliveryTime}>
              <AntDesign
                name='clockcircleo'
                size={14}
                color={currentTheme.editProfileButton}
              />

              <TextDefault
                textColor={currentTheme.editProfileButton}
                numberOfLines={1}
                bold
                Normal
              >
                {props.deliveryTime + ' '}
                {t('min')}
              </TextDefault>
            </View>
            <View style={styles().deliveryTime}>
              <Bicycle color={currentTheme.newFontcolor}/>

              <TextDefault
                textColor={currentTheme.newFontcolor}
                numberOfLines={1}
                bold
                Normal
              >
                {configuration.currencySymbol}{props.tax}
              </TextDefault>
            </View>
            <View style={styles().aboutRestaurant}>
              <FontAwesome5 name='star' size={14} color={currentTheme.newFontcolor} />

              <TextDefault textColor={currentTheme.newFontcolor} bold Normal>
                {props.reviewAverage}
              </TextDefault>
              <TextDefault textColor={currentTheme.newFontcolor} bold Normal>
                ({props.reviewCount})
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
      <View
        style={[
          styles().overlayContainer,
          props?.fullWidth && { width: '100%' }
        ]}
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
    </TouchableOpacity>
  )
}

export default React.memo(NewRestaurantCard)
