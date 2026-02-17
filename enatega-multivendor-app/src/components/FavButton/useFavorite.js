import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import UserContext from '../../context/User'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { addFavouriteRestaurant } from '../../apollo/mutations'
import { profile } from '../../apollo/queries'

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`

export const useFavorite = (restaurantId) => {
  const { t } = useTranslation()
  const { profile } = useContext(UserContext)
  const navigation = useNavigation()
  const isFavorite = profile ? profile.favourite.includes(restaurantId) : false

  const [mutate, { loading }] = useMutation(ADD_FAVOURITE, {
    onCompleted: () => FlashMessage({ message: t('favouritelistUpdated') }),
    refetchQueries: [{ query: PROFILE }]
  })

  const toggleFavorite = () => {
    if (loading) return
    if (profile) {
      mutate({ variables: { id: restaurantId } })
    } else {
      FlashMessage({ message: t('loginRequired') })
      navigation.navigate('CreateAccount')
    }
  }

  return { isFavorite, loading, toggleFavorite }
}
