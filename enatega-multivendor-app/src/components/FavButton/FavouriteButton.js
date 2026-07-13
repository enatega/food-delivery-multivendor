import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import UserContext from '../../context/User'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useTranslation } from 'react-i18next'
import { addFavouriteRestaurant } from '../../apollo/mutations'
import { profile } from '../../apollo/queries'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'
import Spinner from '../Spinner/Spinner'
import { useNavigation } from '@react-navigation/native'

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`

const FavoriteButton = ({ restaurantId, iconSize }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(restaurantId) : false
  const navigation = useNavigation()

  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted: () => {
      FlashMessage({ message: t('favouritelistUpdated') })
    },
    refetchQueries: [{ query: PROFILE }]
  })

  const handleAddToFavorites = () => {
    console.log('FavoriteButton pressed!', { restaurantId, loadingMutation, profile: !!profile })
    
    if (loadingMutation) {
      console.log('Button disabled due to loading state')
      return
    }
    
    if (profile) {
      console.log('Adding to favorites...')
      mutate({ variables: { id: restaurantId } })
    } else {
      console.log('User not logged in, showing login message')
      FlashMessage({ message: t('loginRequired') }) 
      navigation.navigate('CreateAccount') 
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={loadingMutation}
      onPress={handleAddToFavorites}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      pointerEvents={loadingMutation ? 'none' : 'auto'}
      style={{
        minWidth: scale(44),
        minHeight: scale(44),
        paddingHorizontal: scale(8),
        paddingVertical: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 9999,
        position: 'relative'
      }}
    >
      {loadingMutation ? (
        <Spinner
          size={'small'}
          backColor={'transparent'}
          spinnerColor={currentTheme.iconColorDark}
        />
      ) : (
        <AntDesign
          name={heart ? 'heart' : 'hearto'}
          size={iconSize}
          color={currentTheme.newIconColor}
        />
      )}
    </TouchableOpacity>
  )
}

export default FavoriteButton
