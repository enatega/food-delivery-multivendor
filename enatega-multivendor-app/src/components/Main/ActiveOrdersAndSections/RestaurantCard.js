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
import { Ionicons } from '@expo/vector-icons'
import {useTranslation} from 'react-i18next'

function RestaurantCard(props) {

  const {t} = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={{ ...alignment.PRsmall }}>
      <TouchableOpacity
        style={[styles(currentTheme).offerContainer, styles().ML20]}
        activeOpacity={1}
        onPress={() => navigation.navigate('Restaurant', { ...props })}>
        <View style={styles().imageContainer}>
          <Image
            resizeMode="cover"
            source={{ uri: props.image }}
            style={styles().restaurantImage}
          />
          <View style={styles().overlayContainer}>
            <View style={styles(currentTheme).deliveryOverlay}>
              <TextDefault
                textColor={currentTheme.fontMainColor}
                numberOfLines={1}
                smaller
                bold
                center>
                {props.deliveryTime + ' '}
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
              {props.name}
            </TextDefault>
            <View style={[styles().aboutRestaurant, { width: '23%' }]}>
              <Ionicons
                name="star"
                size={scale(12)}
                color={currentTheme.primary}
              />
              <TextDefault
                textColor={currentTheme.fontMainColor}
                style={styles().restaurantRatingContainer}
                bold
                smaller>
                {props.reviewData.ratings}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontSecondColor}
                style={styles().restaurantRatingContainer}
                bold
                smaller>
                ({props.reviewData.reviews.length})
              </TextDefault>
            </View>
          </View>
          <TextDefault
            textColor={currentTheme.fontSecondColor}
            numberOfLines={1}
            bold
            small
            style={styles().offerCategoty}>
            {props.categories.map(category => category.title).toString()}
          </TextDefault>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            numberOfLines={1}
            style={styles().restaurantPriceContainer}
            bold
            small>
            {configuration.currencySymbol} {props.minimumOrder}
            <TextDefault textColor={currentTheme.fontSecondColor} small>
              {' '}
              {t('min')}
            </TextDefault>
          </TextDefault>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(RestaurantCard)
