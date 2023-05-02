import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { TouchableOpacity, View, Image } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { addFavouriteRestaurant } from '../../../apollo/mutations'
import { profile } from '../../../apollo/queries'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import { useMutation, gql } from '@apollo/client'
import Spinner from '../../Spinner/Spinner'
import UserContext from '../../../context/User'

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`
function RestaurantCard(props) {
  const configuration = useContext(ConfigurationContext)
  const { profile: user } = useContext(UserContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const index = props?.index
  const heart = user ? user.favourite.includes(props._id) : false

  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    refetchQueries: [{ query: PROFILE }]
  })

  function onCompleted() {
    FlashMessage({ message: 'Favourite list updated.' })
  }

  return (
    <View style={{ ...alignment.PRsmall }}>
      <TouchableOpacity
        style={[styles(currentTheme, index).offerContainer, styles().ML20]}
        activeOpacity={1}
        onPress={() => navigation.navigate('Restaurant', { ...props })}>
        <View style={[styles().imageContainer]}>
          <Image
            resizeMode="cover"
            source={{ uri: props.image }}
            style={{
              width: scale(125),
              height: '100%',
              borderRadius: 20,
              alignSelf: 'center'
            }}
          />
          <View style={styles().overlayContainer}>
            <View style={styles(currentTheme).deliveryOverlay}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                numberOfLines={2}
                smaller
                center>
                {`${props.deliveryTime} MIN`}
              </TextDefault>
            </View>
            <View style={styles(currentTheme).labelOverlay}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                numberOfLines={2}
                smaller
                center>
                {`${props.name}`}
              </TextDefault>
            </View>
            <TouchableOpacity
              activeOpacity={0}
              disabled={loadingMutation}
              onPress={() =>
                profile ? mutate({ variables: { id: props._id } }) : null
              }
              style={styles(currentTheme).favouriteOverlay}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                numberOfLines={2}
                smaller
                center>
                {loadingMutation ? (
                  <Spinner size={'small'} backColor={'transparent'} />
                ) : (
                  <AntDesign
                    name={heart ? 'heart' : 'hearto'}
                    size={scale(15)}
                    color="black"
                  />
                )}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles().descriptionContainer}>
          <View style={styles().aboutRestaurant}>
            <TextDefault
              style={{ width: '100%' }}
              numberOfLines={1}
              textColor={
                index % 2 === 0 ? currentTheme.fontMainColor : currentTheme.main
              }
              bolder>
              {props.name}
            </TextDefault>
            <View style={[styles().rating]}>
              <Ionicons name="md-star" size={scale(10)} color="green" />
              <TextDefault
                textColor={
                  index % 2 === 0
                    ? currentTheme.fontMainColor
                    : currentTheme.main
                }
                style={{ marginLeft: 2 }}
                bold
                smaller>
                {props.reviewData.ratings}
              </TextDefault>
              <TextDefault
                textColor={
                  index % 2 === 0
                    ? currentTheme.fontMainColor
                    : currentTheme.main
                }
                style={{ marginLeft: 2 }}
                bold
                smaller>
                ({props.reviewData.reviews.length})
              </TextDefault>
            </View>
          </View>
          <TextDefault
            textColor={
              index % 2 === 0 ? currentTheme.fontMainColor : currentTheme.main
            }
            numberOfLines={1}
            bolder
            small
            style={styles().offerCategoty}>
            {props.categories.map(category => category.title).toString()}
          </TextDefault>
          <TextDefault
            textColor={
              index % 2 === 0 ? currentTheme.fontMainColor : currentTheme.main
            }
            numberOfLines={1}
            style={{ marginTop: 3 }}
            bolder
            medium>
            <TextDefault
              textColor={
                index % 2 === 0 ? currentTheme.fontMainColor : currentTheme.main
              }
              small>
              {' '}
              minimum{' '}
            </TextDefault>
            {configuration.currencySymbol} {props.minimumOrder}
          </TextDefault>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(RestaurantCard)
