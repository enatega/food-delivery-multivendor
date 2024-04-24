import React, { useContext } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import ConfigurationContext from '../../../context/Configuration'
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import { DAYS } from '../../../utils/enums'
import { profile } from '../../../apollo/queries'
import { addFavouriteRestaurant } from '../../../apollo/mutations'
import UserContext from '../../../context/User'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import Spinner from '../../Spinner/Spinner'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import {useTranslation} from 'react-i18next'


const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`
const PROFILE = gql`
  ${profile}
`

function Item(props) {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(props.item._id) : false
  const item = props.item
  const category = item.categories.map(category => category.title)
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    refetchQueries: [{ query: PROFILE }]
  })
  const { isAvailable, openingTimes } = item
  const isOpen = () => {
    const date = new Date()
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const todaysTimings = openingTimes.find(o => o.day === DAYS[day])
    if (todaysTimings === undefined) return false
    const times = todaysTimings.times.filter(
      t =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    )
    return times.length > 0
  }

  function onCompleted() {
    FlashMessage({ message: t('favouritelistUpdated') })
  }
  return (
    <TouchableOpacity
      style={{ padding: scale(10) }}
      activeOpacity={1}
      onPress={() => navigation.navigate('Restaurant', { ...item })}>
      <View key={item._id} style={styles().mainContainer}>
        <View style={[styles(currentTheme).restaurantContainer]}>
          <View style={styles().imageContainer}>
            <Image
              resizeMode="cover"
              source={{ uri: item.image }}
              style={styles().img}
            />
            <View style={styles().overlayRestaurantContainer}>
              <TouchableOpacity
                activeOpacity={0}
                disabled={loadingMutation}
                style={styles(currentTheme).favOverlay}
                onPress={() =>
                  profile ? mutate({ variables: { id: item._id } }) : null
                }>
                {loadingMutation ? (
                  <Spinner size={'small'} backColor={'transparent'} />
                ) : (
                  <AntDesign
                    name={heart ? 'heart' : 'hearto'}
                    size={scale(15)}
                    color="black"
                  />
                )}
              </TouchableOpacity>
              {(!isAvailable || !isOpen()) && (
                <View style={{ ...styles().featureOverlay, top: 40 }}>
                  <TextDefault
                    style={[
                      styles(currentTheme).featureText,
                      {
                        ...alignment.MTxSmall,
                        ...alignment.PLsmall,
                        ...alignment.PRsmall,
                        ...alignment.PTxSmall,
                        ...alignment.PBxSmall
                      }
                    ]}
                    textColor={currentTheme.fontWhite}
                    numberOfLines={1}
                    small
                    bold
                    uppercase>
                    {t('Closed')}
                  </TextDefault>
                </View>
              )}
              <View style={styles(currentTheme).deliveryRestaurantOverlay}>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  numberOfLines={1}
                  small
                  bolder
                  center>
                  {item.deliveryTime + ' '}
                  {t('min')}
                </TextDefault>
              </View>
            </View>
          </View>
          <View style={styles().descriptionContainer}>
            <View style={styles().aboutRestaurant}>
              <TextDefault
                style={{ width: '77%' }}
                numberOfLines={1}
                textColor={currentTheme.fontMainColor}
                bolder>
                {item.name}
              </TextDefault>
              <View style={[styles().aboutRestaurant, { width: '23%' }]}>
                <Ionicons
                  name="md-star"
                  size={scale(15)}
                  color={currentTheme.primary}
                />
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  style={{ marginLeft: scale(2), fontSize: 12 }}
                  bolder
                  smaller>
                  {item.reviewData.ratings}
                </TextDefault>
                <TextDefault
                  textColor={currentTheme.fontSecondColor}
                  style={{ marginLeft: scale(2), fontSize: 12 }}
                  bold
                  smaller>
                  ({item.reviewData.reviews.length})
                </TextDefault>
              </View>
            </View>
            <TextDefault
              style={styles().offerCategoty}
              textColor={currentTheme.fontSecondColor}
              numberOfLines={1}
              small>
              {category.toString()}
            </TextDefault>
            <View style={styles().priceRestaurant}>
              <TextDefault
                style={styles().offerCategoty}
                textColor={currentTheme.fontMainColor}
                numberOfLines={1}
                small
                bold>
                {configuration.currencySymbol + ' ' + item.minimumOrder}{' '}
                <TextDefault textColor={currentTheme.fontSecondColor} small>
                  {' '}
                  {t('min')}
                </TextDefault>
              </TextDefault>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Item
