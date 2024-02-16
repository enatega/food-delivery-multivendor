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
  Ionicons,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

function NewRestaurantCard(props) {
  const { t } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={{ ...alignment.PRsmall }}>
      <TouchableOpacity
        style={styles(currentTheme).offerContainer}
        activeOpacity={1}
        onPress={() => navigation.navigate('Restaurant', { ...props })}>
        <View style={styles().imageContainer}>
          <Image
            resizeMode="cover"
            source={{ uri: props.image }}
            style={styles().restaurantImage}
          />

          <View style={styles().overlayContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                alert('Coming soon')
              }}>
              <View style={styles(currentTheme).favouriteOverlay}>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={currentTheme.iconColorDark}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles().descriptionContainer}>
          <View style={styles().aboutRestaurant}>
            <TextDefault
              H4
              numberOfLines={1}
              textColor={currentTheme.fontThirdColor}
              bolder>
              {props.name}
            </TextDefault>
            <View style={styles().aboutRestaurant}>
              <FontAwesome5 name="star" size={18} color={currentTheme.orange} />

              <TextDefault
                textColor={currentTheme.fontThirdColor}
                style={styles().restaurantRatingContainer}
                bolder
                H4>
                {props.reviewData.ratings}
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontNewColor}
                style={[
                  styles().restaurantRatingContainer,
                  styles().restaurantTotalRating
                ]}
                H5>
                ({props.reviewData.reviews.length > 0 ? props.reviewData.reviews.length + '+' : props.reviewData.reviews.length})
              </TextDefault>
            </View>
          </View>
          <TextDefault
            textColor={currentTheme.fontNewColor}
            numberOfLines={1}
            bold
            Normal
            style={styles().offerCategoty}>
            {props.categories.map(category => category.title).toString()}
          </TextDefault>
          <View style={styles().deliveryInfo}>
            <View style={styles().deliveryTime}>
              <AntDesign
                name="clockcircleo"
                size={16}
                color={currentTheme.fontNewColor}
              />

              <TextDefault
                textColor={currentTheme.fontNewColor}
                numberOfLines={1}
                bold
                Normal>
                30
              </TextDefault>
              <TextDefault
                textColor={currentTheme.fontNewColor}
                numberOfLines={1}
                bold
                Normal>
                mins
              </TextDefault>
            </View>
            <View style={styles().deliveryTime}>
              <MaterialCommunityIcons
                name="bike"
                size={16}
                color={currentTheme.fontNewColor}
              />

              <TextDefault
                textColor={currentTheme.fontNewColor}
                numberOfLines={1}
                bold
                Normal>
                $2
              </TextDefault>
            </View>
          </View>

          {/* <TextDefault
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
          </TextDefault> */}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(NewRestaurantCard)
